'use client'
import { usePathname, useRouter } from 'next/navigation'

export const useChangeLocale = () => {
    const router = useRouter()
    const pathname = usePathname()

    const changeLocale = (newLocale: string) => {
        const segments = pathname.split('/')

        if (segments[1] && segments[1].length === 2) {
            segments[1] = newLocale
        } else {
            segments.splice(1, 0, newLocale)
        }

        const newPath = segments.join('/') || '/'
        router.push(newPath)
    }

    return { changeLocale }
}
