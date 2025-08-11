import { api } from '@/lib/api-instance'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { GetPostPayload, GetPostsData, PostsSuccessData } from './types'

type GetPostsOptions = Omit<
    UseQueryOptions<PostsSuccessData, Error>,
    'queryKey' | 'queryFn'
>
export const useGetPosts = (
    payload: GetPostPayload,
    options?: GetPostsOptions
) => {
    return useQuery<PostsSuccessData, Error>({
        queryKey: ['get-post', payload],
        queryFn: async () => {
            const response = await api.posts.$get({
                query: { offset: payload.offset }
            })
            const data = (await response.json()) as GetPostsData

            if ('error' in data) {
                throw new Error(data.error.status || 'something_went_wrong')
            }

            return data as PostsSuccessData
        },
        retry: false,
        refetchOnWindowFocus: false,
        ...options
    })
}
