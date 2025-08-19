import { useQuery } from '@tanstack/react-query'
import { userQueryKeys } from './key-factory'
import { fetchUserPosts } from '@/services/user/user.service'
import type { UserPostParams } from '@/services/user/types'

export const useGetUserPosts = (id: string, params: UserPostParams) => {
    return useQuery<any, Error>({
        queryKey: [...userQueryKeys.getUserPosts, id, params],
        queryFn: async () => await fetchUserPosts(id, params),
        staleTime: 5 * 60 * 1000,
        enabled: !!id
    })
}
