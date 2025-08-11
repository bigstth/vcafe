import {
    useMutation,
    useQueryClient,
    type UseMutationOptions
} from '@tanstack/react-query'
import type { commentSchemaType } from '../../types'
import type { ErrorResponse } from '@/hooks/use-format-error'

export const useCreateComment = (
    options?: UseMutationOptions<any, ErrorResponse, commentSchemaType>
) => {
    const queryClient = useQueryClient()
    return useMutation<any, ErrorResponse, commentSchemaType>({
        mutationKey: ['create-comment'],
        mutationFn: async (data: commentSchemaType) => {
            const postId = String(data?.postId)

            const response = await fetch(`/api/comments/post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: data.content
                })
            })

            if (!response.ok) {
                throw await response.json()
            }

            return response.json()
        },
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ['get-comments', { postId: variables.postId }]
            })
            options?.onSuccess?.(data, variables, context)
        }
    })
}
