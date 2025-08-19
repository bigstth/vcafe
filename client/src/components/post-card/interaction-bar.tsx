'use client'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { useCreatePostLike } from './use-create-post-like'
import { useGlobalErrorStore } from '@/store/global-error'
import { ErrorResponse, useFormatError } from '@/hooks/use-format-error'
import React, { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'
import { useGetPostComments } from '@/app/[locale]/(main)/(home)/feed/use-get-post-comment'
import { useGetPostLike } from '@/app/[locale]/(main)/(home)/feed/use-get-post-like'

type InteractionBarProps = {
    post: any
    setShowCreateComment?: React.Dispatch<React.SetStateAction<boolean>>
    setPost?: React.Dispatch<React.SetStateAction<any | null>>
}

const InteractionBar: React.FC<InteractionBarProps> = ({
    post,
    setShowCreateComment,
    setPost
}) => {
    const { data: comments, isLoading: commentLoading } = useGetPostComments(
        post.id
    )
    const commentCount = comments?.length ?? ''
    const { data: likes, isLoading: likeLoading } = useGetPostLike(post.id)
    const likeCount = likes?.likeCount ?? ''
    const { setError } = useGlobalErrorStore()
    const { formatErrorMessage } = useFormatError()
    const [localHasLiked, setLocalHasLiked] = useState(likes?.hasLiked ?? false)

    useEffect(() => {
        setLocalHasLiked(likes?.hasLiked ?? false)
    }, [likes?.hasLiked])

    const { mutateAsync: likePost } = useCreatePostLike({
        onError: async (error: ErrorResponse) => {
            const errorObj = await error
            setError(formatErrorMessage(errorObj))
        }
    })

    const handleComment = async () => {
        console.log('Handle comment action for post:', post.id)
        setShowCreateComment?.(true)
        setPost?.(post)
    }

    const handleShare = async () => {
        console.log('Handle share action for post:', post.id)
    }

    const handleLike = useDebounce(
        async () => {
            const previousState = localHasLiked
            const newState = !previousState
            setLocalHasLiked(newState)

            try {
                await likePost({ postId: post.id })
            } catch {
                setLocalHasLiked(previousState)
            }
        },
        500,
        { leading: true, trailing: false }
    )

    return (
        <div className="flex items-center gap-6 text-foreground/50">
            <Button
                variant="ghost"
                className="group flex items-center gap-2"
                onClick={() => {
                    handleLike()
                }}
            >
                <Heart
                    className={`stroke-primary  ${
                        localHasLiked ? 'fill-primary' : ''
                    }`}
                    size={20}
                />
                <span className="text-sm">
                    {likeLoading ? <Skeleton className="h-4 w-6" /> : likeCount}
                </span>
            </Button>
            <Button
                variant="ghost"
                className="group flex items-center gap-2"
                onClick={() => handleComment()}
            >
                <MessageCircle className="stroke-primary" size={20} />
                <span className="text-sm">
                    {commentLoading ? (
                        <Skeleton className="h-4 w-6" />
                    ) : (
                        commentCount
                    )}
                </span>
            </Button>
            <div className="ml-auto flex items-center gap-6">
                <Button
                    variant="ghost"
                    className="group flex items-center gap-2"
                    onClick={() => handleShare()}
                >
                    <Share2 className="stroke-primary" size={16} />
                </Button>
            </div>
        </div>
    )
}

export default InteractionBar
