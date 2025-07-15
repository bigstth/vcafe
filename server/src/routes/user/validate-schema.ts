import { z } from 'zod'

export const userIdSchema = z.object({
    id: z.string({
        required_error: 'User ID is required',
    }),
})

export const getUserPostsSchema = z.object({
    offset: z.coerce.number().int().nonnegative().default(0),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
    includeArchived: z.coerce.boolean().default(false),
})
