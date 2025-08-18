import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { GetPostPayload } from './types'

type GetPostsOptions = Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
export const useGetPosts = (
    payload: GetPostPayload,
    options?: GetPostsOptions
) => {
    return useQuery<any, Error>({
        queryKey: ['get-post', payload],
        queryFn: async () => {
            const response = await fetch(
                `/api/posts?offset=${payload.offset}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            )
            const data = await response.json()

            if ('error' in data) {
                throw new Error(data.error.status || 'something_went_wrong')
            }

            return data
        },
        refetchInterval: 60 * 1000,
        refetchIntervalInBackground: true,
        ...options
    })
}
