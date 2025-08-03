'use client'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'

type ErrorDetail = {
    field: string
    message: string
    received?: string
}

export type ErrorResponse = {
    status?: string
    message: string
    details?: ErrorDetail[]
    th?: string
    en?: string
    [key: string]: any
}

export const useFormatError = () => {
    const locale = useLocale()
    const t = useTranslations('re_use.errors')

    const formatErrorMessage = (errorResponse: ErrorResponse): string => {
        if (
            errorResponse.details &&
            Array.isArray(errorResponse.details) &&
            errorResponse.details.length > 0
        ) {
            return errorResponse.details
                .map((detail) => detail.message)
                .join('\n')
        }

        return (
            errorResponse?.[locale] ||
            errorResponse.message ||
            t('something_went_wrong')
        )
    }

    return { formatErrorMessage }
}
