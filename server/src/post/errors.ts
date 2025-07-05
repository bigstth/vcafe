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
