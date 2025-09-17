'use client'
import React, { useState } from 'react'
import CreatePostComponent from './components/create-post'
import PostDialog from './components/post-dialog'
import PostCard from '@/components/post-card'
import type { Post, PostResponse } from './types'

type Props = {
    posts?: PostResponse
}

const Feed = ({ posts }: Props) => {
    const [showPostDialog, setShowPostDialog] = useState(false)
    const [post, setPost] = useState<Post | null>(null)

    return (
        <div className="w-full max-w-[600px]">
            {post && (
                <PostDialog
                    post={post}
                    showPostDialog={showPostDialog}
                    setShowPostDialog={setShowPostDialog}
                />
            )}

            <CreatePostComponent />

            <div className="mt-8 flex flex-col gap-4">
                {posts?.posts?.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        setShowPostDialog={setShowPostDialog}
                        setPost={setPost}
                    />
                ))}
            </div>
        </div>
    )
}

export default Feed
