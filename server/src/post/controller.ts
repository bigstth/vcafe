import { errorResponseFormat } from '@server/lib/error'
import { createPostService, getAllPostsService } from './service'
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

export const createPostController = async (c: Context) => {
    try {
        const data = c.get('validatedJson')
        const user = c.get('user')

        const newPost = await createPostService({ userId: user.id, ...data })

        return c.json(newPost, 201)
    } catch (e: unknown) {
        console.log(e)
        return errorResponseFormat(c, e)
    }
}
