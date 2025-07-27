export const mapImageUrl = (imagePath: string, field: 'user' | 'feed') => {
    if (!imagePath) return null
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/vcafe-${field}/${imagePath}`
}
