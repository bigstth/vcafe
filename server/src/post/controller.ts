import { CustomLogger } from '@server/lib/custom-logger'
import {
    getPostsService,
    createPostWithImagesService,
    getPostService,
    softDeletePostService,
    archivePostService,
    unarchivePostService,
} from './service'
import type { Context } from 'hono'
import { errorResponseFormat } from '@server/lib/error'

export const getPostsController = async (c: Context) => {
    try {
        const { limit, offset, orderBy } = c.get('validatedQuery')

        const posts = await getPostsService({
            limit,
            offset,
            orderBy,
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
            ...formData,
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
            error,
        })
        return c.json({ error: 'Failed to unarchive post' }, 500)
    }
}
