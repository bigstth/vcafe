import AvatarRole from '@/components/avatar-with-role-border'
import { useAuth } from '@/contexts/auth-provider'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { z, infer as zodInfer } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'

const formSchema = z.object({
    content: z.string().min(1)
})

export type CreateCommentPayload = zodInfer<typeof formSchema>

type Props = {
    onSubmit: (payload: CreateCommentPayload) => void
}

const CreateCommentForm: React.FC<Props> = ({ onSubmit }) => {
    const t = useTranslations('features.feed')
    const { user } = useAuth()

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            content: ''
        }
    })

    const handleValidSubmit = (payload: CreateCommentPayload) => {
        onSubmit(payload)
        form.reset()
    }

    return (
        <div className="flex gap-4">
            <AvatarRole
                image={user?.image}
                username={user?.username}
                role={user?.role}
            />
            <div className="flex-1 flex flex-col gap-2">
                <Form {...form}>
                    <div>
                        <form onSubmit={form.handleSubmit(handleValidSubmit)}>
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write a comment..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!form.watch('content')?.trim()}
                            onClick={form.handleSubmit(handleValidSubmit)}
                        >
                            {t('actions.reply')}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default CreateCommentForm
