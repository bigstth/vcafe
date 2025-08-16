import { Hono } from 'hono'
import {
    followUserController,
    unfollowUserController,
    getFollowersController,
    getFollowingController,
    getFollowStatusController,
    getFollowStatsController
} from '../../follow/controller.js'
import { protect } from '../../middleware/auth.js'
import { validateParam, validateQuery } from '../../middleware/validator.js'
import { userIdSchema, followListSchema } from './validate-schema.js'

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
