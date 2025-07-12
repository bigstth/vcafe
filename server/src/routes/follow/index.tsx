import { protect } from '@server/middleware/auth'
import { validateParam, validateQuery } from '@server/middleware/validator'
import {
    followUserController,
    unfollowUserController,
    getFollowersController,
    getFollowingController,
    getFollowStatusController,
    getFollowStatsController,
} from '@server/follow/controller'
import { Hono } from 'hono'
import { userIdSchema, followListSchema } from './validate-schema'

const followRoutes = new Hono()
    .post('/:userId', protect, validateParam(userIdSchema), (c) =>
        followUserController(c)
    )
    .delete('/:userId', protect, validateParam(userIdSchema), (c) =>
        unfollowUserController(c)
    )
    .get(
        '/:userId/followers',
        validateParam(userIdSchema),
        validateQuery(followListSchema),
        (c) => getFollowersController(c)
    )
    .get(
        '/:userId/following',
        validateParam(userIdSchema),
        validateQuery(followListSchema),
        (c) => getFollowingController(c)
    )
    .get('/:userId/status', protect, validateParam(userIdSchema), (c) =>
        getFollowStatusController(c)
    )
    .get('/:userId/stats', validateParam(userIdSchema), (c) =>
        getFollowStatsController(c)
    )

export default followRoutes
