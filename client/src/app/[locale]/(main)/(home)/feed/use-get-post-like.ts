import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

type GetLikesOptions = Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>

export const useGetPostLike = (postId: string, options?: GetLikesOptions) => {
    return useQuery<any, Error>({
        queryKey: ['get-post-likes', postId],
        queryFn: async () => {
            const response = await fetch(`/api/posts/${postId}/like`, {
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
