import React from 'react'
import type { PostItem } from '../../types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { getTimeAgo } from '@/lib/get-time-ago'
import { renderImages } from './image-render'
import { InteractionBar } from './interaction-bar'

const PostCard = ({ post }: { post: PostItem }) => {
    return (
        <Card>
            <CardContent>
                <div className="flex items-start gap-4 w-full">
                    <Avatar className="[&>svg]:size-5! w-10 h-10">
                        <AvatarImage src={post?.author?.image || undefined} />
                        <AvatarFallback>
                            {post?.author?.username?.[0] || 'Hi'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        <div>
                            <Link href={`/profile/${post.author.username}`}>
                                <span className="font-semibold">
                                    {post.author.displayUsername ||
                                        post.author.username}
                                </span>
                                <span className="text-foreground/50 font-medium">
                                    {` @${post.author.username}`}
                                </span>
                            </Link>

                            <Link
                                href={`${post.author.username}/posts/${post.id}`}
                            >
                                <span className="text-foreground/50 font-medium">
                                    {` `}·{' '}
                                    {getTimeAgo(new Date(post.createdAt))}
                                </span>
                            </Link>
                        </div>
                        <pre className="whitespace-pre-wrap break-words">
                            {post.content}
                        </pre>
                        {renderImages(post)}
                        {InteractionBar(post)}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PostCard
