'use client'
import React, { useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { useGetPosts } from './use-get-post'
import PostCard from '../../../(home)/feed/components/post-card'
import CommentCard from './component/comment-card'
import { Card, CardContent } from '@/components/ui/card'

const PostPage = () => {
    const { postId } = useParams<{
        username: string
        postId: string
    }>()

    const { data: post, isFetching } = useGetPosts(postId)
    console.log('Post data:', post)

    if (!isFetching && !post) {
        notFound()
    }

    return (
        <div className="w-full flex flex-col mt-4 items-center justify-center">
            <div className="w-full max-w-[600px]">
                {post && <PostCard post={post} />}

                <Card className=' mt-4'>
                    <CardContent className="">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-lg font-semibold mb-4">Comments</h2>
                            {post?.comments?.map((comment) => (
                                <CommentCard key={comment.id} comment={comment} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default PostPage
