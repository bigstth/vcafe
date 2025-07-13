export const noPostFoundError: ErrorResponseType = {
    en: 'No post found',
    th: 'ไม่พบโพสต์',
    statusName: 'post_not_found',
    status: 404,
}

export const getPostFailed: ErrorResponseType = {
    en: 'Failed to get post',
    th: 'ไม่สามารถดึงโพสต์ได้',
    statusName: 'get_post_failed',
    status: 500,
}
export const getImageFailed: ErrorResponseType = {
    en: 'Failed to get image',
    th: 'ไม่สามารถดึงภาพได้',
    statusName: 'get_image_failed',
    status: 500,
}

export const createPostFailed: ErrorResponseType = {
    en: 'Failed to create post',
    th: 'สร้างโพสต์ล้มเหลว',
    statusName: 'create_post_failed',
    status: 500,
}

export const failedToDelete: ErrorResponseType = {
    en: 'Failed to delete post',
    th: 'ไม่สามารถลบโพสต์ได้',
    statusName: 'delete_post_failed',
    status: 500,
}

export const postAlreadyDeleted: ErrorResponseType = {
    en: 'Post is already deleted',
    th: 'โพสต์ถูกลบแล้ว',
    statusName: 'post_already_deleted',
    status: 400,
}

export const insufficientPermissionToDelete: ErrorResponseType = {
    en: 'You do not have permission to delete this post',
    th: 'คุณไม่มีสิทธิ์เก็บถาวรโพสต์นี้',
    statusName: 'insufficient_permissions_to_delete',
    status: 403,
}

export const insufficientPermissionToArchive: ErrorResponseType = {
    en: 'You do not have permission to archive this post',
    th: 'คุณไม่มีสิทธิ์เก็บถาวรโพสต์นี้',
    statusName: 'insufficient_permissions_to_archive',
    status: 403,
}

export const postAlreadyArchived: ErrorResponseType = {
    en: 'Post is already archived',
    th: 'โพสต์ถูกเก็บถาวรแล้ว',
    statusName: 'post_already_archived',
    status: 400,
}

export const failedToArchive: ErrorResponseType = {
    en: 'Failed to archive post',
    th: 'ไม่สามารถเก็บถาวรโพสต์ได้',
    statusName: 'archive_post_failed',
    status: 500,
}

export const cannotUnarchiveDeletedPost: ErrorResponseType = {
    en: 'Cannot unarchive deleted post',
    th: 'ไม่สามารถยกเลิกการเก็บถาวรโพสต์ที่ถูกลบแล้ว',
    statusName: 'cannot_unarchive_deleted_post',
    status: 400,
}

export const postNotArchived: ErrorResponseType = {
    en: 'Post is not archived',
    th: 'โพสต์ไม่ได้ถูกเก็บถาวร',
    statusName: 'post_not_archived',
    status: 400,
}

export const insufficientPermissionToUnarchive: ErrorResponseType = {
    en: 'You do not have permission to unarchive this post',
    th: 'คุณไม่มีสิทธิ์ยกเลิกการเก็บถาวรโพสต์นี้',
    statusName: 'insufficient_permissions',
    status: 403,
}

export const failedToUnarchive: ErrorResponseType = {
    en: 'Failed to unarchive post',
    th: 'ไม่สามารถยกเลิกการเก็บถาวรโพสต์ได้',
    statusName: 'unarchive_post_failed',
    status: 500,
}
