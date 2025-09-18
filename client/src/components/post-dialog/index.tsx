import { useGetComments } from './use-comment'
import { type Post } from '../../app/[locale]/(main)/(home)/feed/types'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import PostCard from '@/components/post-card'
import CommentCard from '../comment-card'
import { revalidatePostsTag } from '@/services/post/actions'

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
                    post={post}
                    comments={commentData}
                    refreshComment={(_) => {
                        refetch()
                        revalidatePostsTag({ limit: 10, offset: 0 })
                        return Promise.resolve()
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}

export default PostDialog
