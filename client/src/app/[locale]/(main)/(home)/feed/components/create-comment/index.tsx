import { Card, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { useCreateComment } from './use-create-comment'
import { CommentSchemaType, type Post } from '../../types'
import { toast } from 'sonner'
import debounce from 'lodash/debounce'
import CreateCommentForm from './form'
import { X } from 'lucide-react'
import { renderImages } from '@/components/post-card/image-render'
import { useTimeAgo } from '@/hooks/use-get-time-ago'
import AvatarRole from '@/components/avatar-with-role-border'
import { Link } from '@/i18n/navigation'

type CreateCommentProps = {
    post: Post | null
    showCreateComment: boolean
    setShowCreateComment?: React.Dispatch<React.SetStateAction<boolean>>
}
const CreateComment: React.FC<CreateCommentProps> = ({
    post,
    showCreateComment,
    setShowCreateComment
}) => {
    const form = useForm({ defaultValues: { content: '' } })
    const getTimeAgo = useTimeAgo()
    const { mutateAsync: createComment } = useCreateComment({
        onSuccess: () => {
            form.reset()
        },
        onError: (error) => {
            toast.error(`Error creating comment: ${error.message}`)
        }
    })

    const onSubmit = debounce((data: { content: string }) => {
        if (!post?.id) {
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
        <div className={` ${showCreateComment ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" />
            <div className="z-50 fixed w-[600px] top-1/8 left-1/2 -translate-x-1/2">
                <Card>
                    <CardContent>
                        <button onClick={() => setShowCreateComment?.(false)}>
                            <X className="absolute top-4 right-4 cursor-pointer text-xl mx-4 my-2" />
                        </button>

                        <div className="flex items-start gap-4 w-full">
                            <AvatarRole
                                image={post?.author?.image}
                                username={post?.author?.username}
                                role={post?.author?.role}
                            />
                            <div className="flex-1 flex flex-col gap-4 min-w-0">
                                <div>
                                    <Link href={`/${post?.author.username}`}>
                                        <span className="font-semibold">
                                            {post?.author.displayUsername ||
                                                post?.author.username}
                                        </span>
                                        <span className="text-foreground/50 font-medium">
                                            {` @${post?.author.username}`}
                                        </span>
                                    </Link>
                                    <Link
                                        href={`${post?.author.username}/posts/${post?.id}`}
                                    >
                                        <span className="text-foreground/50 font-medium">
                                            {` `}·{' '}
                                            {post?.createdAt
                                                ? getTimeAgo(
                                                      new Date(post.createdAt)
                                                  )
                                                : ''}
                                        </span>
                                    </Link>
                                </div>
                                <pre className="whitespace-pre-wrap break-words">
                                    {post?.content}
                                </pre>
                                {post && renderImages(post)}
                            </div>
                        </div>

                        <CreateCommentForm onSubmit={onSubmit} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CreateComment
