'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/auth-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Check, ImagePlus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { postSchema, type PostSchemaType } from '../types'
import { FormField, FormItem, FormControl, Form } from '@/components/ui/form'
import Image from 'next/image'
import { useGlobalErrorStore } from '@/store/global-error'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { MAX_IMAGES, VISIBILITY_OPTIONS } from './constants'

import { cn } from '@/lib/utils'
import { useCreatePost } from './use-create-post'
import { toast } from 'sonner'

const CreatePostComponent = () => {
    const t = useTranslations('features.feed')
    const { user } = useAuth()
    const { setError } = useGlobalErrorStore()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isVisibilityOpen, setIsVisibilityOpen] = useState(false)

    const form = useForm({
        resolver: zodResolver(postSchema),
        mode: 'onChange',
        defaultValues: {
            content: '',
            visibility: 'public',
            images: [],
        },
    })

    const { mutateAsync: createPost } = useCreatePost({
        onSuccess: () => {
            form.reset()
            setIsVisibilityOpen(false)
        },
    })

    const onSubmit = (data: PostSchemaType) => {
        toast.promise(createPost(data), {
            loading: t('creating_post'),
            success: t('post_created'),
            error: (error) => {
                setError(error.message)
                return t('post_create_error')
            },
        })
    }

    const handleImageClick = () => {
        const currentImages = form.getValues('images') || []

        if (currentImages.length >= MAX_IMAGES) {
            setError(t('errors.max_images', { max: MAX_IMAGES }))
            return
        }

        fileInputRef.current?.click()
    }

    const removeImage = (indexToRemove: number) => {
        const currentImages = form.getValues('images') || []
        const updatedImages = currentImages.filter(
            (_, index) => index !== indexToRemove
        )
        form.setValue('images', updatedImages)
    }

    const selectedImages = form.watch('images') || []

    return (
        <div className="flex gap-2">
            <Avatar>
                <AvatarImage src={user?.image} className="w-10 rounded-full" />
                <AvatarFallback>{user?.username?.[0] || 'Hi'}</AvatarFallback>
            </Avatar>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col flex-1"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder={t('post_placeholder')}
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between mt-2">
                        <div className="flex items-center">
                            <FormField
                                control={form.control}
                                name="images"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    const files = Array.from(
                                                        e.target.files ?? []
                                                    )
                                                    if (e.target) {
                                                        e.target.value = ''
                                                    }
                                                    const currentImages =
                                                        field.value || []

                                                    const allSlots =
                                                        files.length +
                                                        currentImages.length

                                                    if (allSlots > MAX_IMAGES) {
                                                        setError(
                                                            t(
                                                                'errors.max_images',
                                                                {
                                                                    max: MAX_IMAGES,
                                                                }
                                                            )
                                                        )
                                                        return
                                                    }

                                                    field.onChange([
                                                        ...currentImages,
                                                        ...files,
                                                    ])
                                                }}
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <ImagePlus
                                className="text-primary cursor-pointer hover:text-primary/80 transition-colors"
                                size={20}
                                onClick={handleImageClick}
                            />
                        </div>
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <Popover
                                            open={isVisibilityOpen}
                                            onOpenChange={setIsVisibilityOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className="justify-start"
                                                    >
                                                        {
                                                            VISIBILITY_OPTIONS[
                                                                field.value ??
                                                                    'public'
                                                            ]?.icon
                                                        }
                                                        {t(
                                                            `action.${field.value}`
                                                        )}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <div className="space-y-1">
                                                    {Object.entries(
                                                        VISIBILITY_OPTIONS
                                                    ).map(([key, option]) => (
                                                        <div
                                                            key={key}
                                                            className={cn(
                                                                `m-1 text-xs flex items-center gap-1 p-2 cursor-pointer hover:bg-accent rounded-lg transition-colors ${
                                                                    field.value ===
                                                                    key
                                                                        ? 'bg-accent'
                                                                        : ''
                                                                }`,
                                                                {
                                                                    'opacity-50 cursor-not-allowed':
                                                                        !option.active,
                                                                }
                                                            )}
                                                            onClick={() => {
                                                                if (
                                                                    !option.active
                                                                )
                                                                    return

                                                                field.onChange(
                                                                    key
                                                                )
                                                                setIsVisibilityOpen(
                                                                    false
                                                                )
                                                            }}
                                                        >
                                                            {option.icon}
                                                            {t(`action.${key}`)}
                                                            {field.value ===
                                                                key && (
                                                                <Check className="h-4 w-4 text-primary" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">{t('post_button')}</Button>
                        </div>
                    </div>

                    {selectedImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 my-2">
                            {selectedImages.map((file: File, index: number) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover w-20! h-20! border-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1 cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </form>
            </Form>
        </div>
    )
}

export default CreatePostComponent
