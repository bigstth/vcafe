'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateCommentTag(postId: string) {
    revalidateTag(`comments:${postId}`)
}
