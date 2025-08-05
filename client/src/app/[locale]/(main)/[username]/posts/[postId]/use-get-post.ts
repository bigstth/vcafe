import { api } from '@/lib/api-instance'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { GetSinglePostData, SinglePostSuccessData } from './types'
import { useFormatError, type ErrorResponse } from '@/hooks/use-format-error'

type GetPostsOptions = Omit<
    UseQueryOptions<SinglePostSuccessData, ErrorResponse>,
    'queryKey' | 'queryFn'
>
export const useGetPosts = (id: string, options?: GetPostsOptions) => {
    const { formatErrorMessage } = useFormatError()
    return useQuery<SinglePostSuccessData, ErrorResponse>({
        queryKey: ['get-post', id],
        queryFn: async () => {
            const response = await api.posts[':id'].$get({
                param: { id },
            })
            const data = (await response.json()) as GetSinglePostData

            if (!response.ok) {
                const errorData: any = await response.json()
                throw new Error(formatErrorMessage(errorData))
            }

            return data as SinglePostSuccessData
        },
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!id,
        ...options,
    })
}
