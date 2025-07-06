import { z } from 'zod'

export const getCommentsSchema = z.object({
    postId: z.string().uuid('Invalid post ID format'),
})

export const createCommentSchema = z.object({
    content: z
        .string()
        .min(1, 'Content is required')
        .max(1000, 'Content too long'),
})
