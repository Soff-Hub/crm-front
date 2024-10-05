// ** MUI Imports
import Box from '@mui/material/Box'

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
import { useContext, useEffect } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import IconifyIcon from 'src/@core/components/icon'
import { Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setGlobalPay } from 'src/store/apps/students'
import GlobalPaymentModal from 'src/views/apps/students/GlobalPaymentModal'
import VideoModal from 'src/@core/components/video-header'
import { useTranslation } from 'react-i18next'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
// ** Icon Imports

// ** Type Import

// ** Components
// import NotificationDropdown, {
//   NotificationsType
// } from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { setNotifications } from 'src/store/apps/user'


interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props
  const { user } = useContext(AuthContext)
  const dispatch = useAppDispatch()
  const { notifications, notificationsCount } = useAppSelector(state => state.user)
  const { t } = useTranslation()

  function clickGlobalPay() {
    dispatch(setGlobalPay(true))
  }

  const subdomain = location.hostname.split('.')
  const baseURL = subdomain.length < 3
    ? `test`
    : `${subdomain[0]}`


  useEffect(() => {
    const socket = new WebSocket(`wss://${baseURL}.api-soffcrm.uz/ws/notifications/${user?.id}/`)
    socket.onopen = () => {
      console.log('WebSocket connection established')
      socket.send(JSON.stringify({ subscribe: `notifications/${user?.id}/` }))
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      dispatch(setNotifications(data?.notifications.length || 0))
    }
    return () => {
      socket.close()
    }
  }, [user?.id])

  console.log(notificationsCount)


  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {(user?.role.includes('admin') || user?.role.includes('ceo') || user?.role.includes('casher')) && !window.location.hostname.split('.').includes('c-panel') && <Button
        variant='contained'
        size='small'
        sx={{ margin: '0 7px' }}
        onClick={clickGlobalPay}>
        <IconifyIcon fontSize={18} icon={'weui:add-outlined'} />
        <span>{t("To'lov")}</span>
      </Button>}

      {!window.location.hostname.split('.').includes('c-panel') && <BranchDropdown />}

      <VideoModal />

      <LanguageDropdown settings={settings} saveSettings={saveSettings} />

      {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      <NotificationDropdown settings={settings} />
      <UserDropdown settings={settings} />
      <GlobalPaymentModal />
    </Box >
  )
}

export default AppBarContent
