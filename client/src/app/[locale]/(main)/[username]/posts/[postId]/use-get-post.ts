import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useFormatError, type ErrorResponse } from '@/hooks/use-format-error'

type GetPostsOptions = Omit<
    UseQueryOptions<any, ErrorResponse>,
    'queryKey' | 'queryFn'
>
export const useGetPosts = (id: string, options?: GetPostsOptions) => {
    const { formatErrorMessage } = useFormatError()
    return useQuery<any, ErrorResponse>({
        queryKey: ['get-post', id],
        queryFn: async () => {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(formatErrorMessage(data))
            }

            return data as any
        },
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!id,
        ...options
    })
}
