'use client'
import React, { useState } from 'react'
import { useGetPosts } from './use-get-posts'
import CreatePostComponent from './components/create-post'
import CreateComment from './components/create-comment'
import PostSkeleton from '@/components/post-card/post-skeleton'
import PostCard from '@/components/post-card'
import type { Post } from './types'

const Feed = () => {
    const [pagination] = useState({ offset: 0, limit: 10 })
    const { data: posts, isLoading } = useGetPosts(pagination)
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
                {isLoading ? (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                ) : (
                    posts?.posts.map((post: Post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            setShowCreateComment={setShowCreateComment}
                            setPost={setPost}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default Feed
