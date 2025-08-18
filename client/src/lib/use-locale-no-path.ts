'use client'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

export const useLocaleNoPath = () => {
    const currentLocale = useLocale()
    const [locale, setLocale] = useState(currentLocale)

    const changeLocale = (newLocale: string) => {
        // Set cookie
        document.cookie = `locale=${newLocale}; path=/; max-age=${
            60 * 60 * 24 * 365
        }`

        // Refresh to apply new locale
        window.location.reload()
    }

    useEffect(() => {
        setLocale(currentLocale)
    }, [currentLocale])

    return {
        locale,
        changeLocale,
        availableLocales: ['en', 'th'] as const
    }
}
