'use client'
import { useLocale } from 'next-intl'

export const useChangeLocale = () => {
    const currentLocale = useLocale()

    const changeLocale = (newLocale: string) => {
        if (newLocale === currentLocale) return

        // Set locale cookie
        document.cookie = `locale=${newLocale}; path=/; max-age=${
            60 * 60 * 24 * 365
        }; SameSite=Lax`

        // Force refresh to apply new locale
        window.location.reload()
    }

    return {
        changeLocale,
        currentLocale,
        availableLocales: ['en', 'th'] as const
    }
}
