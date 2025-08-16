import { api } from '@/lib/api-instance'
import { useQuery } from '@tanstack/react-query'
import type { GetUserData, UserSuccessData } from './types'

export const useGetUser = (username: string) => {
    console.log('🔍 useGetUser called with:', username) // Debug line

    return useQuery({
        queryKey: ['get-user', username],
        queryFn: async () => {
            const response = await api.user[':username'].$get({
                param: { username: username }
            })
            const data = (await response.json()) as GetUserData

            if ('error' in data) {
                throw new Error(data.error.status || 'something_went_wrong')
            }

            return data as UserSuccessData
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!username
    })
}
