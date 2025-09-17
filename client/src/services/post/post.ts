import { api } from '@/lib/api-client'
import type {
    Post,
    PostResponse
} from '@/app/[locale]/(main)/(home)/feed/types'
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

        return data
    } catch (error) {
        console.error(`Error fetching posts`, error)
        throw undefined
    }
}

export const fetchPost = async (id: string): Promise<Post | undefined> => {
    try {
        const data = await api.get<Post>(`/api/posts/${id}`, {
            credentials: 'include',
            next: {
                revalidate: 60,
                tags: [`post:${id}`]
            }
        })

        return data
    } catch (error) {
        return undefined
    }
}
