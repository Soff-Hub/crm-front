import { useContext } from 'react'
// import Calendar from './Calendar'
// import DashboardStats from './DashboardStats'
// import DashboardNumbers from './DashboardNumbers'
import { AuthContext } from 'src/context/AuthContext'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import dynamic from 'next/dynamic'

// Dynamic imports
const Calendar = dynamic(() => import('./Calendar'), { ssr: false })
const DashboardStats = dynamic(() => import('./DashboardStats'), { ssr: false })
const DashboardNumbers = dynamic(() => import('./DashboardNumbers'), { ssr: false })

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
