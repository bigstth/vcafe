'use client'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { useCreatePostLike } from './use-create-post-like'
import { useGlobalErrorStore } from '@/store/global-error'
import { ErrorResponse, useFormatError } from '@/hooks/use-format-error'
import React, { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'
import type { Post } from '@/app/[locale]/(main)/(home)/feed/types'

type InteractionBarProps = {
    post: Post
    setShowPostDialog?: React.Dispatch<React.SetStateAction<boolean>>
    setPost?: React.Dispatch<React.SetStateAction<Post | null>>
}

const InteractionBar: React.FC<InteractionBarProps> = ({
    post,
    setShowPostDialog,
    setPost
}) => {
    const likeCount = post?.likesCount ?? ''
    const { setError } = useGlobalErrorStore()
    const { formatErrorMessage } = useFormatError()
    const [localHasLiked, setLocalHasLiked] = useState(post?.hasLiked ?? false)

    useEffect(() => {
        setLocalHasLiked(post?.hasLiked ?? false)
    }, [post?.hasLiked])

    const { mutateAsync: likePost, isPending: likeLoading } = useCreatePostLike(
        {
            onError: async (error: ErrorResponse) => {
                const errorObj = await error
                setError(formatErrorMessage(errorObj))
            }
        }
    )

    const handleComment = async () => {
        setShowPostDialog?.(true)
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
                <span className="text-sm">{post.commentsCount}</span>
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
