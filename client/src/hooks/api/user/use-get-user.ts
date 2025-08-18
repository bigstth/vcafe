import { useQuery } from '@tanstack/react-query'

export const useGetUser = (username: string) => {
    return useQuery<any, Error>({
        queryKey: ['get-user', username],
        queryFn: async () => {
            const response = await fetch(`/api/user/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const data = await response.json()

            if ('error' in data) {
                throw new Error(data.error.status || 'something_went_wrong')
            }

            return data as any
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!username
    })
}
