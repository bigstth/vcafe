import { api } from '@/lib/api-client'
import type { PostResponse } from '@/app/[locale]/(main)/(home)/feed/types'
import type { PostParams } from './types'

export const fetchPosts = async (params: PostParams): Promise<PostResponse> => {
    try {
        const data = await api.get<PostResponse>(`/api/posts`, {
            params,
            credentials: 'include',
            next: {
                revalidate: 60,
                tags: [`posts:${params}`]
            }
        })

        if (!data || 'error' in data) {
            console.error(`Failed to fetch posts `)
            throw undefined
        }

        return data
    } catch (error) {
        console.error(`Error fetching posts`, error)
        throw undefined
    }
}
