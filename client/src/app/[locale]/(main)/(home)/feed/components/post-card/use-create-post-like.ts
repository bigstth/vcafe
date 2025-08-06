import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
} from '@tanstack/react-query'
import { api } from '@/lib/api-instance'
import type { LikesSuccessData, ErrorResponse, PostLikeSchemaType } from './type'

export const useCreatePostLike = (
    options?: UseMutationOptions<LikesSuccessData, ErrorResponse, PostLikeSchemaType>
) => {
    const queryClient = useQueryClient()
    return useMutation<LikesSuccessData, ErrorResponse, PostLikeSchemaType>({
        mutationKey: ['create-post-like'],
        mutationFn: async ({ postId }) => {
            const response = await api.posts[':id'].like.$post({
                param: { id: postId }
            })
            const data = await response.json()

            if (response.status >= 400) {
                throw data
            }   

            return data as LikesSuccessData
        },
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ['get-post-likes', variables.postId],
            })
            options?.onSuccess?.(data, variables, context)
        },
    })
}