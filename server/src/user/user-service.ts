import { AppError } from '@server/lib/error'
import { getMeRepository } from './user-repository'

export const getMeService = async (id: string) => {
    const user = await getMeRepository(id)

    if (!user) {
        throw new AppError({
            en: 'User not found',
            th: 'ไม่พบผู้ใช้',
            statusName: 'user_not_found',
            status: 404,
        })
    }

    return user
}
