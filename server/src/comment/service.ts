import { AppError } from '@server/lib/error'
import { createCommentRepository, getCommentsRepository } from './repository'
import { createCommentError, getCommentsFailed } from './errors'
import { CustomLogger } from '@server/lib/custom-logger'

export type CreateComment = {
    postId: string
    userId: string
    content: string
}
export const getCommentsService = async (postId: string) => {
    const result = await getCommentsRepository(postId)
    if (!result) {
        throw new AppError(getCommentsFailed)
    }
    return result
}

export const createCommentService = async (comment: CreateComment) => {
    const result = await createCommentRepository(comment)

    if (!result) {
        CustomLogger.error(
            `Error creating comment for post ${comment.postId}`,
            comment
        )

        throw new AppError(createCommentError)
    }

    return result
}
