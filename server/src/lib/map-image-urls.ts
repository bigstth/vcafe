interface ImageWithUrl {
    id: string
    postId: string
    url: string
    displayOrder: number
    altText: string | null
}
export const mapImageUrls = (images: ImageWithUrl[]) => {
    if (!images || images.length === 0) return []

    return images.map((img: ImageWithUrl) => ({
        alt: img.altText || 'VCAFE post image',
        url: `${process.env.SUPABASE_URL}/storage/v1/object/public/vcafe-feed/${img.url}`,
    }))
}
export const formatAvatarImageUrl = (userId: string) => {
    if (!userId) return ''

    return `${process.env.SUPABASE_URL}/storage/v1/object/public/vcafe-user/${userId}`
}
