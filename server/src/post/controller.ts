import { errorResponseFormat } from '@server/lib/error'
import { getAllPostsService, createPostWithImagesService } from './service'
import type { Context } from 'hono'

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
