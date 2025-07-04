import { z } from 'zod'

export const getAllPostsSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().nonnegative().default(0),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
})

export const createPostSchema = z.object({
    content: z.string().min(1, 'Content is required').max(1000, 'Content too long'),
    visibility: z.enum(['public', 'follower_only', 'membership_only']).default('public'),
})
