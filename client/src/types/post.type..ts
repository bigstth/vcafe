import z from 'zod'

export const visibilitySchema = z.enum([
    'public',
    'follower_only',
    'membership_only'
])
