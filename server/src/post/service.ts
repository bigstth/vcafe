import { createPostFailed, noPostFoundError } from './errors'
import { getPostRepository, getPostImagesRepository, type GetPostsOptions, type GetPostsResult, getPostsWithImagesRepository } from './repository'
import { AppError } from '@server/lib/error'
import { CustomLogger } from '@server/lib/custom-logger'
import { db } from '@server/db/db-instance'
import { posts, postImages } from '@server/db/feed-schema'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import type { Post } from '@server/types/schema'
interface PostWithImages extends Post {
    images?: string[]
}

interface GetPostsResponse extends GetPostsResult {
    posts: PostWithImages[]
}

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

interface CreatePostWithImagesData {
    userId: string
    content: string
    visibility?: 'public' | 'follower_only' | 'membership_only'
    images?: File[] | Buffer[]
}

export const getPostsService = async (options: GetPostsOptions) => {
    try {
        const result = await getPostsWithImagesRepository(options)

        if (!result) {
            throw new AppError(noPostFoundError)
        }

        const postsWithImageUrls = result.posts.map((post) => ({
            ...post,
            images: post.images ? post.images.map((img: any) => `${process.env.SUPABASE_URL}/storage/v1/object/public/vcafe-feed/${img.url}`) : [],
        }))

        return {
            ...result,
            posts: postsWithImageUrls,
        }
    } catch (error) {
        CustomLogger.error('Error in getAllPostsService', error)
        throw error
    }
}

export const getPostService = async (id: string) => {
    const post = await getPostRepository(id)

    if (!post) {
        throw new AppError(noPostFoundError)
    }

    const formattedImgUrls = post.images.map((img) => ({
        ...img,
        url: `${process.env.SUPABASE_URL}/storage/v1/object/public/vcafe-feed/${img.url}`,
    }))

    return { ...post, images: formattedImgUrls }
}

export const createPostWithImagesService = async (data: CreatePostWithImagesData) => {
    const postId = uuidv4()

    try {
        return await db.transaction(async (tx) => {
            const [newPost] = await tx
                .insert(posts)
                .values({
                    id: postId,
                    userId: data.userId,
                    content: data.content,
                    visibility: data.visibility || 'public',
                })
                .returning()

            if (data.images && data.images.length > 0) {
                const imageRecords = await uploadPostImages(data?.images, postId, data?.userId)

                const createdImages = imageRecords && imageRecords.length > 0 ? await tx.insert(postImages).values(imageRecords).returning() : []

                return {
                    ...newPost,
                    images: createdImages,
                }
            }

            return newPost
        })
    } catch (error) {
        CustomLogger.error('Error creating post with images', error)
        throw new AppError(createPostFailed)
    }
}

const uploadPostImages = async (images: CreatePostWithImagesData['images'], postId: string, userId: string) => {
    if (!images?.length) return
    const uploadedImagePaths: string[] = []
    const imageRecords = []

    try {
        for (let i = 0; i < images.length; i++) {
            const image = images[i]
            if (!image) {
                throw new Error(`Image at index ${i} is undefined`)
            }
            const imageId = uuidv4()
            const imagePath = `posts/${postId}/${imageId}`

            let uploadBody: File | Uint8Array
            if (typeof Buffer !== 'undefined' && image instanceof Buffer) {
                uploadBody = new Uint8Array(image)
            } else {
                uploadBody = image as File
            }

            const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from('vcafe-feed').upload(imagePath, uploadBody, {
                cacheControl: '3600',
                upsert: false,
                metadata: {
                    uploadedBy: userId,
                    postId: postId,
                },
            })

            if (uploadError) {
                throw new Error(`Failed to upload image ${i + 1}: ${uploadError.message}`)
            }

            uploadedImagePaths.push(uploadData.path)

            imageRecords.push({
                id: imageId,
                postId,
                url: uploadData.path,
                displayOrder: i,
                altText: `Image ${i + 1}`,
            })
        }
        return imageRecords
    } catch (error) {
        if (uploadedImagePaths.length > 0) {
            for (const imagePath of uploadedImagePaths) {
                try {
                    await supabaseAdmin.storage.from('vcafe-feedtest').remove([imagePath])
                } catch (deleteError) {
                    CustomLogger.error('Failed to delete uploaded image', { imagePath, error: deleteError })
                }
            }
        }
        throw error
    }
}
