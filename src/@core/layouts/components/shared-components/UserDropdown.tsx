// ** React Imports
import { useState, SyntheticEvent, Fragment, useContext } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { AuthContext } from 'src/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import UserIcon from 'src/layouts/components/UserIcon'
import StudentEditProfileModal from 'src/pages/student-profile/studentEditModal'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props
  const { t } = useTranslation()
  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [isModalOpen,setIsModalOpen] = useState(false)
  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()

  // ** Context
  const { user } = useContext(AuthContext)

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    m: 0,
    borderRadius: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // color: 'text.primary',
    // textDecoration: 'none',
    '& svg': {
      mr: 2
      // fontSize: '1.375rem',
      // color: 'text.primary'
    }
  }
  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar alt={user?.fullName} onClick={handleDropdownOpen} sx={{ width: 40, height: 40 }} src={user?.avatar} />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap='circular'
                badgeContent={<BadgeContentSpan />}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
              >
                <Avatar alt={user?.fullName} src={user?.avatar} sx={{ width: '2.5rem', height: '2.5rem' }} />
              </Badge>
              <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography sx={{ fontWeight: 600 }}>{user?.fullName}</Typography>
                <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                  {user?.role.join(', ')}
                </Typography>
              </Box>
            </Box>
            <button className='border-0 bg-transparent cursor-pointer'>
              <UserIcon onClick={()=>setIsModalOpen(true)} icon='lucide:edit' />
            </button>
          </Box>
        </Box>
        <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'black', paddingLeft: '20px' }}>
          {user?.username}
        </Typography>
        <Divider sx={{ mb: '0 !important', mt: '1 !important' }} />
        {user?.role.includes('ceo') && !window.location.hostname.split('.').includes('c-panel') && (
          <>
            <Button color='success' sx={styles} onClick={() => router.push('/crm-payments')}>
              <Icon icon='material-symbols-light:payments-sharp' />
              {t('CRM sozlamalari')}
            </Button>
          </>
        )}
        {(user?.role.includes('admin') || user?.role.includes('ceo')) &&
          !window.location.hostname.split('.').includes('c-panel') && (
            <>
              <Button color='secondary' sx={styles} onClick={() => router.push('/video-tutorials')}>
                <Icon icon='ph:video-bold' />
                {t("Video qo'llanmalar")}
              </Button>
            </>
          )}
        <Divider sx={{ m: '0 !important' }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          {t('Logout')}
        </MenuItem>
      </Menu>
      <StudentEditProfileModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Fragment>
  )
}

export default UserDropdown
