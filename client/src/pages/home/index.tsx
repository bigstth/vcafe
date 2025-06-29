import { useState } from 'react'
import beaver from '@/assets/beaver.svg'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { authClient } from '@/lib/auth-client'

type ResponseType = Awaited<ReturnType<typeof api.hello.$get>>

function Home() {
    const [data, setData] = useState<Awaited<ReturnType<ResponseType['json']>> | undefined>()
    async function sendRequest() {
        try {
            const res = await api.hello.$get()
            if (!res.ok) {
                console.log('Error fetching data')
                return
            }
            const data = await res.json()
            setData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getSession = async () => {
        const session = await authClient.getSession()

        console.log(session, 'session')
    }

    const signIn = async () => {
        const data = await authClient.signIn.social({
            provider: 'google',
        })

        console.log(data, 'data')
    }

    const signOut = async () => {
        const data = await authClient.signOut()

        console.log(data, 'data')
    }

    return (
        <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
            <a href="https://github.com/stevedylandev/bhvr" target="_blank">
                <img src={beaver} className="w-16 h-16 cursor-pointer" alt="beaver logo" />
            </a>
            <Button onClick={signIn} className="mb-4">
                Sign In with Google
            </Button>
            <Button onClick={signOut} className="mb-4">
                Sign Out
            </Button>
            <Button onClick={getSession} className="mb-4">
                Get Session
            </Button>
            <h1 className="text-5xl font-black">bhvr</h1>
            <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
            <p>A typesafe fullstack monorepo</p>
            <div className="flex items-center gap-4">
                <Button onClick={() => sendRequest()}>Call API</Button>
                <Button variant="secondary" asChild>
                    <a target="_blank" href="https://bhvr.dev">
                        Docs
                    </a>
                </Button>
            </div>
            {data && (
                <pre className="bg-gray-100 p-4 rounded-md">
                    <code>
                        Message: {data.message} <br />
                        Success: {data.success.toString()}
                    </code>
                </pre>
            )}
        </div>
    )
}

export default Home
