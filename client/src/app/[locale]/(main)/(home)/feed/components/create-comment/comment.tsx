import { Card, CardContent } from '@/components/ui/card'
import { PostItem } from '../../types'
import AvatarRole from '@/components/avatar-with-role-border'
import { useAuth } from '@/contexts/auth-provider'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useTimeAgo } from '@/hooks/use-get-time-ago'
import { renderImages } from '../post-card/image-render'
import Link from 'next/link'
import { useCreateComment } from './use-create-comment'
import { commentSchemaType } from '../../types'
import { toast } from 'sonner'
import debounce from 'lodash/debounce'

type CreateCommentComponentProps = {
    post: PostItem | null;
    setShowCreateComment?: React.Dispatch<React.SetStateAction<boolean>>;
    setPost?: React.Dispatch<React.SetStateAction<PostItem | null>>;
};
const CreateCommentComponent: React.FC<CreateCommentComponentProps> = ({
    post,
    setShowCreateComment,
    setPost,
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
        },
    })

    const onSubmit = debounce((data: { content: string }) => {
        if (!post?.id) {
            toast.error('Post not found');
            return;
        }
        const payload: commentSchemaType = {
            postId: post.id,
            content: data.content,
        };
        toast.promise(createComment(payload), {
            loading: 'Commenting...',
            success: 'Commented successfully!',
        });
    }, 500)

    return (
        <div>
            <div className="flex items-start gap-4 w-full">
                <AvatarRole
                    image={post?.author?.image}
                    username={post?.author?.username}
                    role={post?.author?.role}
                />
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    <div>
                        <Link href={`/${post?.author.username}`}>
                            <span className="font-semibold">
                                {post?.author.displayUsername ||
                                    post?.author.username}
                            </span>
                            <span className="text-foreground/50 font-medium">
                                {` @${post?.author.username}`}
                            </span>
                        </Link>

                        <Link
                            href={`${post?.author.username}/posts/${post?.id}`}
                        >
                            <span className="text-foreground/50 font-medium">
                                {` `}·{' '}
                                {post?.createdAt ? getTimeAgo(new Date(post.createdAt)) : ''}
                            </span>
                        </Link>
                    </div>
                    <pre className="whitespace-pre-wrap break-words">
                        {post?.content}
                    </pre>
                    {post && renderImages(post)}
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <AvatarRole
                    image={user?.image}
                    username={user?.username}
                    role={user?.role}
                />
                <div className="flex-1 flex flex-col gap-2">
                    <Form {...form}>
                        <div>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    // placeholder={t('post_placeholder')}
                                                    placeholder='Write a comment...'
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </div>

                        <div className='flex justify-end'>
                            <Button
                                type="submit"
                                disabled={!form.watch('content')?.trim()}
                                onClick={form.handleSubmit(onSubmit)}
                            >
                                reply
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>

    );
}

export default CreateCommentComponent;