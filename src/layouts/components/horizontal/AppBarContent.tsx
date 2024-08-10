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
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import IconifyIcon from 'src/@core/components/icon'
import { Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setGlobalPay } from 'src/store/apps/students'
import GlobalPaymentModal from 'src/views/apps/students/GlobalPaymentModal'
import VideoModal from 'src/@core/components/video-header'
import { useTranslation } from 'react-i18next'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'


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
  const { notifications } = useAppSelector(state => state.user)
  const { t } = useTranslation()

  function clickGlobalPay() {
    dispatch(setGlobalPay(true))
  }


  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {(user?.role.includes('admin') || user?.role.includes('ceo')) && !window.location.hostname.split('.').includes('c-panel') && <Button
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

      <ModeToggler settings={settings} saveSettings={saveSettings} />
      <NotificationDropdown settings={settings} notifications={notifications} />
      <UserDropdown settings={settings} />
      <GlobalPaymentModal />
    </Box >
  )
}

export default AppBarContent
