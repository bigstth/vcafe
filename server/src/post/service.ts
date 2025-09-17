import {
    cannotUnarchiveDeletedPost,
    createPostFailed,
    failedToArchive,
    failedToDelete,
    failedToUnarchive,
    insufficientPermissionToUnarchive,
    insufficientPermissionToDelete,
    noPostFoundError,
    postAlreadyArchived,
    postAlreadyDeleted,
    postNotArchived,
    insufficientPermissionToArchive
} from './errors.js'
import {
    archivePostRepository,
    canModifyPostRepository,
    getPostRepository,
    type GetPostsOptions,
    getPostsWithImagesRepository,
    softDeletePostRepository,
    unarchivePostRepository,
    getPostLikeRepository,
    likePostRepository,
    unlikePostRepository
} from './repository.js'

import { v4 as uuidv4 } from 'uuid'
import { CustomLogger } from '../lib/custom-logger.js'
import { AppError } from '../lib/error.js'
import { formatAvatarImageUrl, mapImageUrls } from '../lib/map-image-urls.js'
import { db } from '../db/db-instance.js'
import { postImages, posts } from '../db/feed-schema.js'
import supabaseAdmin from '../db/supabase-instance.js'
import { getCommentsRepository } from '../comment/repository.js'
import type { Context } from 'hono'
interface CreatePostWithImagesData {
    userId: string
    content: string
    visibility?: 'public' | 'follower_only' | 'membership_only'
    images?: File[] | Buffer[]
}

export const getPostsService = async (c: Context, options: GetPostsOptions) => {
    const result = await getPostsWithImagesRepository(options)
    const currentUserId = c.get('user')?.id

    if (!result) {
        throw new AppError(noPostFoundError)
    }

    const postsWithAdditionalData = await Promise.all(
        result.posts.map(async (post) => {
            const postResponse = {
                ...post,
                author: {
                    ...post.author,
                    image: formatAvatarImageUrl(post.author.image || '')
                },
                images: mapImageUrls(post.images)
            }
            try {
                const comments = await getCommentsRepository(post.id)
                const likes = await getPostLikeRepository(
                    post.id,
                    currentUserId
                )

                return {
                    ...postResponse,
                    likesCount: likes.likeCount,
                    hasLiked: likes.hasLiked,
                    commentsCount: comments?.length
                }
            } catch (error) {
                return {
                    ...postResponse,
                    likesCount: 0,
                    hasLiked: false,
                    commentsCount: 0
                }
            }
        })
    )

    return {
        total: result.total,
        hasMore: result.hasMore,
        posts: postsWithAdditionalData
    }
}

export const getPostService = async (id: string) => {
    const post = await getPostRepository(id)

    if (!post) {
        throw new AppError(noPostFoundError)
    }

    const formattedImgUrls = mapImageUrls(post.images)

    return {
        ...post,
        author: {
            ...post.author,
            image: formatAvatarImageUrl(post.author.id)
        },
        images: formattedImgUrls
    }
}

export const createPostWithImagesService = async (
    data: CreatePostWithImagesData
) => {
    const postId = uuidv4()

    try {
        return await db.transaction(async (tx) => {
            const [newPost] = await tx
                .insert(posts)
                .values({
                    id: postId,
                    userId: data.userId,
                    content: data.content,
                    visibility: data.visibility || 'public'
                })
                .returning()

            if (data.images && data.images.length > 0) {
                const imageRecords = await uploadPostImages(
                    data?.images,
                    postId,
                    data?.userId
                )

                const createdImages =
                    imageRecords && imageRecords.length > 0
                        ? await tx
                              .insert(postImages)
                              .values(imageRecords)
                              .returning()
                        : []

                return {
                    ...newPost,
                    images: createdImages
                }
            }

            return newPost
        })
    } catch (error) {
        CustomLogger.error('Error creating post with images', error)
        throw new AppError(createPostFailed)
    }
}

export const softDeletePostService = async (postId: string, userId: string) => {
    // Check permissions first
    const permissions = await canModifyPostRepository(postId, userId)

    if (!permissions.exists) {
        throw new AppError(insufficientPermissionToDelete)
    }

    if (permissions.isDeleted) {
        throw new AppError(postAlreadyDeleted)
    }

    // Call repository
    const deletedPost = await softDeletePostRepository(postId, userId)

    if (!deletedPost) {
        throw new AppError(failedToDelete)
    }

    CustomLogger.info('Post soft deleted successfully', {
        postId,
        userId,
        deletedAt: deletedPost.deletedAt
    })

    return {
        success: true,
        message: 'Post deleted successfully'
    }
}

export const archivePostService = async (postId: string, userId: string) => {
    // Check if user can archive this post
    const { canArchive, exists, isDeleted, isArchived } =
        await canModifyPostRepository(postId, userId)

    if (!exists) {
        throw new AppError(insufficientPermissionToArchive)
    }

    if (!canArchive) {
        if (isDeleted) {
            throw new AppError(postAlreadyDeleted)
        } else if (isArchived) {
            throw new AppError(postAlreadyArchived)
        } else {
            throw new AppError(insufficientPermissionToArchive)
        }
    }

    const archivedPost = await archivePostRepository(postId, userId)

    if (!archivedPost) {
        throw new AppError(failedToArchive)
    }

    CustomLogger.info('Post archived successfully', {
        postId,
        userId,
        archivedAt: archivedPost.archivedAt
    })

    return {
        success: true,
        message: 'Post archived successfully'
    }
}

export const unarchivePostService = async (postId: string, userId: string) => {
    const { exists, canUnarchive, isArchived, isDeleted } =
        await canModifyPostRepository(postId, userId)

    if (!exists) {
        throw new AppError(noPostFoundError)
    }

    if (!canUnarchive) {
        if (isDeleted) {
            throw new AppError(cannotUnarchiveDeletedPost)
        } else if (!isArchived) {
            throw new AppError(postNotArchived)
        } else {
            throw new AppError(insufficientPermissionToUnarchive)
        }
    }

    const unArchivedPost = await unarchivePostRepository(postId, userId)

    if (!unArchivedPost) {
        throw new AppError(failedToUnarchive)
    }

    CustomLogger.info('Post unarchived successfully', {
        postId,
        userId
    })

    return {
        success: true,
        message: 'Post unarchived successfully'
    }
}

const uploadPostImages = async (
    images: CreatePostWithImagesData['images'],
    postId: string,
    userId: string
) => {
    if (!images?.length) return
    const uploadedImagePaths: string[] = []
    const imageRecords: {
        id: string
        postId: string
        url: string
        displayOrder: number
        altText: string
    }[] = []
    const MAX_FILE_SIZE = 10 * 1024 * 1024

    try {
        for (let i = 0; i < images.length; i++) {
            const image = images[i]
            if (!image) {
                throw new Error(`Image at index ${i} is undefined`)
            }

            let fileSize: number
            if (typeof Buffer !== 'undefined' && image instanceof Buffer) {
                fileSize = image.length
            } else if (image instanceof File) {
                fileSize = image.size
            } else {
                throw new Error(`Invalid image format at index ${i}`)
            }

            if (fileSize > MAX_FILE_SIZE) {
                throw new Error(
                    `Image ${
                        i + 1
                    } exceeds maximum file size of 10MB (current size: ${(
                        fileSize /
                        1024 /
                        1024
                    ).toFixed(2)}MB)`
                )
            }

            const imageId = uuidv4()
            const imagePath = `posts/${postId}/${imageId}`

            let uploadBody: File | Uint8Array
            if (typeof Buffer !== 'undefined' && image instanceof Buffer) {
                uploadBody = new Uint8Array(image)
            } else {
                uploadBody = image as File
            }

            const { data: uploadData, error: uploadError } =
                await supabaseAdmin.storage
                    .from('vcafe-feed')
                    .upload(imagePath, uploadBody, {
                        cacheControl: '3600',
                        upsert: false,
                        metadata: {
                            uploadedBy: userId,
                            postId: postId
                        }
                    })

            if (uploadError) {
                throw new Error(
                    `Failed to upload image ${i + 1}: ${uploadError.message}`
                )
            }

            uploadedImagePaths.push(uploadData.path)

            imageRecords.push({
                id: imageId,
                postId,
                url: uploadData.path,
                displayOrder: i,
                altText: `Image ${i + 1}`
            })
        }
        return imageRecords
    } catch (error) {
        // Cleanup uploaded images if there was an error
        if (uploadedImagePaths.length > 0) {
            for (const imagePath of uploadedImagePaths) {
                try {
                    await supabaseAdmin.storage
                        .from('vcafe-feed')
                        .remove([imagePath])
                } catch (deleteError) {
                    CustomLogger.error('Failed to delete uploaded image', {
                        imagePath,
                        error: deleteError
                    })
                }
            }
        }
        throw error
    }
}

export const getPostLikeService = async (postId: string, userId: string) => {
    const result = await getPostLikeRepository(postId, userId)
    if (!result) {
        throw new AppError(noPostFoundError)
    }
    return result
}

export const toggleLikePostService = async (postId: string, userId: string) => {
    const checkLiked = await getPostLikeRepository(postId, userId)
    let result: { userId: string; createdAt: Date; postId: string } | null =
        null

    if (!checkLiked) {
        throw new AppError(noPostFoundError)
    }

    if (checkLiked.hasLiked) {
        result = await unlikePostRepository(postId, userId)
    } else {
        result = await likePostRepository(postId, userId)
    }

    if (!result) {
        throw new AppError(noPostFoundError)
    }
    return result
}
