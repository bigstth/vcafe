import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useRevalidate() {
    const router = useRouter()
    const [isRevalidating, setIsRevalidating] = useState(false)

    const revalidateTag = async (tag: string) => {
        try {
            setIsRevalidating(true)

            const response = await fetch('/api/revalidate/tag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag })
            })

            if (response.ok) {
                router.refresh()
                return { success: true }
            } else {
                throw new Error('Revalidation failed')
            }
        } catch (error) {
            console.error('Revalidation error:', error)
            return { success: false, error }
        } finally {
            setIsRevalidating(false)
        }
    }

    const revalidateMultipleTags = async (tags: string[]) => {
        try {
            setIsRevalidating(true)

            const promises = tags.map((tag) =>
                fetch('/api/revalidate/tag', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tag })
                })
            )

            await Promise.all(promises)
            router.refresh()
            return { success: true }
        } catch (error) {
            console.error('Multiple revalidation error:', error)
            return { success: false, error }
        } finally {
            setIsRevalidating(false)
        }
    }

    return {
        revalidateTag,
        revalidateMultipleTags,
        isRevalidating
    }
}
