import {
    getMeRepository,
    getUserByUsernameRepository,
    getUserPostsRepository,
    updateUserRepository
} from './repository.js'
import {
    setPasswordError,
    updateUserError,
    uploadAvatarError,
    userAlreadyExistsError,
    userNotFoundError
} from './errors.js'
import type { Context } from 'hono'
import supabaseAdmin from '../db/supabase-instance.js'
import { getFollowStatsService } from '../follow/service.js'
import { auth } from '../lib/auth.js'
import { CustomLogger } from '../lib/custom-logger.js'
import { AppError } from '../lib/error.js'
import { mapImageUrl } from '../lib/format-image-url.js'
import { formatAvatarImageUrl, mapImageUrls } from '../lib/map-image-urls.js'
import { noPostFoundError } from '../post/errors.js'
import { getCommentsRepository } from '../comment/repository.js'
import { getPostLikeRepository } from '../post/repository.js'

export const getMeService = async (c: Context) => {
    const user = c.get('user')
    const userInfo = await getMeRepository(user.id)

    if (!userInfo) {
        throw new AppError(userNotFoundError)
    }

    const accounts = await auth.api.listUserAccounts({
        headers: new Headers(c.req.header())
    })

    const linkedProviders = accounts.map((account: any) => ({
        provider: account.provider,
        providerAccountId: account.id
    }))

    return {
        ...userInfo,
        image: mapImageUrl(userInfo?.image as string, 'user'),
        linkedProviders
    }
}

export const getUserService = async (username: string) => {
    const userInfo = await getUserByUsernameRepository(username)

    if (!userInfo) {
        throw new AppError(userNotFoundError)
    }

    const followStats = await getFollowStatsService(userInfo.id)

    return {
        ...userInfo,
        ...followStats,
        image: mapImageUrl(userInfo?.image as string, 'user')
    }
}

export const getUserPostsService = async (c: Context) => {
    const userId = c.get('validatedParam').id
    const currentUserId = c.get('user')?.id

    const {
        offset,
        limit,
        orderBy,
        includeArchived = false
    } = c.get('validatedQuery')

    const result = await getUserPostsRepository({
        userId,
        offset,
        limit,
        orderBy,
        includeArchived,
        currentUserId
    })

    if (!result) {
        throw new AppError(noPostFoundError)
    }

    const postsWithAdditionalData = await Promise.all(
        result.posts.map(async (post) => {
            const postResponse = {
                ...post,
                author: {
                    ...post.author,
                    image: formatAvatarImageUrl(post.author.id)
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
        isOwner: result.isOwner,
        posts: postsWithAdditionalData
    }
}

export const registerService = async (c: Context) => {
    let uploadResult
    const formData = c.get('validatedFormData')

    const user = c.get('user')

    if (!user) {
        throw new AppError(userNotFoundError)
    }

    await checkDuplicateUsername(formData.username, user.id)

    try {
        await auth.api.setPassword({
            body: { newPassword: formData.password },
            headers: new Headers(c.req.header())
        })
    } catch (error) {
        CustomLogger.error(`Error setting password for user ${user.id}`, error)
        throw new AppError(setPasswordError)
    }

    if (formData.image) {
        uploadResult = await uploadAvatarImage(formData.image, user.id)
        if (!uploadResult) {
            throw new AppError(uploadAvatarError)
        }
    }

    const result = await updateUserRepository(user.id, {
        username: formData.username,
        displayUsername: formData.displayUsername,
        image: uploadResult?.path || null
    })

    if (!result) {
        throw new AppError(updateUserError)
    }

    return result
}

const checkDuplicateUsername = async (username: string, userId: string) => {
    const existingUser = await getUserByUsernameRepository(username)
    if (existingUser?.id && existingUser.id !== userId) {
        throw new AppError(userAlreadyExistsError)
    }
}

const uploadAvatarImage = async (image: File, userId: string) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    try {
        if (!image) {
            throw new Error(`Image is undefined`)
        }

        let fileSize: number
        if (typeof Buffer !== 'undefined' && image instanceof Buffer) {
            fileSize = image.length
        } else if (image instanceof File) {
            fileSize = image.size
        } else {
            throw new Error(`Invalid image format`)
        }

        if (fileSize > MAX_FILE_SIZE) {
            throw new Error(
                `Image exceeds maximum file size of 5MB (current size: ${(
                    fileSize /
                    1024 /
                    1024
                ).toFixed(2)}MB)`
            )
        }

        const imagePath = userId
        let uploadBody: File | Uint8Array
        if (typeof Buffer !== 'undefined' && image instanceof Buffer) {
            uploadBody = new Uint8Array(image)
        } else {
            uploadBody = image as File
        }

        const { data: uploadData } = await supabaseAdmin.storage
            .from('vcafe-user')
            .upload(imagePath, uploadBody, {
                cacheControl: '3600',
                upsert: true,
                metadata: {
                    uploadedBy: userId
                }
            })
        return uploadData
    } catch (error) {
        CustomLogger.error(
            `Error uploading avatar image for user ${userId}`,
            error
        )
        return undefined
    }
}
