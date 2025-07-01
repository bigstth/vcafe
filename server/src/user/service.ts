import { AppError } from '@server/lib/error'
import { getMeRepository } from './repository'
import { userNotFoundError } from '@server/errors/user'

export const getMeService = async (id: string) => {
    const user = await getMeRepository(id)

    if (!user) {
        throw new AppError(userNotFoundError)
    }

    return user
}
