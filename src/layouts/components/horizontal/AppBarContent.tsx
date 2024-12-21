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
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import IconifyIcon from 'src/@core/components/icon'
import { Autocomplete, Button, Input, TextField, Tooltip } from '@mui/material'
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
import api from 'src/@core/utils/api'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { updateQueryParams } from 'src/store/apps/settings'
import { toggleQrCodeModal } from 'src/store/apps/page'

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
  const [employees, setEmployees] = useState<any>([])
  const { t } = useTranslation()
  function clickGlobalPay() {
    dispatch(setGlobalPay(true))
  }

  const renderRoleBasedLink = (role: string, id: string, role_id: string) => {
    dispatch(updateQueryParams({ role: role_id }))

    switch (role) {
      case 'STUDENT':
        return `/students/view/security?student=${id}`
      case 'TEACHER':
        return `/mentors/view/security?id=${id}`
      case 'ADMIN':
        return `/settings/ceo/users`
      case 'CEO':
        return `/settings/ceo/users`
      default:
        return `/settings/ceo/users`
    }
  }

  async function handleSearch(search: string) {
    await api.get(`auth/employees-check-list/?search=${search}`).then(res => {
      setEmployees(res.data)
    })
  }

  const subdomain = location.hostname.split('.')
  const baseURL = subdomain.length < 3 ? `test` : `${subdomain[0]}`

  useEffect(() => {
    const socket = new WebSocket(`wss://${baseURL}.api-soffcrm.uz/ws/notifications/${user?.id}/`)
    socket.onopen = () => {
      console.log('WebSocket connection established')
      socket.send(JSON.stringify({ subscribe: `notifications/${user?.id}/` }))
    }
    socket.onmessage = event => {
      const data = JSON.parse(event.data)
      dispatch(setNotifications(data?.notifications.length || 0))
    }
    return () => {
      socket.close()
    }
  }, [user?.id])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
      {(user?.role.includes('admin') ||
        user?.role.includes('ceo') ||
        user?.role.includes('casher') ||
        user?.role.includes('watcher')) &&
        !window.location.hostname.split('.').includes('c-panel') && (
          <>
            <Autocomplete
              sx={{ paddingX: 10 }}
              disablePortal
              onClose={() => {
                setEmployees([])
              }}
              options={employees || []}
              fullWidth
              size='small'
              noOptionsText="Ma'lumot yo'q.."
              getOptionLabel={(option: any) => option.first_name}
              renderOption={(props, option: any) => (
                <li {...props} key={option.id}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    href={renderRoleBasedLink(option.role, option.id, option.role_id)}
                  >
                    <Icon
                      icon={
                        option.role === 'STUDENT'
                          ? 'mdi:account-student'
                          : option.role === 'TEACHER'
                          ? 'mdi:account-tie'
                          : option.role === 'ADMIN'
                          ? 'mdi:shield-account'
                          : option.role === 'CEO'
                          ? 'mdi:crown'
                          : 'mdi:account'
                      }
                      style={{ marginRight: 8, fontSize: 20 }}
                    />
                    <span style={{ color: '#333' }}>{option.first_name}</span>
                    <span style={{ color: '#777', fontSize: 12 }}> : {option.phone}</span>
                  </Link>
                </li>
              )}
              renderInput={params => (
                <TextField {...params} placeholder='Qidirish...' onChange={e => handleSearch(e.target.value)} />
              )}
            />
            <Tooltip title='Davomat' arrow>
              <span style={{border:'solid 1px',borderRadius:8, cursor: 'pointer' ,padding:3,paddingLeft:4,paddingRight:4}} onClick={() => dispatch(toggleQrCodeModal(true))}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20'>
                  <path d='M3 3H9V9H3V3M5 5V7H7V5H5M3 15H9V21H3V15M5 17V19H7V17H5M15 3H21V9H15V3M17 5V7H19V5H17M16 12H18V14H16V12M18 16H20V18H18V16M11 11H13V13H11V11M10 7H12V9H10V7M8 11H10V13H8V11M14 14H16V16H14V14M12 18H14V20H12V18M12 14H14V16H12V14M20 11H22V13H20V11M19 7H21V9H19V7M16 16H18V18H16V16Z' />
                </svg>
              </span>
            </Tooltip>

            <Button variant='contained' size='small' sx={{ margin: '0 7px' }} onClick={clickGlobalPay}>
              <IconifyIcon fontSize={18} icon={'weui:add-outlined'} />
              <span>{t("To'lov")}</span>
            </Button>
          </>
        )}

      {!window.location.hostname.split('.').includes('c-panel') && <BranchDropdown />}

      <VideoModal />

      <LanguageDropdown settings={settings} saveSettings={saveSettings} />

      {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      <NotificationDropdown settings={settings} />
      <UserDropdown settings={settings} />
      <GlobalPaymentModal />
    </Box>
  )
}

export default AppBarContent
