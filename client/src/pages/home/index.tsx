import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'
import axios from 'axios'

type MeResponseType = Awaited<ReturnType<typeof api.user.me.$get>>
type PostsResponseType = Awaited<ReturnType<typeof api.posts.$get>>

function Home() {
    const [me, setMe] = useState<
        Awaited<ReturnType<MeResponseType['json']>> | undefined
    >()
    const [posts, setPosts] = useState<
        Awaited<ReturnType<PostsResponseType['json']>> | undefined
    >()
    const [file, setFile] = useState<FileList | null>(null)

    async function getMe() {
        try {
            const res = await api.user.me.$get()
            if (!res.ok) {
                console.log('Error fetching data')
                return
            }
            const data = await res.json()
            setMe(data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getAccount() {
        try {
            const res = await api.user.me.$get()
            if (!res.ok) {
                console.log('Error fetching data')
                return
            }
            const data = await res.json()
            console.log(data, 'data')
        } catch (error) {
            console.log(error)
        }
    }

    async function getPosts() {
        try {
            const res = await api.posts.$get({
                query: {
                    limit: '10',
                    offset: '0',
                    orderBy: 'desc',
                },
            })
            if (!res.ok) {
                console.log('Error fetching data')
                return
            }
            const data = await res.json()
            setPosts(data)
        } catch (error) {
            console.log(error)
        }
    }

    async function getPostById(id: string) {
        console.log(id, 'id')
        try {
            const res = await api.posts[':id'].$get({
                param: { id },
            })

            if (!res.ok) {
                console.log('Error fetching data')
                return
            }
            const data = await res.json()

            console.log(data, 'data')
        } catch (error) {
            console.log(error)
        }
    }

    async function comment(id: string) {
        try {
            const response = await axios.post(
                `/api/comments/${id}`,
                { content: 'zaaa' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            )
            console.log(response.data, 'data')
        } catch (error) {
            console.log('Error creating comment:', error)
        }
    }

    async function createPost() {
        try {
            const formData = new FormData()
            formData.append('content', 'Hello, this is a new postasd!')
            formData.append('visibility', 'public')

            // Handle array of files
            if (file && file.length > 0) {
                for (let i = 0; i < file.length; i++) {
                    formData.append('images', file[i])
                }
            }

            const response = await axios.post('/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            })

            console.log(response.data, 'data')
            getPosts()
        } catch (error) {
            console.log('Error creating post:', error)
        }
    }

    const signIn = async () => {
        await authClient.signIn.social({
            provider: 'google',
        })
    }

    const signInTwitch = async () => {
        await authClient.signIn.social({
            provider: 'twitch',
        })
    }

    const signInTwitter = async () => {
        await authClient.signIn.social({
            provider: 'twitter',
        })
    }

    const signOut = async () => {
        await authClient.signOut()
    }

    return (
        <div className="p-4">
            <div className="flex gap-2">
                <Button onClick={signIn} className="mb-4">
                    Sign In with Google
                </Button>
                <Button onClick={signInTwitch} className="mb-4">
                    Sign In with Twitch
                </Button>
                <Button onClick={signInTwitter} className="mb-4">
                    Sign In with Twitter
                </Button>
                <Button onClick={signOut} className="mb-4">
                    Sign Out
                </Button>
                <Button onClick={() => getMe()}>Get Me</Button>
                <Button onClick={() => getAccount()}>Get Acc</Button>
                <Button onClick={() => getPosts()}>Get Posts</Button>
                <Button onClick={() => createPost()}>Create Posts</Button>
            </div>
            <div className="w-full text-balance">
                {me && (
                    <div className="mb-4">
                        <h2>Me:</h2>
                        <pre className="whitespace-pre-wrap break-words">
                            {JSON.stringify(me, null, 2) ?? ''}
                        </pre>
                    </div>
                )}

                {posts &&
                    'posts' in posts &&
                    Array.isArray(posts.posts) &&
                    posts.posts.map((post) => (
                        <div key={post.id}>
                            <Button
                                onClick={() => {
                                    getPostById(post.id)
                                }}
                            >
                                Get post by id
                            </Button>
                            <Button
                                onClick={() => {
                                    comment(post.id)
                                }}
                            >
                                Comment
                            </Button>
                            <h3>{post.content}</h3>
                            <p>Visibility: {post.visibility}</p>
                            <p>Created At: {post.createdAt}</p>
                        </div>
                    ))}
            </div>
            <input
                type="file"
                multiple
                onChange={(e) => {
                    const files = e.target.files
                    console.log(files, 'files')
                    setFile(files)
                }}
                className="border border-gray-300 rounded p-2 mb-4"
            />
        </div>
    )
}

export default Home
