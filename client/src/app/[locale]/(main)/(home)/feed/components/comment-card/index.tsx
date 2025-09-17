import PostCard from '@/components/post-card'
import type { Comment } from '../post-dialog/types'
import { Card, CardContent } from '@/components/ui/card'
import AvatarRole from '@/components/avatar-with-role-border'

interface Props {
    comment: Comment
}

const CommentCard = ({ comment }: Props) => {
    return (
        <div className="flex gap-4">
            <AvatarRole
                image={comment?.author.image}
                username={comment?.author.username}
                role={comment?.author.role}
            />
            <Card className="flex-1 flex flex-col gap-2">
                <CardContent>{comment.content}</CardContent>
            </Card>
        </div>
    )
}

export default CommentCard
