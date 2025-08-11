import { Card, CardContent } from '@/components/ui/card'
import { PostItem } from '../../types'
import { useAuth } from '@/contexts/auth-provider'
import { useForm } from 'react-hook-form'
import { useTimeAgo } from '@/hooks/use-get-time-ago'
import { useCreateComment } from './use-create-comment'
import { commentSchemaType } from '../../types'
import { toast } from 'sonner'
import debounce from 'lodash/debounce'
import CreateCommentComponent from './comment'
import { X } from 'lucide-react'

type CreateCommentProps = {
    post: PostItem | null
    showCreateComment: boolean
    setShowCreateComment?: React.Dispatch<React.SetStateAction<boolean>>
    setPost?: React.Dispatch<React.SetStateAction<PostItem | null>>
}
const CreateComment: React.FC<CreateCommentProps> = ({
    post,
    showCreateComment,
    setShowCreateComment,
    setPost
}) => {
    const { user } = useAuth()
    const form = useForm({ defaultValues: { content: '' } })
    const getTimeAgo = useTimeAgo()

    const { mutateAsync: createComment } = useCreateComment({
        onSuccess: () => {
            console.log('Comment created successfully')
            form.reset()
            setShowCreateComment?.(false)
            setPost?.(null)
        },
        onError: (error) => {
            toast.error(`Error creating comment: ${error.message}`)
        }
    })

    const onSubmit = debounce((data: { content: string }) => {
        if (!post?.id) {
            toast.error('Post not found')
            return
        }
        const payload: commentSchemaType = {
            postId: post.id,
            content: data.content
        }
        toast.promise(createComment(payload), {
            loading: 'Commenting...',
            success: 'Commented successfully!'
        })
    }, 500)

    return (
        <div className={` ${showCreateComment ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" />
            <div className="z-50 fixed w-[600px] top-1/8 left-1/2 -translate-x-1/2">
                <Card>
                    <CardContent>
                        <button onClick={() => setShowCreateComment?.(false)}>
                            <X className="absolute top-4 right-4 cursor-pointer text-xl mx-4 my-2" />
                        </button>

                        <CreateCommentComponent
                            post={post}
                            setShowCreateComment={setShowCreateComment}
                            setPost={setPost}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CreateComment
