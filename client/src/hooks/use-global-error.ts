import { useGlobalErrorStore } from '@/store/global-error'
import { useEffect } from 'react'
import { toast } from 'sonner'

export type ErrorType = {
    error: {
        en: string
        th: string
        status: string
        message?: string
    }
}

export const useGlobalError = () => {
    const { error } = useGlobalErrorStore()

    useEffect(() => {
        if (error) {
            const errMsg = error || 'Something went wrong'
            toast.error(errMsg, {})
        }
    }, [error])
}
