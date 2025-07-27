export const userNotFoundError: ErrorResponseType = {
    en: 'User not found',
    th: 'ไม่พบผู้ใช้',
    statusName: 'user_not_found',
    status: 404,
}

export const userAlreadyExistsError: ErrorResponseType = {
    statusName: 'user_already_exists',
    en: 'Username already exists',
    th: 'ชื่อผู้ใช้มีอยู่แล้ว',
    status: 400,
}

export const updateUserError: ErrorResponseType = {
    en: 'Failed to update user information',
    th: 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้',
    statusName: 'update_user_failed',
    status: 400,
}

export const setPasswordError: ErrorResponseType = {
    en: 'Failed to set password',
    th: 'ไม่สามารถตั้งรหัสผ่านได้',
    statusName: 'set_password_failed',
    status: 400,
}

export const uploadAvatarError: ErrorResponseType = {
    en: 'Failed to upload avatar image',
    th: 'ไม่สามารถอัปโหลดรูปภาพประจำตัวได้',
    statusName: 'upload_avatar_failed',
    status: 400,
}
