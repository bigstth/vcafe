import { createMiddleware } from 'hono/factory'
import { auth } from '../lib/auth'
import { HTTPException } from 'hono/http-exception'

export const protect = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession(c.req.raw)
    console.log('Session:', session)
    if (!session?.user) {
        throw new HTTPException(401, { message: 'Unauthorized' })
    }

    c.set('user', session.user)

    await next()
})
