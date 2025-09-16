import { api } from '@/lib/api-client'
import qs from 'qs'
import type { UserPostParams } from './types'
import type { PostResponse } from '@/app/[locale]/(main)/(home)/feed/types'

export const fetchUser = async (username: string): Promise<any | null> => {
    try {
        const data = await api.get<any>(`/api/user/${username}`, {
            next: {
                revalidate: 60,
                tags: [`user:${username}`]
            }
        })

        if (!data || 'error' in data) {
            console.error(`Failed to fetch user ${username}`)
            return null
        }

        return data
    } catch (error) {
        console.error(`Error fetching user ${username}:`, error)
        return null
    }
}

export const fetchUserPosts = async (
    id: string,
    params: UserPostParams
): Promise<PostResponse> => {
    try {
        const data = await api.get<PostResponse>(`/api/user/${id}/posts`, {
            params,
            credentials: 'include',
            next: {
                revalidate: 60,
                tags: [`user:${id}:posts`]
            }
        })

        if (!data || 'error' in data) {
            console.error(`Failed to fetch posts for user ${id}`)
            throw undefined
        }

        return data
    } catch (error) {
        console.error(`Error fetching posts for user ${id}:`, error)
        throw undefined
    }
}
