import { db } from '@server/db/db-instance'

export const getMeRepository = async (id: string) => {
    return db.query.user.findFirst({ where: (u, { eq }) => eq(u.id, id) })
}
