'use client'
import React, { useState } from 'react'
import CreatePostComponent from './components/create-post'
import CreateComment from './components/create-comment'
import PostCard from '@/components/post-card'
import type { Post, PostResponse } from './types'

type Props = {
    posts?: PostResponse
}

const Feed = ({ posts }: Props) => {
    const [showCreateComment, setShowCreateComment] = useState(false)
    const [post, setPost] = useState<Post | null>(null)

    return (
        <div className="w-full max-w-[600px]">
            <CreateComment
                post={post}
                showCreateComment={showCreateComment}
                setShowCreateComment={setShowCreateComment}
            />

            <CreatePostComponent />

            <div className="mt-8 flex flex-col gap-4">
                {posts?.posts?.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        setShowCreateComment={setShowCreateComment}
                        setPost={setPost}
                    />
                ))}
            </div>
        </div>
    )
}

export default Feed
