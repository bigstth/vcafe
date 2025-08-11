import { api } from '@/lib/api-instance'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { CommentsSuccessData } from './types'

type GetCommentsOptions = Omit<
    UseQueryOptions<CommentsSuccessData, Error>,
    'queryKey' | 'queryFn'
>

export const useGetPostComments = (
    postId: string,
    options?: GetCommentsOptions
) => {
    return useQuery<CommentsSuccessData, Error>({
        queryKey: ['get-comments', postId],
        queryFn: async () => {
            const response = await api.comments.post[':postId'].$get({
                param: { postId: postId }
            })
            const data = await response.json()

            if (response.status >= 400) {
                throw data
            }

            return data as CommentsSuccessData
        },
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!postId,
        ...options
    })
}
