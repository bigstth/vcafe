import { CustomLogger } from '../lib/custom-logger.js'
import {
    getPostsService,
    createPostWithImagesService,
    getPostService,
    softDeletePostService,
    archivePostService,
    unarchivePostService,
    getPostLikeService,
    toggleLikePostService
} from './service.js'
import type { Context } from 'hono'
import { errorResponseFormat } from '../lib/error.js'

export const getPostsController = async (c: Context) => {
    try {
        const { limit, offset, orderBy } = c.get('validatedQuery')

        const posts = await getPostsService(c, {
            limit,
            offset,
            orderBy
        })

        return c.json(posts)
    } catch (e: unknown) {
        CustomLogger.error(`Error in getPostsController`, e)
        return errorResponseFormat(c, e)
    }
}

export const getPostController = async (c: Context) => {
    const { id } = c.get('validatedParam')
    try {
        const posts = await getPostService(id)

        return c.json(posts)
    } catch (e: unknown) {
        CustomLogger.error(`Error in getPostController post ${id}`, e)
        return errorResponseFormat(c, e)
    }
}

export const createPostWithImagesController = async (c: Context) => {
    try {
        const user = c.get('user')
        const formData = c.get('validatedFormData')

        const result = await createPostWithImagesService({
            userId: user.id,
            ...formData
        })

        return c.json(result, 201)
    } catch (e: unknown) {
        CustomLogger.error(`Error in createPostWithImagesController`, e)
        return errorResponseFormat(c, e)
    }
}

export const deletePostController = async (c: Context) => {
    const { id } = c.get('validatedParam')
    const user = c.get('user')

    try {
        const result = await softDeletePostService(id, user.id)
        return c.json(result)
    } catch (e: unknown) {
        CustomLogger.error(`Error in deletePostController post ${id}`, e)
        return errorResponseFormat(c, e)
    }
}

export const archivePostController = async (c: Context) => {
    const { id } = c.get('validatedParam')
    const user = c.get('user')

    try {
        const result = await archivePostService(id, user.id)
        return c.json(result)
    } catch (e: unknown) {
        CustomLogger.error(`Error in archivePostController post ${id}`, e)
        return errorResponseFormat(c, e)
    }
}

export const unArchivePostController = async (c: Context) => {
    const { id } = c.get('validatedParam')
    const user = c.get('user')

    try {
        const result = await unarchivePostService(id, user.id)

        return c.json(result)
    } catch (error) {
        CustomLogger.error('Error unarchiving post', {
            postId: id,
            userId: user.id,
            error
        })
        return c.json({ error: 'Failed to unarchive post' }, 500)
    }
}

export const getPostLikeController = async (c: Context) => {
    const { id } = c.get('validatedParam')
    const user = c.get('user')

    try {
        const result = await getPostLikeService(id, user.id)
        return c.json(result)
    } catch (error) {
        CustomLogger.error('Error getting post likes', {
            postId: id,
            userId: user.id,
            error
        })
        return errorResponseFormat(c, error)
    }
}

export const toggleLikePostController = async (c: Context) => {
    const { id } = c.get('validatedParam')
    const user = c.get('user')

    try {
        const liked = await toggleLikePostService(id, user.id)
        const isLiked =
            liked && typeof liked === 'object' && 'isLiked' in liked
                ? liked.isLiked
                : false
        const result = {
            success: true,
            message: isLiked ? 'Post liked' : 'Post unliked',
            th: isLiked ? 'กดถูกใจโพสต์' : 'ยกเลิกถูกใจโพสต์',
            en: isLiked ? 'Post liked' : 'Post unliked'
        }
        return c.json(result)
    } catch (error) {
        CustomLogger.error('Error toggling like post', {
            postId: id,
            userId: user.id,
            error
        })
        return errorResponseFormat(c, error)
    }
}
