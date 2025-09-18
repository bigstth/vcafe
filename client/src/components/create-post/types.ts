import { visibilitySchema } from '@/types/post.type.'
import z from 'zod'

export const postPayloadSchema = z.object({
    content: z
        .string()
        .min(1, 'Content is required')
        .max(1000, 'Content must be less than 1,000 characters'),
    visibility: visibilitySchema.default('public'),
    images: z.array(z.instanceof(File)).optional()
})

export const postResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    content: z.string(),
    visibility: visibilitySchema,
    isDeleted: z.boolean(),
    isArchived: z.boolean(),
    deletedAt: z.string().nullable(),
    archivedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export type PostPayloadSchemaType = z.infer<typeof postPayloadSchema>
export type PostResponseSchemaType = z.infer<typeof postResponseSchema>
