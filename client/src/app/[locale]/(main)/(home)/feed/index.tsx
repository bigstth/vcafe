'use client'
import React, { useState } from 'react'
import { useGetPosts } from './use-get-posts'
import CreatePostComponent from './components/create-post'
import PostCard from './components/post-card'
import PostSkeleton from './components/post-card/post-skeleton'
import CreateCommentComponent from './components/create-comment'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react';
import { PostItem } from './types'

const Feed = () => {
    const [pagination] = useState({ offset: 0, limit: 10 })
    const { data: posts, isFetching } = useGetPosts(pagination)
    const postx = posts?.posts[0]
    const [showCreateComment, setShowCreateComment] = useState(false)
    const [post, setPost] = useState<PostItem | null>(null)

    return (
        <div className="w-full max-w-[600px]">
            <div className={` ${showCreateComment ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" />
                <div className="z-50 fixed w-[600px] top-1/8 left-1/2 -translate-x-1/2">
                    <Card>
                        <CardContent >
                            <button
                                onClick={() => setShowCreateComment(false)}
                            >
                                <X className="absolute top-4 right-4 cursor-pointer text-xl mx-4 my-2" />
                            </button>

                            <CreateCommentComponent
                                post={post}
                                setShowCreateComment={setShowCreateComment}
                                setPost={setPost}
                            />
                        </CardContent>
                    </Card>

                </div>
            </div>

            <CreatePostComponent />

            <div className="mt-8 flex flex-col gap-4">
                {isFetching ? (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                ) : (
                    posts?.posts.map((post) => (
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
