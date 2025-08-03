import React from 'react'
import type { PostItem } from '../../types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { getTimeAgo } from '@/lib/get-time-ago'
import { renderImages } from './image-render'

const PostCard = ({ post }: { post: PostItem }) => {
    return (
        <Card>
            <CardContent>
                <div className="flex items-start gap-4">
                    <Avatar className="[&>svg]:size-5! w-10 h-10">
                        <AvatarImage src={post?.author?.image || undefined} />
                        <AvatarFallback>
                            {post?.author?.username?.[0] || 'Hi'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-4">
                        <Link
                            href={`/profile/${post.author.username}`}
                            className="flex flex-col"
                        >
                            <h2 className="font-semibold">
                                {post.author.displayUsername ||
                                    post.author.username}
                                <span className="text-foreground/50 font-medium">
                                    {` @${post.author.username}`}
                                </span>

                                <span className="text-foreground/50 font-medium">
                                    {` `}·{' '}
                                    {getTimeAgo(new Date(post.createdAt))}
                                </span>
                            </h2>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {post.content}
                        </p>
                        {renderImages(post)}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PostCard
