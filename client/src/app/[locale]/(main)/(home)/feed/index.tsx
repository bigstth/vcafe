'use client'
import React from 'react'
import { useGetPosts } from './use-get-post'
import CreatePostComponent from './components/create-post'

const Feed = () => {
    const { data: posts, isFetching } = useGetPosts({ offset: 0 })
    console.log(posts, 'posts')
    return (
        <div className="w-full max-w-[600px]">
            <CreatePostComponent />

            <div className="mt-4">
                {posts?.posts.map((post: any) => (
                    <div key={post.id} className="p-4 border-1 rounded-lg mb-4">
                        <h2 className="text-lg font-semibold">
                            {post.author.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {post.content}
                        </p>
                        {post.images && post.images.length > 0 && (
                            <div className="mt-2">
                                {post.images.map((image: any) => (
                                    <img
                                        key={image.url}
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-20 h-auto rounded-md"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Feed
