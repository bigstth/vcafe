import { api } from '@/lib/api-instance'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { GetPostPayload } from './types'
type GetPostsOptions = Omit<
    UseQueryOptions<any, Error, any>,
    'queryKey' | 'queryFn'
>
export const useGetPosts = (
    payload: GetPostPayload,
    options?: GetPostsOptions
) => {
    return useQuery<any, Error, any>({
        queryKey: ['get-post', payload],
        queryFn: async () => {
            const response = await api.posts.$get({
                query: { offset: payload.offset },
            })

            if (response.ok) {
                return response.json() as Promise<any>
            } else {
                throw new Error('Failed to fetch posts')
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
    })
}
