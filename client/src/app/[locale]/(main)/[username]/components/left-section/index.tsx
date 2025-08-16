'use client'
import AvatarRole from '@/components/avatar-with-role-border'
import type { UserSuccessData } from '@/hooks/api/user/types'
import React from 'react'
import { useTranslations } from 'next-intl'

const LeftSection = ({ user }: { user: UserSuccessData }) => {
    const t = useTranslations('re_use')
    return (
        <div className="relative w-full md:w-[400px] md:px-10 -mt-[94px] md:-mt-[124px]">
            <div className="sticky top-10">
                <AvatarRole
                    image={user?.image}
                    username={user?.username}
                    role={user?.role}
                    classNames="w-20 h-20 md:w-[200px] md:h-[200px]"
                />
                <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-0 mt-5 md:mt-8">
                    <h2 className="text-lg md:text-2xl font-bold">
                        {user?.displayUsername || ''}
                    </h2>
                    <p className="text-foreground/50 text-md mt-0">
                        @{user?.username || ''}
                    </p>
                </div>
                <div className="flex gap-4 text-md mt-4">
                    <p>
                        {user?.followers || 0}{' '}
                        <span className="text-foreground/50">
                            {t('followers')}
                        </span>
                    </p>
                    <p>
                        {user?.following || 0}{' '}
                        <span className="text-foreground/50">
                            {t('following')}
                        </span>
                    </p>
                </div>
                <p className="mt-4">{user?.bio || ''}</p>
            </div>
        </div>
    )
}

export default LeftSection
