import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { GetPostPayload, PostResponse } from './types'
import { api } from '@/lib/api-client'

type GetPostsOptions = Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
export const useGetPosts = (
    payload: GetPostPayload,
    options?: GetPostsOptions
) => {
    return useQuery<PostResponse, Error>({
        queryKey: ['get-post', payload],
        queryFn: async () => {
            const data = await api.get<PostResponse>('/api/posts', {
                params: { offset: payload.offset }
            })

            if ('error' in data) {
                const error = data.error as { status?: string }
                throw new Error(error.status || 'something_went_wrong')
            }

            return data
        },
        refetchInterval: 60 * 1000,
        refetchIntervalInBackground: true,
        ...options
    })
}
