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
import { Button } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import GlobalPaymentModal from 'src/views/apps/students/GlobalPaymentModal'
import { useAppDispatch } from 'src/store'
import { setGlobalPay } from 'src/store/apps/students'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

// const notifications: NotificationsType[] = [
//   {
//     meta: 'Today',
//     avatarAlt: 'Flora',
//     title: 'Congratulation Flora! 🎉',
//     avatarImg: '/images/avatars/4.png',
//     subtitle: 'Won the monthly best seller badge'
//   },
//   {
//     meta: 'Yesterday',
//     avatarColor: 'primary',
//     subtitle: '5 hours ago',
//     avatarText: 'Robert Austin',
//     title: 'New user registered.'
//   },
//   {
//     meta: '11 Aug',
//     avatarAlt: 'message',
//     title: 'New message received 👋🏻',
//     avatarImg: '/images/avatars/5.png',
//     subtitle: 'You have 10 unread messages'
//   },
//   {
//     meta: '25 May',
//     title: 'Paypal',
//     avatarAlt: 'paypal',
//     subtitle: 'Received Payment',
//     avatarImg: '/images/misc/paypal.png'
//   },
//   {
//     meta: '19 Mar',
//     avatarAlt: 'order',
//     title: 'Received Order 📦',
//     avatarImg: '/images/avatars/3.png',
//     subtitle: 'New order received from John'
//   },
//   {
//     meta: '27 Dec',
//     avatarAlt: 'chart',
//     subtitle: '25 hrs ago',
//     avatarImg: '/images/misc/chart.png',
//     title: 'Finance report has been generated'
//   }
// ]

const AppBarContent = (props: Props) => {
  // ** Props
  const { settings, saveSettings } = props
  const dispatch = useAppDispatch()
  const { user } = useContext(AuthContext)

  function clickGlobalPay() {
    dispatch(setGlobalPay(true))
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {(user?.role.includes('admin') || user?.role.includes('ceo')) && <Button onClick={clickGlobalPay} size='small' variant='contained' startIcon={<IconifyIcon icon={'weui:add-outlined'} />}>To'lov</Button>}
      {!window.location.hostname.split('.').includes('c-panel') && <BranchDropdown />}
      <GlobalPaymentModal />
      <LanguageDropdown settings={settings} saveSettings={saveSettings} />
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {/* <NotificationDropdown settings={settings} notifications={notifications} /> */}
      <UserDropdown settings={settings} />
    </Box >
  )
}

export default AppBarContent
