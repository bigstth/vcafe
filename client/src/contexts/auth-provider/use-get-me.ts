import { api } from '@/lib/api-instance'
import type { UserProfile } from '@/types/user.type'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
type GetMeOptions = Omit<
    UseQueryOptions<UserProfile, Error, UserProfile>,
    'queryKey' | 'queryFn'
>
export const useGetMe = (options: GetMeOptions) => {
    return useQuery<UserProfile, Error, UserProfile>({
        queryKey: ['get-me'],
        queryFn: async () => {
            const response = await api.user.me.$get()
            if (response.ok) {
                return response.json() as Promise<UserProfile>
            } else {
                throw new Error('Failed to fetch user')
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        ...options,
    })
}
