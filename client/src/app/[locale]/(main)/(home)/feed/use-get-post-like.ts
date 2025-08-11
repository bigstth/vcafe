import { api } from '@/lib/api-instance'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { LikesSuccessData } from './types'

type GetLikesOptions = Omit<
    UseQueryOptions<LikesSuccessData, Error>,
    'queryKey' | 'queryFn'
>

export const useGetPostLike = (postId: string, options?: GetLikesOptions) => {
    return useQuery<LikesSuccessData, Error>({
        queryKey: ['get-post-likes', postId],
        queryFn: async () => {
            const response = await api.posts[':id'].like.$get({
                param: { id: postId }
            })
            const data = await response.json()

            if (response.status >= 400) {
                throw data
            }

            return data as LikesSuccessData
        },
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!postId,
        ...options
    })
}
