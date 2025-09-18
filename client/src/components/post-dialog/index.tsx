import { useForm } from 'react-hook-form'
import { useCreateComment, useGetComments } from './use-comment'
import {
    CommentSchemaType,
    type Post
} from '../../app/[locale]/(main)/(home)/feed/types'
import { toast } from 'sonner'
import debounce from 'lodash/debounce'
import CreateCommentForm from '../comment-card/form'
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
    const getTimeAgo = useTimeAgo()

    const {
        data: commentData,
        isLoading: isCommentLoading,
        refetch
    } = useGetComments(post.id)

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

                <CommentCard
                    postId={post.id}
                    comments={commentData}
                    refreshComment={(_) => {
                        refetch()
                        return Promise.resolve()
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}

export default PostDialog
