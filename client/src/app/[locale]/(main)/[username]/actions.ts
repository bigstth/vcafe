'use server'

import { revalidateTag } from 'next/cache'

export const revalidateUser = async (username: string | null) => {
    revalidateTag(`user:${username}`)
}
