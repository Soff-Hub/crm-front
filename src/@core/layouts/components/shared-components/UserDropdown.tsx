// ** React Imports
import { useState, SyntheticEvent, Fragment, useContext, useEffect } from 'react'

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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import UserIcon from 'src/layouts/components/UserIcon'
import StudentEditProfileModal from 'src/pages/student-profile/studentEditModal'
import { GridCloseIcon } from '@mui/x-data-grid'
import { UserDataType } from 'src/context/types'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setRoles } from 'src/store/apps/user'

type Props = {
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
  const [imageSrc, setImageSrc] = useState('')

  const { settings } = props
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()
  const { userRoles } = useAppSelector(state => state.user)
  const { user, setUser } = useContext(AuthContext)
  const [role, setRole] = useState('')

  const { direction } = settings

  const dispatch = useAppDispatch()

  const handleClickOpen = (src: any) => {
    setImageSrc(src)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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
    '& svg': {
      mr: 2
    }
  }

  const downloadImage = (imageUrl: any, filename: any) => {
    const anchor = document.createElement('a')
    anchor.href = imageUrl

    anchor.download = filename

    document.body.appendChild(anchor)

    anchor.click()

    document.body.removeChild(anchor)
  }

  useEffect(() => {
    setUser((prevUser: UserDataType) => ({
      ...prevUser,
      currentRole: localStorage.getItem('currentRole') || role || prevUser.role[0]
    }))
  }, [role])

  const handleLogout = () => {
    logout()
    dispatch(setRoles([]))
    handleDropdownClose()
  }
  const handleRole = (role: string) => {
    setRole(role)
    if (role == 'teacher') {
      router.push('dashboard')
    }
    localStorage.setItem('currentRole', role)
    setAnchorEl(null)
  }

  return (
    <div>
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
                <div>
                  {userRoles?.map((item, index) => (
                    <div key={`${index}-${item}`} onClick={() => handleRole(item)}>
                      <Typography
                        variant='body2'
                        sx={{
                          textDecoration: item === localStorage.getItem('currentRole') ? 'underline' : 'none',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          color: localStorage.getItem('currentRole') === item ? 'text.primary' : 'text.disabled',
                          '&:hover': {
                            color: 'text.primary',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {item}
                      </Typography>
                    </div>
                  ))}
                </div>
              </Box>
            </Box>

            {user?.qr_code && (
              <img
                width={30}
                height={30}
                src={user?.qr_code}
                style={{
                  cursor: 'pointer',
                  marginLeft: 5,
                  transition: 'transform 0.3s, opacity 0.3s'
                }}
                onMouseEnter={(e: any) => {
                  e.target.style.transform = 'scale(1.1)'
                  e.target.style.opacity = '0.8'
                }}
                onMouseLeave={(e: any) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.opacity = '1'
                }}
                onClick={() => handleClickOpen(user?.qr_code)} // Open modal on image click
              />
            )}

            <button className='border-0 bg-transparent cursor-pointer'>
              <UserIcon onClick={() => setIsModalOpen(true)} icon='lucide:edit' />
            </button>
          </Box>
        </Box>
        <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'black', paddingLeft: '20px' }}>
          {user?.username}
        </Typography>

        <Divider sx={{ mb: '0 !important', mt: '1 !important' }} />
        {user?.role.includes('ceo') && !window.location.hostname.split('.').includes('c-panel') && (
          <Button color='success' sx={styles} onClick={() => router.push('/crm-payments')}>
            <Icon icon='material-symbols-light:payments-sharp' />
            {t('CRM sozlamalari')}
          </Button>
        )}

        {(user?.role.includes('admin') || user?.role.includes('ceo')) &&
          !window.location.hostname.split('.').includes('c-panel') && (
            <Button color='secondary' sx={styles} onClick={() => router.push('/video-tutorials')}>
              <Icon icon='ph:video-bold' />
              {t("Video qo'llanmalar")}
            </Button>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <IconButton
            edge='end'
            color='inherit'
            onClick={handleClose}
            aria-label='close'
            sx={{
              position: 'absolute',
              right: 20,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <GridCloseIcon />
          </IconButton>
          <div>QR Code</div>
        </DialogTitle>

        <DialogContent>
          <img
            src={imageSrc}
            alt='QR Code'
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '500px',
              margin: '0 auto'
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => downloadImage(imageSrc, 'qr_code')} fullWidth color='primary' variant='contained'>
            Yuklab olish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default UserDropdown
