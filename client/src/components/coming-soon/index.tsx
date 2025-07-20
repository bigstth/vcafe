import { useTranslations } from 'next-intl'
import React from 'react'

const ComingSoon = () => {
    const t = useTranslations('re_use')
    return (
        <div className="flex justify-center items-center h-[calc(100vh-64px)] text-5xl">
            {t('coming_soon')}
        </div>
    )
}

export default ComingSoon
