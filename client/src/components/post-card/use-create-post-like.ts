import {
    useMutation,
    useQueryClient,
    type UseMutationOptions
} from '@tanstack/react-query'
import type { PostLikeSchemaType } from '../../app/[locale]/(main)/(home)/feed/types'
import { ErrorResponse } from '@/hooks/use-format-error'

export const useCreatePostLike = (
    options?: UseMutationOptions<any, ErrorResponse, PostLikeSchemaType>
) => {
    const queryClient = useQueryClient()
    return useMutation<any, ErrorResponse, PostLikeSchemaType>({
        mutationKey: ['create-post-like'],
        mutationFn: async ({ postId }) => {
            const response = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
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
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ['get-post-likes', variables.postId]
            })
            options?.onSuccess?.(data, variables, context)
        }
    })
}
