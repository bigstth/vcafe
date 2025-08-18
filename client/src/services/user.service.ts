import { API_URL } from 'env-constants'

export async function fetchUserByUsername(
    username: string
): Promise<any | null> {
    try {
        const response = await fetch(`${API_URL}/api/user/${username}`, {
            next: {
                revalidate: 60,
                tags: [`user:${username}`]
            }
        })

        if (!response.ok) {
            console.error(
                `Failed to fetch user ${username}: ${response.status}`
            )
            return null
        }

        const data = await response.json()

        if ('error' in data) {
            console.error(`User ${username} not found:`, data.error)
            return null
        }

        return data
    } catch (error) {
        console.error(`Error fetching user ${username}:`, error)
        return null
    }
}
