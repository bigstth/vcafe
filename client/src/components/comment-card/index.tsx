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
import type {
    CommentSchemaType,
    Post
} from '@/app/[locale]/(main)/(home)/feed/types'
import Link from 'next/link'
import { getTextColorByRole } from '@/lib/role-preference'
import { useTimeAgo } from '@/hooks/use-get-time-ago'

interface Props {
    post: Post
    comments: CommentList | undefined
    refreshComment: (postId: string) => Promise<void>
}

const CommentCard = ({ post, comments, refreshComment }: Props) => {
    const { user } = useAuth()
    const getTimeAgo = useTimeAgo()

    const form = useForm({ defaultValues: { content: '' } })

    const { mutateAsync: createComment } = useCreateComment({
        onSuccess: async () => {
            form.reset()
            await refreshComment(post.id)
        },
        onError: (error) => {
            toast.error(`Error creating comment: ${error.message}`)
        }
    })

    const onSubmit = debounce((data: { content: string }) => {
        if (!post.id) {
            toast.error('Post not found')
            return
        }
        const payload: CommentSchemaType = {
            postId: post.id,
            content: data.content
        }
        createComment(payload)
    }, 500)

    return (
        <div className="mt-4">
            {user && <CreateCommentForm onSubmit={onSubmit} />}
            <div className="flex flex-col gap-10 my-6">
                {comments?.map((comment) => (
                    <div className="flex gap-4" key={comment.id}>
                        <AvatarRole
                            image={comment?.author.image}
                            username={comment?.author.username}
                            role={comment?.author.role}
                        />
                        <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <div className="flex flex-wrap">
                                <Link href={`/${post?.author.username}`}>
                                    <span
                                        className={`${getTextColorByRole(
                                            post?.author.role
                                        )} font-semibold`}
                                    >
                                        {post?.author.displayUsername ||
                                            post?.author.username}
                                    </span>
                                    {/* <span
                                    className={`text-foreground/50 font-medium`}
                                >
                                    {` @${post?.author.username}`}
                                </span> */}
                                </Link>
                                <span className="mx-1"> </span>
                                <span className="text-foreground/50 font-medium">
                                    {getTimeAgo(new Date(post?.createdAt))}
                                </span>
                            </div>
                            <Card className="flex-1 flex flex-col gap-2">
                                <CardContent>{comment.content}</CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CommentCard
