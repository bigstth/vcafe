'use client'
import React, { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useAuth } from '@/contexts/auth-provider'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { userInfoFormSchema } from './types'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { useUpdateUser } from './use-update-user'
import { toast } from 'sonner'

const UpdateUserInfoDialog = () => {
    const t = useTranslations()
    const { user, refreshUserData, signOut } = useAuth()
    const [showDialog, setShowDialog] = React.useState(false)
    const { mutate: updateUserInfo, isPending: updating } = useUpdateUser({
        onSuccess: () => {
            refreshUserData()
            setShowDialog(false)
            toast.success(t('features.update_user.welcome'))
        },
    })
    const form = useForm<z.infer<typeof userInfoFormSchema>>({
        resolver: zodResolver(userInfoFormSchema),
        defaultValues: {
            username: '',
        },
    })

    useEffect(() => {
        if (user && !user?.username) {
            setShowDialog(true)
        }
    }, [user])

    const onSubmit = async (data: z.infer<typeof userInfoFormSchema>) => {
        updateUserInfo(data)
    }

    return (
        <Dialog open={showDialog}>
            <form>
                <DialogContent
                    className="sm:max-w-[425px]"
                    showCloseButton={false}
                >
                    <DialogHeader>
                        <DialogTitle className="mb-4">
                            {t('features.update_user.title')}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {' '}
                                            {t('re_use.username')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('re_use.password')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="displayUsername"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {' '}
                                            {t('re_use.display_name')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('re_use.avatar_image')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                onChange={(event) => {
                                                    const file =
                                                        event.target.files?.[0]
                                                    field.onChange(file)
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                                ref={field.ref}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="flex !flex-row !justify-between">
                                <Button
                                    variant="outline"
                                    disabled={updating}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setShowDialog(false)
                                        signOut()
                                    }}
                                >
                                    {t('re_use.actions.sign_out')}
                                </Button>
                                <Button type="submit" disabled={updating}>
                                    {t('re_use.actions.confirm')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default UpdateUserInfoDialog
