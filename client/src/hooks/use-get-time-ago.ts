import { useLocale, useTranslations } from 'next-intl'

export const useTimeAgo = () => {
    const t = useTranslations('re_use')
    const locale = useLocale()

    const getTimeAgo = (created_at: Date): string => {
        const now = new Date()
        const seconds = Math.floor(
            (now.getTime() - created_at.getTime()) / 1000
        )

        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (minutes < 1) {
            return t('just_now')
        }

        if (minutes < 60) {
            return t('m', { count: minutes })
        }

        if (hours < 24) {
            return t('h', { count: hours })
        }

        if (days < 7) {
            return t('d', { count: days })
        }

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return created_at.toLocaleDateString(locale, options)
    }

    return getTimeAgo
}
