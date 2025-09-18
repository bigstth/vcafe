'use client'
import type { CommentList } from '../post-dialog/types'
import { Card, CardContent } from '@/components/ui/card'
import AvatarRole from '@/components/avatar-with-role-border'
import CreateCommentForm from './form'
import { useAuth } from '@/contexts/auth-provider'
import { useForm } from 'react-hook-form'
import { useCreateComment } from '../post-dialog/use-comment'
import { toast } from 'sonner'
import { debounce } from 'lodash'
import type { CommentSchemaType } from '@/app/[locale]/(main)/(home)/feed/types'

interface Props {
    postId: string
    comments: CommentList | undefined
    refreshComment: (postId: string) => Promise<void>
}

const CommentCard = ({ postId, comments, refreshComment }: Props) => {
    const { user } = useAuth()
    const form = useForm({ defaultValues: { content: '' } })

    const { mutateAsync: createComment } = useCreateComment({
        onSuccess: async () => {
            form.reset()
            await refreshComment(postId)
        },
        onError: (error) => {
            toast.error(`Error creating comment: ${error.message}`)
        }
    })

    const onSubmit = debounce((data: { content: string }) => {
        if (!postId) {
            toast.error('Post not found')
            return
        }
        const payload: CommentSchemaType = {
            postId,
            content: data.content
        }
        createComment(payload)
    }, 500)

    return (
        <div className="mt-4">
            {user && <CreateCommentForm onSubmit={onSubmit} />}
            <div className="flex flex-col gap-4 my-6">
                {comments?.map((comment) => (
                    <div className="flex gap-4" key={comment.id}>
                        <AvatarRole
                            image={comment?.author.image}
                            username={comment?.author.username}
                            role={comment?.author.role}
                        />
                        <Card className="flex-1 flex flex-col gap-2">
                            <CardContent>{comment.content}</CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentCard
