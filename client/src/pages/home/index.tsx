import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'

type MeResponseType = Awaited<ReturnType<typeof api.user.me.$get>>
type PostsResponseType = Awaited<ReturnType<typeof api.posts.$get>>

function Home() {
    const [me, setMe] = useState<Awaited<ReturnType<MeResponseType['json']>> | undefined>()
    const [posts, setPosts] = useState<Awaited<ReturnType<PostsResponseType['json']>> | undefined>()

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

    async function createPost() {
        try {
            const res = await api.posts.$post({
                json: {
                    content: 'Hello, this is a new post!',
                    visibility: 'public',
                },
            })

            if (!res.ok) {
                console.log('Error fetching data')
                return
            }

            const data = await res.json()
            console.log(data, 'data')
            getPosts()
        } catch (error) {
            console.log(error)
        }
    }

    const signIn = async () => {
        await authClient.signIn.social({
            provider: 'google',
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
                <Button onClick={signOut} className="mb-4">
                    Sign Out
                </Button>
                <Button onClick={() => getMe()}>Get Me</Button>
                <Button onClick={() => getPosts()}>Get Posts</Button>
                <Button onClick={() => createPost()}>Create Posts</Button>
            </div>
            <div className="w-full text-balance">
                {me && (
                    <div className="mb-4">
                        <h2>Me:</h2>
                        <pre className="whitespace-pre-wrap break-words">{JSON.stringify(me, null, 2) ?? ''}</pre>
                    </div>
                )}

                {posts && (
                    <div className="mb-4">
                        <h2>Posts:</h2>
                        <pre className="whitespace-pre-wrap break-words">{JSON.stringify(posts, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
