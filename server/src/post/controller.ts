import { errorResponseFormat } from '@server/lib/error'
import { getAllPostsService, createPostWithImagesService, getPostService } from './service'
import type { Context } from 'hono'
import { CustomLogger } from '@server/lib/custom-logger'

export const getAllPostsController = async (c: Context) => {
    try {
        const { limit, offset, orderBy } = c.get('validatedQuery')

        const posts = await getAllPostsService({
            limit,
            offset,
            orderBy,
        })

        return c.json(posts)
    } catch (e: unknown) {
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
        return errorResponseFormat(c, e)
    }
}
