import { useQuery } from '@tanstack/react-query'
import { userQueryKeys } from './key-factory'
import { fetchUser } from '@/services/user/user.service'

export const useGetUser = (username: string) => {
    return useQuery<any, Error>({
        queryKey: [...userQueryKeys.getUser, username],
        queryFn: async () => await fetchUser(username),
        staleTime: 5 * 60 * 1000,
        enabled: !!username
    })
}
