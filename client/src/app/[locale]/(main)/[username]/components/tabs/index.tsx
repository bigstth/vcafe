import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import React from 'react'
import UserPosts from './posts'

const UserTabs = ({ userId }: { userId: string }) => {
    const t = useTranslations()
    return (
        <Tabs defaultValue="posts" className="w-full">
            <TabsList>
                <TabsTrigger value="posts">{t('re_use.posts')}</TabsTrigger>
                <TabsTrigger value="portfolio">
                    {t('features.profile.portfolio')}
                </TabsTrigger>
                <TabsTrigger value="services">
                    {t('features.profile.services')}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
                <UserPosts userId={userId} />
            </TabsContent>
        </Tabs>
    )
}

export default UserTabs
