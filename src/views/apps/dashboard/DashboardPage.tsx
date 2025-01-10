import { useContext } from 'react'
// import Calendar from './Calendar'
// import DashboardStats from './DashboardStats'
// import DashboardNumbers from './DashboardNumbers'
import { AuthContext } from 'src/context/AuthContext'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import dynamic from 'next/dynamic'
import { Icon } from '@iconify/react'
import { useAppDispatch, useAppSelector } from 'src/store'
import { updateEyeVisible } from 'src/store/apps/dashboard'
import { Box, Button, Typography } from '@mui/material'
import useResponsive from 'src/@core/hooks/useResponsive'

// Dynamic imports
const Calendar = dynamic(() => import('./Calendar'), { ssr: false })
const DashboardStats = dynamic(() => import('./DashboardStats'), { ssr: false })
const DashboardNumbers = dynamic(() => import('./DashboardNumbers'), { ssr: false })

export default function DashboardPage() {
  const { user } = useContext(AuthContext)
  const {isMobile} = useResponsive()
  const { eyeVisible } = useAppSelector(state => state.dashboard)
  const dispatch = useAppDispatch()
  return (
    <>
      <Box display={!isMobile ? 'flex':'block'} alignItems='center' gap={5} justifyContent='flex-end'>
      <Box sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button  fullWidth={isMobile} onClick={() => dispatch(updateEyeVisible(!eyeVisible))} size='small' variant='outlined' sx={{ textTransform: 'unset', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px' }}>
            <Icon
            icon={eyeVisible ? 'mdi:eye-off' : 'mdi:eye'}
            style={{
              paddingLeft: 2,
              fontSize: '23px',
              cursor: 'pointer'
            }}
          />
                {eyeVisible ? 'Raqamlarni yopish' : "Raqamlarni ko'rish"}
            </Button>
        </Box>
        {/* <Button
          variant='outlined'
          onClick={() => dispatch(updateEyeVisible(!eyeVisible))}
          style={{
            minWidth: 'auto'
          }}
          size='small'
          sx={{ marginBottom: '10px' }}
        >
          <Typography fontSize={12} fontWeight={20}>{eyeVisible ? 'Raqamlarni yopish' : "Raqamlarni ko'rish"}</Typography>
          <Icon
            icon={eyeVisible ? 'mdi:eye-off' : 'mdi:eye'}
            style={{
              paddingLeft: 2,
              fontSize: '23px',
              cursor: 'pointer'
            }}
          />
        </Button> */}
        <VideoHeader  item={videoUrls.dashboard} />
      </Box>

      <DashboardStats />
      <Calendar />
      {(user?.role.includes('ceo') || user?.role.includes('watcher')) && <DashboardNumbers />}
    </>
  )
}
