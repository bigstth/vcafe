import React from 'react'
import { notFound } from 'next/navigation'
import CoverImage from './components/cover-image'
import LeftSection from './components/left-section'
import { fetchUserByUsername } from '@/services/user.service'

interface ProfilePageProps {
    params: Promise<{ username: string; locale: string }>
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
    const { username } = await params

    const userData = await fetchUserByUsername(username)

    if (!userData) return notFound()

    return (
        <div>
            <CoverImage />
            <div className="px-5 flex flex-col md:flex-row min-h-[5000px] w-full gap-x-8 gap-y-4">
                <LeftSection user={userData} />
                Test
            </div>
        </div>
    )
}

export default ProfilePage
