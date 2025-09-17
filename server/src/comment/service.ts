import { CustomLogger } from '../lib/custom-logger.js'
import { AppError } from '../lib/error.js'
import { formatAvatarImageUrl } from '../lib/map-image-urls.js'
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
        throw new AppError(getCommentsFailed)
    }

    const commentsWithAdditionalData = result.map((comment) => ({
        ...comment,
        author: {
            ...comment.author,
            image: formatAvatarImageUrl(comment.author.image || '')
        }
    }))

    return commentsWithAdditionalData
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
