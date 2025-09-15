import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useFormatError, type ErrorResponse } from '@/hooks/use-format-error'
import type { Post } from '../../../(home)/feed/types'
import { api } from '@/lib/api-client'

type GetPostsOptions = Omit<
    UseQueryOptions<Post, ErrorResponse>,
    'queryKey' | 'queryFn'
>
export const useGetPosts = (id: string, options?: GetPostsOptions) => {
    return useQuery<Post, ErrorResponse>({
        queryKey: ['get-post', id],
        queryFn: async () => api.get<Post>(`/api/posts/${id}`),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!id,
        ...options
    })
}
