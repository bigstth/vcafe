import z from 'zod'

export const postSchema = z.object({
    content: z
        .string()
        .min(1, 'Content is required')
        .max(1000, 'Content must be less than 1,000 characters'),
    visibility: z
        .enum(['public', 'follower_only', 'membership_only'])
        .default('public'),
    images: z.array(z.instanceof(File)).optional()
})

export type PostSchemaType = z.infer<typeof postSchema>
