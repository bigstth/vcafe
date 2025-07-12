import type { ErrorResponseType } from '@server/lib/error'

export const invalidFollowError: ErrorResponseType = {
    en: 'Cannot follow yourself',
    th: 'ไม่สามารถติดตามตัวเองได้',
    statusName: 'invalid_follow',
    status: 400,
}

export const alreadyFollowingError: ErrorResponseType = {
    en: 'Already following this user',
    th: 'ติดตามผู้ใช้นี้อยู่แล้ว',
    statusName: 'already_following',
    status: 400,
}

export const notFollowingError: ErrorResponseType = {
    en: 'Not following this user',
    th: 'ไม่ได้ติดตามผู้ใช้นี้',
    statusName: 'not_following',
    status: 400,
}

export const followFailedError: ErrorResponseType = {
    en: 'Failed to follow user',
    th: 'ไม่สามารถติดตามผู้ใช้ได้',
    statusName: 'follow_failed',
    status: 500,
}

export const unfollowFailedError: ErrorResponseType = {
    en: 'Failed to unfollow user',
    th: 'ไม่สามารถเลิกติดตามผู้ใช้ได้',
    statusName: 'unfollow_failed',
    status: 500,
}

export const getFollowersFailedError: ErrorResponseType = {
    en: 'Failed to get followers',
    th: 'ไม่สามารถดึงรายชื่อผู้ติดตามได้',
    statusName: 'get_followers_failed',
    status: 500,
}

export const getFollowingFailedError: ErrorResponseType = {
    en: 'Failed to get following',
    th: 'ไม่สามารถดึงรายชื่อผู้ที่ติดตามได้',
    statusName: 'get_following_failed',
    status: 500,
}

export const getFollowStatusFailedError: ErrorResponseType = {
    en: 'Failed to get follow status',
    th: 'ไม่สามารถดึงสถานะการติดตามได้',
    statusName: 'get_follow_status_failed',
    status: 500,
}

export const getFollowStatsFailedError: ErrorResponseType = {
    en: 'Failed to get follow statistics',
    th: 'ไม่สามารถดึงสถิติการติดตามได้',
    statusName: 'get_follow_stats_failed',
    status: 500,
}
