import { eq } from 'drizzle-orm'
import { db } from '../db/db-instance.js'
import { comments } from '../db/feed-schema.js'
import { CreateComment } from './service.js'

export const getCommentsRepository = async (postId: string) => {
    const result = await db.query.comments.findMany({
        where: eq(comments.postId, postId),
        with: {
            author: {
                columns: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                    role: true
                }
            }
        }
    })

    return result
}

export const createCommentRepository = async (comment: CreateComment) => {
    const result = await db
        .insert(comments)
        .values({
            postId: comment.postId,
            userId: comment.userId,
            content: comment.content
        })
        .returning()

    return result[0]
}
