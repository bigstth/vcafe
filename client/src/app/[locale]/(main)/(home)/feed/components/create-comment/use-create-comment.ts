import {
    useMutation,
    useQueryClient,
    type UseMutationOptions
} from '@tanstack/react-query'
import type { CommentSchemaType } from '../../types'
import type { ErrorResponse } from '@/hooks/use-format-error'

export const useCreateComment = (
    options?: UseMutationOptions<any, ErrorResponse, CommentSchemaType>
) => {
    const queryClient = useQueryClient()
    return useMutation<any, ErrorResponse, CommentSchemaType>({
        mutationKey: ['create-comment'],
        mutationFn: async (data: CommentSchemaType) => {
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
