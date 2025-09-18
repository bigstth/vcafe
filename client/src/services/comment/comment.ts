import type { CommentList } from '@/components/post-dialog/types'
import { api } from '@/lib/api-client'

export const fetchComments = async (postId: string): Promise<CommentList> => {
    try {
        const data = await api.get<CommentList>(`/api/comments/${postId}`, {
            credentials: 'include',
            next: {
                revalidate: 60,
                tags: [`comments:${postId}`]
            }
        })

        return data
    } catch (error) {
        console.error(`Error fetching comments`, error)
        throw undefined
    }
}
