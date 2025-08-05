import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
} from '@tanstack/react-query'
import type { PostSchemaType } from './types'
import type { ErrorResponse } from '@/hooks/use-format-error'

export const useCreatePost = (
    options?: UseMutationOptions<any, ErrorResponse, PostSchemaType>
) => {
    const queryClient = useQueryClient()
    return useMutation<any, ErrorResponse, PostSchemaType>({
        mutationKey: ['create-post'],
        mutationFn: async (data: PostSchemaType) => {
            const formData = new FormData()

            formData.append('content', data.content)
            formData.append('visibility', data.visibility)

            if (data.images && data.images.length > 0) {
                data.images.forEach((file: File) => {
                    formData.append(`images`, file)
                })
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw response.json()
            }

            return response.json()
        },
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ['get-post'],
            })
            console.log('Queries invalidated')
            options?.onSuccess?.(data, variables, context)
        },
    })
}
