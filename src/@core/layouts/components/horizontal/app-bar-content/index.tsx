// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'
import { useSelector } from 'react-redux'
import Clock from 'src/@core/components/clock'
import IconifyIcon from 'src/@core/components/icon'

interface Props {
  hidden: LayoutProps['hidden']
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
  appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding']
}

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const AppBarContent = (props: Props) => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props
  const { companyInfo } = useSelector((state: any) => state.user)

  // ** Hooks
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <StyledLink href='/'>
          <img src={companyInfo?.logo} height={35} />
          <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
            {companyInfo.training_center_name}
          </Typography>
        </StyledLink>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Clock />
        <Typography variant='body2'>|</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <IconifyIcon style={{ fontSize: '18px', color: '#40c0e7' }} icon={'la:user-clock'} />
          <Typography variant='body2'>{`Ish vaqti`} {companyInfo?.work_start_time} - {companyInfo?.work_end_time}</Typography>
        </Box>
      </Box>
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
