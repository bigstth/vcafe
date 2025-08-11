import React from 'react'
import type { PostItem } from '../../types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { renderImages } from './image-render'
import { useTimeAgo } from '@/hooks/use-get-time-ago'
import AvatarRole from '@/components/avatar-with-role-border'
import InteractionBar from './interaction-bar'

type PostCardProps = {
    post: PostItem
    setShowCreateComment?: React.Dispatch<React.SetStateAction<boolean>>
    setPost?: React.Dispatch<React.SetStateAction<PostItem | null>>
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    setShowCreateComment,
    setPost
}) => {
    const getTimeAgo = useTimeAgo()
    return (
        <Card>
            <CardContent>
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
                                    {getTimeAgo(new Date(post?.createdAt))}
                                </span>
                            </Link>
                        </div>
                        <pre className="whitespace-pre-wrap break-words">
                            {post?.content}
                        </pre>
                        {renderImages(post)}
                        <InteractionBar
                            post={post}
                            setShowCreateComment={setShowCreateComment}
                            setPost={setPost}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PostCard
