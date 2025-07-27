import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
]

export const userInfoFormSchema = z.object({
    username: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'This field is required'
                : 'Please input a valid username',
    }),
    displayUsername: z.string({
        error: (issue) =>
            issue.input === undefined
                ? 'This field is required'
                : 'Please input a valid display name',
    }),
    birthDate: z.date().optional(),
    image: z
        .file({
            error: (issue) =>
                issue.input === undefined
                    ? 'This field is required'
                    : 'Please upload a valid image file',
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Only .jpg, .jpeg, .png and .webp formats are supported.'
        ),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(
            /[@$!%*#?&]/,
            'Password must contain at least one special character (@$!%*#?&)'
        ),
})
