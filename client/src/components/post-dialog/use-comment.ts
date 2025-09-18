import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions
} from '@tanstack/react-query'
import type {
    Comment,
    CommentSchemaType
} from '../../app/[locale]/(main)/(home)/feed/types'
import type { ErrorResponse } from '@/hooks/use-format-error'
import { api } from '@/lib/api-client'
import type { CommentList, CreateCommentResponse } from './types'

export const useCreateComment = (
    options?: UseMutationOptions<
        CreateCommentResponse,
        ErrorResponse,
        CommentSchemaType
    >
) => {
    const queryClient = useQueryClient()
    return useMutation<CreateCommentResponse, ErrorResponse, CommentSchemaType>(
        {
            mutationKey: ['create-comment'],
            mutationFn: async (data: CommentSchemaType) => {
                const postId = String(data?.postId)
                return api.post(`/api/comments/${postId}`, {
                    content: data.content
                })
            },
            ...options,
            onSuccess: (data, variables, context) => {
                const postId = variables.postId
                queryClient.invalidateQueries({
                    queryKey: ['get-comments', postId]
                })
                options?.onSuccess?.(data, variables, context)
            }
        }
    )
}

export const useGetComments = (
    postId: string,
    options?: UseQueryOptions<CommentList, ErrorResponse>
) => {
    return useQuery<CommentList, ErrorResponse>({
        queryKey: ['get-comments', postId],
        queryFn: () => api.get(`/api/comments/${postId}`),
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!postId,
        ...options
    })
}
