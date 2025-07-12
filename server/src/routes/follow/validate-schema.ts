import { z } from 'zod'

export const userIdSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
})

export const followListSchema = z.object({
    offset: z.coerce.number().int().nonnegative().default(0),
    limit: z.coerce.number().int().min(1).max(100).default(20),
})
