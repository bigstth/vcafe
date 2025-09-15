import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { GetPostPayload, PostResponse } from './types'
import { api } from '@/lib/api-client'

type GetPostsOptions = Omit<
    UseQueryOptions<any, ErrorResponse>,
    'queryKey' | 'queryFn'
>
export const useGetPosts = (
    payload: GetPostPayload,
    options?: GetPostsOptions
) => {
    return useQuery<PostResponse, ErrorResponse>({
        queryKey: ['get-post', payload],
        queryFn: () =>
            api.get<PostResponse>('/api/posts', {
                params: { offset: payload.offset }
            }),
        refetchInterval: 60 * 1000,
        refetchIntervalInBackground: true,
        ...options
    })
}
