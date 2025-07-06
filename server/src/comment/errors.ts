export const getCommentsFailed: ErrorResponseType = {
    en: 'Failed to get comments',
    th: 'ไม่สามารถดึงความคิดเห็นได้',
    statusName: 'get_comments_failed',
    status: 500,
}

export const createCommentError: ErrorResponseType = {
    en: 'Failed to create comment',
    th: 'สร้างความคิดเห็นล้มเหลว',
    statusName: 'create_comment_failed',
    status: 500,
}
