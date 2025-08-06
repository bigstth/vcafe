import type { PostItem } from '../../types'
import { Heart, MessageCircle, Repeat2, Share2, Bookmark } from 'lucide-react'
import { useGetPostComments } from '../../use-get-post-comment'
import { useGetPostLike } from '../../use-get-post-like'
import { useCreatePostLike } from './use-create-post-like'
import { useDeletePostLike } from './use-delete-post-like'
import type { ErrorResponse } from './type'
import { useGlobalErrorStore } from '@/store/global-error'
import { useFormatError,} from '@/hooks/use-format-error'
import React, { useState, useEffect } from 'react'

export const InteractionBar = (
    post: PostItem
) => {
    const { data: comments, isLoading: commentLoading } = useGetPostComments(post.id)
    const commentCount = comments?.length ?? ""
    const { data: likes, isLoading: likeLoading } = useGetPostLike(post.id)
    const likeCount = likes?.likeCount ?? ""
    const { setError } = useGlobalErrorStore()
    const { formatErrorMessage } = useFormatError()
    const [localHasLiked, setLocalHasLiked] = useState(likes?.hasLiked ?? false);

    const handleLike = async () => {
        const previousState = localHasLiked;
        const newState = !previousState;
        setLocalHasLiked(newState);

        try {
            if (newState) {
                await likePost({ postId: post.id });
            } else {
                await unlikePost({ postId: post.id });
            }
        } catch (error) {
            setLocalHasLiked(previousState);
        }
    };

    useEffect(() => {
        setLocalHasLiked(likes?.hasLiked ?? false);
    }, [likes?.hasLiked]);

    const { mutateAsync: likePost } = useCreatePostLike({
        onSuccess: () => {
            console.log('Post liked successfully')
        },
        onError: async (error: ErrorResponse) => {
            // const errorObj = await error
            // setError(formatErrorMessage(errorObj))
        },
    })

    const { mutateAsync: unlikePost } = useDeletePostLike({
        onSuccess: () => {
            console.log('Post unliked successfully')
        },
        onError: async (error: ErrorResponse) => {
            // const errorObj = await error
            // setError(formatErrorMessage(errorObj))
        },
    })

    const handleComment = async () => {
        console.log('Handle comment action for post:', post.id)
    }

    const handleShare = async () => {
        console.log('Handle share action for post:', post.id)
    }

    return (
        <div className="flex items-center gap-6 text-foreground/50">
            <button className="group flex items-center gap-2" 
            onClick={() => {handleLike()}}
            >
                <Heart
                    className={`stroke-primary  ${localHasLiked ? 'fill-primary' : ''}`}
                    size={20}
                />
                <span className="text-sm">
                    {likeLoading ? '...' : likeCount}
                </span>
            </button>
            <button className="group flex items-center gap-2" onClick={() => {
                handleComment()
            }}>
                <MessageCircle
                    className="stroke-primary"
                    size={20}
                />
                <span className="text-sm">
                    {commentLoading ? '...' : commentCount}
                </span>
            </button>
            <div className="ml-auto flex items-center gap-6">
                <button className="group flex items-center gap-2" onClick={() => {
                    handleShare()
                }}>
                    <Share2
                        className="stroke-primary"
                        size={16}
                    />
                </button>
            </div>
        </div>
    )
}
