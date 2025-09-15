import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

type GetCommentsOptions = Omit<
    UseQueryOptions<any, ErrorResponse>,
    'queryKey' | 'queryFn'
>

export const useGetPostComments = (
    postId: string,
    options?: GetCommentsOptions
) => {
    return useQuery<any, ErrorResponse>({
        queryKey: ['get-comments', postId],
        queryFn: async () => {
            const response = await fetch(`/api/comments/${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            const data = await response.json()

            if (response.status >= 400) {
                throw data
            }

            return data
        },
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!postId,
        ...options
    })
}
