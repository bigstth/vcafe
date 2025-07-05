import { createPostFailed, noPostFoundError } from './errors'
import { createPostRepository, getAllPostsRepository, type GetPostsOptions, type GetPostsResult } from './repository'
import { AppError } from '@server/lib/error'
import { db } from '@server/db/db-instance'
import { posts, postImages } from '@server/db/feed-schema'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

type Post = typeof posts.$inferSelect

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

export interface CreatePostData {
    userId: string
    content: string
    visibility?: 'public' | 'follower_only' | 'membership_only'
}

export const getAllPostsService = async (options: GetPostsOptions): Promise<GetPostsResult> => {
    const posts = await getAllPostsRepository(options)

    if (!posts) {
        throw new AppError(noPostFoundError)
    }

    return posts
}

export const createPostService = async (data: CreatePostData): Promise<Post> => {
    const { userId, content, visibility } = data

    const newPost = await createPostRepository({
        userId,
        content,
        visibility,
    })

    if (!newPost) {
        throw new AppError(noPostFoundError)
    }

    return newPost
}

// Implemented createPostWithImagesService
export interface CreatePostWithImagesData {
    userId: string
    content: string
    visibility?: 'public' | 'follower_only' | 'membership_only'
    images?: File[] | Buffer[]
}

export const createPostWithImagesService = async (data: CreatePostWithImagesData) => {
    const postId = uuidv4()
    const uploadedImagePaths: string[] = []

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
                const imageRecords = []

                for (let i = 0; i < data.images.length; i++) {
                    const image = data.images[i]
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

                    // อัปโหลดรูปไป Supabase Storage ด้วย Service Role Key
                    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from('vcafe-feed').upload(imagePath, uploadBody, {
                        cacheControl: '3600',
                        upsert: false,
                        metadata: {
                            uploadedBy: data.userId,
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

                const createdImages = await tx.insert(postImages).values(imageRecords).returning()

                return {
                    post: newPost,
                    images: createdImages,
                }
            }

            return {
                post: newPost,
                images: [],
            }
        })
    } catch (error) {
        if (uploadedImagePaths.length > 0) {
            for (const imagePath of uploadedImagePaths) {
                try {
                    await supabaseAdmin.storage.from('vcafe-feed').remove([imagePath])
                } catch (deleteError) {
                    console.error('Failed to delete uploaded image:', imagePath, deleteError)
                }
            }
        }

        throw new AppError(createPostFailed)
    }
}
