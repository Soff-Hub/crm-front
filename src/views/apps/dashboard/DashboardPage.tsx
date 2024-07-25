import React, { useContext } from 'react'
import Calendar from './Calendar'
import DashboardStats from './DashboardStats'
import DashboardNumbers from './DashboardNumbers'
import { AuthContext } from 'src/context/AuthContext'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'

export default function DashboardPage() {
    const { user } = useContext(AuthContext)
    return (
        <>
            <VideoHeader item={videoUrls.dashboard} />
            <DashboardStats />
            <Calendar />
            {user?.role.includes('ceo') && <DashboardNumbers />}
        </>
    )
}
