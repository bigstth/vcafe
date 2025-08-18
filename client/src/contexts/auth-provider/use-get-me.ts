import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

type GetMeOptions = Omit<
    UseQueryOptions<any, Error, any>,
    'queryKey' | 'queryFn'
>

export const useGetMe = (options: GetMeOptions) => {
    return useQuery<any, Error, any>({
        queryKey: ['get-me'],
        queryFn: async () => {
            const response = await fetch('/api/user/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            if (response.ok) {
                return response.json() as Promise<any>
            } else {
                throw new Error('Failed to fetch user')
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        ...options
    })
}
