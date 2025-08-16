import { CustomLogger } from '../lib/custom-logger.js'
import { AppError } from '../lib/error.js'
import { getCommentsFailed, createCommentError } from './errors.js'
import { getCommentsRepository, createCommentRepository } from './repository.js'

export type CreateComment = {
    postId: string
    userId: string
    content: string
}
export const getCommentsService = async (postId: string) => {
    const result = await getCommentsRepository(postId)
    if (!result) {
        if (getCommentsFailed.status === undefined) {
            throw new AppError(getCommentsFailed)
        }
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
