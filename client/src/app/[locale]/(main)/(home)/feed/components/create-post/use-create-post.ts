import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
} from '@tanstack/react-query'
import type { PostSchemaType } from '../types'

export const useCreatePost = (
    options?: UseMutationOptions<any, unknown, PostSchemaType>
) => {
    const queryClient = useQueryClient()
    return useMutation<any, unknown, PostSchemaType>({
        mutationKey: ['create-post'],
        mutationFn: async (data: PostSchemaType) => {
            const formData = new FormData()

            formData.append('content', data.content)
            formData.append('visibility', data.visibility)

            if (data.images && data.images.length > 0) {
                data.images.forEach((file: File, index: number) => {
                    formData.append(`images`, file)
                })
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                console.log(response, 'response')
                throw new Error('Failed to create post')
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
