import { fetchPosts } from '@/services/post/post'
import Feed from './feed'

export default async function HomePage() {
    const posts = await fetchPosts({
        limit: 10,
        offset: 0
    })
    return (
        <div className="px-5 py-4 w-full flex flex-col mt-4 items-center justify-center">
            <Feed posts={posts} />
        </div>
    )
}
