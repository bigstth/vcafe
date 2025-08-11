import {
    useMutation,
    useQueryClient,
    type UseMutationOptions
} from '@tanstack/react-query'
import { api } from '@/lib/api-instance'
import type { LikeSuccessData, PostLikeSchemaType } from '../../types'
import { ErrorResponse } from '@/hooks/use-format-error'

export const useCreatePostLike = (
    options?: UseMutationOptions<
        LikeSuccessData,
        ErrorResponse,
        PostLikeSchemaType
    >
) => {
    const queryClient = useQueryClient()
    return useMutation<LikeSuccessData, ErrorResponse, PostLikeSchemaType>({
        mutationKey: ['create-post-like'],
        mutationFn: async ({ postId }) => {
            const response = await api.posts[':id'].like.$post({
                param: { id: postId }
            })
            const data = await response.json()

            if (response.status >= 400) {
                throw data
            }

            return data as LikeSuccessData
        },
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ['get-post-likes', variables.postId]
            })
            options?.onSuccess?.(data, variables, context)
        }
    })
}
