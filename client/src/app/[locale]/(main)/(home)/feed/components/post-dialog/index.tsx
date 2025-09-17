import { useForm } from 'react-hook-form'
import { useCreateComment, useGetComments } from './use-comment'
import { CommentSchemaType, type Post } from '../../types'
import { toast } from 'sonner'
import debounce from 'lodash/debounce'
import CreateCommentForm from './form'
import { renderImages } from '@/components/post-card/image-render'
import { useTimeAgo } from '@/hooks/use-get-time-ago'
import AvatarRole from '@/components/avatar-with-role-border'
import { Link } from '@/i18n/navigation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useAuth } from '@/contexts/auth-provider'
import PostCard from '@/components/post-card'
import CommentCard from '../comment-card'

type CreateCommentProps = {
    post: Post
    showPostDialog: boolean
    setShowPostDialog: React.Dispatch<React.SetStateAction<boolean>>
}
const PostDialog: React.FC<CreateCommentProps> = ({
    post,
    showPostDialog,
    setShowPostDialog
}) => {
    const form = useForm({ defaultValues: { content: '' } })
    const getTimeAgo = useTimeAgo()
    const { user } = useAuth()

    const { mutateAsync: createComment } = useCreateComment({
        onSuccess: () => {
            form.reset()
        },
        onError: (error) => {
            toast.error(`Error creating comment: ${error.message}`)
        }
    })

    const { data: commentData, isLoading: isCommentLoading } = useGetComments(
        post.id
    )

    console.log(commentData, 'commentData')

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
        <Dialog
            open={showPostDialog}
            onOpenChange={() => setShowPostDialog(false)}
        >
            <DialogContent
                className="!max-w-[620px] w-full gap-0 rounded-none md:rounded-lg"
                onInteractOutside={(event) => event.preventDefault()}
            >
                <VisuallyHidden>
                    <DialogTitle>Reply a post.</DialogTitle>
                </VisuallyHidden>
                <PostCard
                    post={post}
                    cardClassName="border-none rounded-none bg-background"
                    contentClassName="px-0"
                />

                {user && <CreateCommentForm onSubmit={onSubmit} />}

                <div className="flex flex-col gap-4 my-6">
                    {commentData?.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PostDialog
