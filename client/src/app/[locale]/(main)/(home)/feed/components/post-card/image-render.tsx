import Image from 'next/image'
import type { PostItem } from '../../types'

export const renderImages = (post: PostItem) => {
    const images = post?.images || []

    if (images.length === 0) return null

    if (images.length === 1) {
        return (
            <div className="w-full h-full">
                <Image
                    src={images[0].url}
                    alt={images[0].alt}
                    width={384}
                    height={384}
                    className="w-full h-auto max-h-96! object-cover rounded-md"
                />
            </div>
        )
    }

    if (images.length === 2) {
        return (
            <div className="grid grid-cols-2 gap-2 w-full h-full">
                {images.map((image) => (
                    <Image
                        key={image.url}
                        src={image.url}
                        alt={image.alt}
                        width={192}
                        height={192}
                        className="w-full h-48! object-cover rounded-md"
                    />
                ))}
            </div>
        )
    }

    if (images.length === 3) {
        return (
            <div className="grid grid-cols-2 gap-2 w-full h-full">
                <Image
                    src={images[0].url}
                    alt={images[0].alt}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover rounded-md"
                />
                <div className="grid grid-rows-2 gap-2">
                    <Image
                        src={images[1].url}
                        alt={images[1].alt}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover rounded-md"
                    />
                    <Image
                        src={images[2].url}
                        alt={images[2].alt}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
            </div>
        )
    }

    if (images.length >= 4) {
        return (
            <div className="grid grid-cols-2 gap-2 w-full h-full">
                {images.slice(0, 4).map((image) => (
                    <div key={image.url} className="relative">
                        <Image
                            src={image.url}
                            alt={image.alt}
                            width={192}
                            height={192}
                            className="w-full h-48 object-cover rounded-md"
                        />
                    </div>
                ))}
            </div>
        )
    }

    return null
}
