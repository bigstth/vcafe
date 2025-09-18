'use server'

import { revalidateTag } from 'next/cache'
import type { PostParams } from './types'

export async function revalidatePostsTag(params: PostParams) {
    revalidateTag(`posts:${params}`)
}

export async function revalidatePostTag(postId: string) {
    revalidateTag(`posts:${postId}`)
}
