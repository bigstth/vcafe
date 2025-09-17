import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { renderImages } from './image-render'
import { useTimeAgo } from '@/hooks/use-get-time-ago'
import AvatarRole from '@/components/avatar-with-role-border'
import InteractionBar from './interaction-bar'
import type { Post } from '@/app/[locale]/(main)/(home)/feed/types'
import { getTextColorByRole } from '@/lib/role-preference'

type PostCardProps = {
    post: Post
    setShowPostDialog?: React.Dispatch<React.SetStateAction<boolean>>
    setPost?: React.Dispatch<React.SetStateAction<Post | null>>
    contentClassName?: string
    cardClassName?: string
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    setShowPostDialog,
    setPost,
    contentClassName,
    cardClassName
}) => {
    const getTimeAgo = useTimeAgo()
    return (
        <Card className={cardClassName}>
            <CardContent className={contentClassName}>
                <div className="flex items-start gap-4 w-full">
                    <AvatarRole
                        image={post?.author?.image}
                        username={post?.author?.username}
                        role={post?.author?.role}
                    />
                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        <div className="flex flex-wrap">
                            <Link href={`/${post?.author.username}`}>
                                <span
                                    className={`${getTextColorByRole(
                                        post?.author.role
                                    )} font-semibold`}
                                >
                                    {post?.author.displayUsername ||
                                        post?.author.username}
                                </span>
                                {/* <span
                                    className={`text-foreground/50 font-medium`}
                                >
                                    {` @${post?.author.username}`}
                                </span> */}
                            </Link>
                            <span className="mx-1"> </span>
                            <Link
                                href={`${post?.author.username}/posts/${post?.id}`}
                            >
                                <span className="text-foreground/50 font-medium">
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
                            setShowPostDialog={setShowPostDialog}
                            setPost={setPost}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PostCard
