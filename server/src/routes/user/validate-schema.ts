import { z } from 'zod'

export const userIdSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
})

export const getUserPostsSchema = z.object({
    offset: z.coerce.number().int().nonnegative().default(0),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
    includeArchived: z.coerce.boolean().default(false),
})

export const registerSchema = z.object({
    image: z.any().optional(),
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long')
        .max(30, 'Username must be at most 30 characters long'),
    displayUsername: z
        .string()
        .min(1, 'Display name is required')
        .max(30, 'Display name must be at most 30 characters long'),
    birthDate: z.coerce.date().optional(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be at most 100 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(
            /[@$!%*#?&]/,
            'Password must contain at least one special character (@$!%*#?&)'
        ),
})
