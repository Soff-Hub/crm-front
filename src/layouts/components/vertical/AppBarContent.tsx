// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stomp from 'stompjs'
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
import { Autocomplete, Button, TextField, Tooltip, Typography } from '@mui/material'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import VideoModal from 'src/@core/components/video-header'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { useContext, useEffect, useState } from 'react'
import { setNotifications } from 'src/store/apps/user'
import { AuthContext } from 'src/context/AuthContext'
import { updateQueryParams } from 'src/store/apps/settings'
import Link from 'next/link'
import api from 'src/@core/utils/api'
import { setGlobalPay } from 'src/store/apps/students'
import GlobalPaymentModal from 'src/views/apps/students/GlobalPaymentModal'
import { toggleQrCodeModal } from 'src/store/apps/page'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const { companyInfo, notifications } = useAppSelector(state => state.user)
  const { user } = useContext(AuthContext)

  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null)

  const [employees, setEmployees] = useState<any>([])

  const renderRoleBasedLink = (role: string, id: string, role_id: string) => {
    dispatch(updateQueryParams({ role: role_id }))
    console.log(role)

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

  function clickGlobalPay() {
    dispatch(setGlobalPay(true))
  }

  useEffect(() => {
    const socket = new WebSocket(`wss://test.api-soffcrm.uz/ws/notifications/${user?.id}/`)
    socket.onopen = () => {
      console.log('WebSocket connection established')
      socket.send(JSON.stringify({ subscribe: `notifications/${user?.id}/` }))
    }
    socket.onmessage = event => {
      const data = JSON.parse(event.data)
      dispatch(setNotifications(data?.notifications?.length || 0))
    }
    return () => {
      socket.close()
    }
  }, [user?.id])

  return (
    <div style={{ width: '100%', display: 'block' }}>
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
        <Box></Box>

        {!isMobile && (
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user?.role.join(', ') !== 'student' && (
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
                  <span
                    style={{
                      border: 'solid 1px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      padding: 3,
                      paddingLeft: 5,
                      paddingRight: 5
                    }}
                    onClick={() => dispatch(toggleQrCodeModal(true))}
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20'>
                      <path d='M3 3H9V9H3V3M5 5V7H7V5H5M3 15H9V21H3V15M5 17V19H7V17H5M15 3H21V9H15V3M17 5V7H19V5H17M16 12H18V14H16V12M18 16H20V18H18V16M11 11H13V13H11V11M10 7H12V9H10V7M8 11H10V13H8V11M14 14H16V16H14V14M12 18H14V20H12V18M12 14H14V16H12V14M20 11H22V13H20V11M19 7H21V9H19V7M16 16H18V18H16V16Z' />
                    </svg>
                  </span>
                </Tooltip>
                <Button variant='contained' size='small' sx={{ margin: '0 7px' }} onClick={clickGlobalPay}>
                  <span>{t("To'lov")}</span>
                </Button>
              </>
            )}
            {/* <Clock />
        <Typography variant='body2'>|</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <IconifyIcon style={{ fontSize: '18px', color: '#40c0e7' }} icon={'la:user-clock'} />
        <Typography variant='body2'>{t(`Ish vaqti`)} {companyInfo?.work_start_time} - {companyInfo?.work_end_time}</Typography>
        </Box> */}
          </Box>
        )}
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageDropdown settings={settings} saveSettings={saveSettings} />
          {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
          <NotificationDropdown settings={settings} />
          <UserDropdown settings={settings} />
        </Box>
      </Box>
      {isMobile && user?.role.join(', ') !== 'student' && (
        <Autocomplete
          sx={{ padding: 5 }}
          disablePortal
          onClose={() => {
            setEmployees([])
          }}
          options={employees || []}
          fullWidth
          size='small'
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
      )}
      <GlobalPaymentModal />
    </div>
  )
}

export default AppBarContent
