import { Box, BoxProps, IconButton, styled, Typography, TypographyProps } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import IconifyIcon from 'src/@core/components/icon'
import { NotificationsType } from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchNotification } from 'src/store/apps/user'

const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '1.2rem',
  textOverflow: 'initial',
  marginBottom: theme.spacing(0.75),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem'
  }
}))

const MenuItemSubtitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  flex: '1 1 100%',
  overflow: 'hidden',
  textOverflow: 'initial',
  fontSize: '1rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem'
  }
}))

const NotificationContainer = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%'
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 'fit-content',
    minWidth: '500px'
  }
}))

export default function Notifications() {
  const { t } = useTranslation()
  const { back } = useRouter()
  const dispatch = useAppDispatch()
  const { notifications } = useAppSelector(state => state.user)

  useEffect(() => {
    ;(async function () {
      if (!window.location.hostname.split('.').includes('c-panel')) {
        await dispatch(fetchNotification())
      }
    })()
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton onClick={back} color='primary'>
            <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} />
          </IconButton>
          <Typography variant='h5'>{t('Xabarnomalar')}</Typography>
        </Box>
      </Box>
      {notifications.length ? (
        <NotificationContainer sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications?.map((element: NotificationsType) => (
            <Box sx={{ bgcolor: '#F8EFE0', p: 3, borderRadius: '10px' }}>
              <Box sx={{ flex: '1 1', display: 'flex', fontSize: '12px', overflow: 'hidden', flexDirection: 'column' }}>
                <MenuItemTitle>{element.notification_data.title}</MenuItemTitle>
                <MenuItemSubtitle variant='body2'>{element.notification_data.body}</MenuItemSubtitle>
              </Box>
              <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                {element.date}
              </Typography>
            </Box>
          ))}
        </NotificationContainer>
      ) : (
        <EmptyContent />
      )}
    </Box>
  )
}
