// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
// import NotificationDropdown, {
//   NotificationsType
// } from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import BranchDropdown from 'src/@core/layouts/components/shared-components/BranchDropdown'
import Clock from 'src/@core/components/clock'
import { Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'src/store'
import VideoModal from 'src/@core/components/video-header'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}



const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const { companyInfo, notifications } = useAppSelector((state) => state.user)
  const { isMobile } = useResponsive()
  const { t } = useTranslation()


  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
        <BranchDropdown />
      </Box>

      <VideoModal />

      {!isMobile && <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Clock />
        <Typography variant='body2'>|</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <IconifyIcon style={{ fontSize: '18px', color: '#40c0e7' }} icon={'la:user-clock'} />
          <Typography variant='body2'>{t(`Ish vaqti`)} {companyInfo?.work_start_time} - {companyInfo?.work_end_time}</Typography>
        </Box>
      </Box>}
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <LanguageDropdown settings={settings} saveSettings={saveSettings} />
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown settings={settings} notifications={notifications} />
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
