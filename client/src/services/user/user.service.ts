import { API_URL, BASE_URL } from 'env-constants'
import qs from 'qs'
import type { UserPostParams } from './types'

export const fetchUser = async (username: string): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/user/${username}`, {
            next: {
                revalidate: 60,
                tags: [`user:${username}`]
            }
        })

        const data = await response.json()

        if (!response.ok || 'error' in data) {
            console.error(
                `Failed to fetch user ${username}: ${response.status}`
            )
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
): Promise<any | null> => {
    try {
        const queryParams = qs.stringify(params)
        const response = await fetch(
            `${BASE_URL}/api/user/${id}/posts${
                queryParams ? `?${queryParams}` : ''
            }`,
            {
                credentials: 'include',
                next: {
                    revalidate: 60,
                    tags: [`user:${id}:posts`]
                }
            }
        )

        const data = await response.json()

        if (!response.ok || 'error' in data) {
            console.error(
                `Failed to fetch posts for user ${id}: ${response.status}`
            )
            return null
        }

        return data
    } catch (error) {
        console.error(`Error fetching posts for user ${id}:`, error)
        return null
    }
}
