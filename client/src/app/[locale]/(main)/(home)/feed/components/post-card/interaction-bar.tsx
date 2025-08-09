import type { PostItem } from '../../types'
import { Heart, MessageCircle, Repeat2, Share2, Bookmark } from 'lucide-react'
import { useGetPostComments } from '../../use-get-post-comment'
import { useGetPostLike } from '../../use-get-post-like'
import { useCreatePostLike } from './use-create-post-like'
import { useGlobalErrorStore } from '@/store/global-error'
import { ErrorResponse, useFormatError,} from '@/hooks/use-format-error'
import React, { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { debounce } from 'lodash'

type InteractionBarProps = {
    post: PostItem;
    setShowCreateComment?: React.Dispatch<React.SetStateAction<boolean>>;
    setPost?: React.Dispatch<React.SetStateAction<PostItem | null>>;
};

const InteractionBar: React.FC<InteractionBarProps> = ({
    post,
    setShowCreateComment,
    setPost,
}) => {
    const { data: comments, isLoading: commentLoading } = useGetPostComments(post.id)
    const commentCount = comments?.length ?? ""
    const { data: likes, isLoading: likeLoading } = useGetPostLike(post.id)
    const likeCount = likes?.likeCount ?? ""
    const { setError } = useGlobalErrorStore()
    const { formatErrorMessage } = useFormatError()
    const [localHasLiked, setLocalHasLiked] = useState(likes?.hasLiked ?? false);

    const handleLike = debounce(async () => {
        const previousState = localHasLiked;
        const newState = !previousState;
        setLocalHasLiked(newState);

        try {
            await likePost({ postId: post.id });    
        } catch (error) {
            setLocalHasLiked(previousState);
        }
    }, 500);

    useEffect(() => {
        setLocalHasLiked(likes?.hasLiked ?? false);
    }, [likes?.hasLiked]);

    const { mutateAsync: likePost } = useCreatePostLike({
        onError: async (error: ErrorResponse) => {
            const errorObj = await error
            setError(formatErrorMessage(errorObj))
        },
    })

    const handleComment = async () => {
        console.log('Handle comment action for post:', post.id)
        setShowCreateComment?.(true)
        setPost?.(post)
    }

    const handleShare = async () => {
        console.log('Handle share action for post:', post.id)
    }

    return (   
        <div className="flex items-center gap-6 text-foreground/50">
            <button className="group flex items-center gap-2"
                onClick={() => { handleLike() }}
            >
                <Heart
                    className={`stroke-primary  ${localHasLiked ? 'fill-primary' : ''}`}
                    size={20}
                />
                <span className="text-sm">
                    {likeLoading ? <Skeleton className="h-4 w-6" /> : likeCount}
                </span>
            </button>
            <button className="group flex items-center gap-2" onClick={() => handleComment()}>
                <MessageCircle
                    className="stroke-primary"
                    size={20}
                />
                <span className="text-sm">
                    {commentLoading ? <Skeleton className="h-4 w-6" /> : commentCount}
                </span>
            </button>
            <div className="ml-auto flex items-center gap-6">
                <button className="group flex items-center gap-2" onClick={() => handleShare()}>
                    <Share2
                        className="stroke-primary"
                        size={16}
                    />
                </button>
            </div>
        </div>
    )
}

export default InteractionBar