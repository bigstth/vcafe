import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { UserInfoFormValues } from './types'
import { useGlobalErrorStore } from '@/store/global-error'
import { useLocale } from 'next-intl'
import type { ErrorType } from '@/hooks/use-global-error'

export const useUpdateUser = (
    options?: UseMutationOptions<unknown, unknown, UserInfoFormValues>
) => {
    const locale = useLocale()
    const { setError } = useGlobalErrorStore()
    return useMutation<unknown, unknown, UserInfoFormValues>({
        mutationKey: ['update-user'],
        mutationFn: async (data: UserInfoFormValues) => {
            const formData = new FormData()

            formData.append('username', data.username.toString())
            formData.append('displayUsername', data.displayUsername.toString())
            formData.append('password', data.password.toString())

            if (data.image && data.image instanceof File) {
                formData.append('image', data.image, data.image.name)
            }

            const response = await fetch('/api/user/register', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            if (response.ok) {
                return response.json()
            } else {
                const result = await response.json()
                throw result
            }
        },
        onError: (error: unknown) => {
            const lang = locale
            if (
                error &&
                typeof error === 'object' &&
                error !== null &&
                'error' in error
            ) {
                setError(
                    (error as ErrorType).error?.[
                        lang as keyof ErrorType['error']
                    ] as string
                )
            }
        },
        ...options,
    })
}
