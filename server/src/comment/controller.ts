import { errorResponseFormat } from '@server/lib/error'
import { createCommentService, getCommentsService } from './service'
import type { Context } from 'hono'

export const getCommentsController = async (c: Context) => {
    const { postId } = c.get('validatedParam')
    try {
        const comments = await getCommentsService(postId)
        return c.json(comments)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}

export const createCommentController = async (c: Context) => {
    const user = c.get('user')
    const { postId } = c.get('validatedParam')
    const body = await c.get('validatedJson')

    const commentData = {
        postId: postId,
        userId: user.id,
        content: body.content,
    }

    try {
        const comment = await createCommentService(commentData)
        return c.json(comment)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}
