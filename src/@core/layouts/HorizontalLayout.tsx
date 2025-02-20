import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import { LayoutProps } from 'src/@core/layouts/types'
import Customizer from 'src/@core/components/customizer'
import Footer from './components/shared-components/footer'
import Navigation from './components/horizontal/navigation'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import AppBarContent from './components/horizontal/app-bar-content'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useAuth } from 'src/hooks/useAuth'
import StaticsModal from '../components/statics-modal'
import QrCodeModal from '../components/qrCode-Modal'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import DraggableIcon from 'src/pages/soffBotIcon'

const HorizontalLayoutWrapper = styled(Box)({
  height: '100%',
  display: 'flex',
  ...(themeConfig.horizontalMenuAnimation && { overflow: 'clip' })
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const Toolbar = styled(MuiToolbar)<ToolbarProps>(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(0, 6)} !important`,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4)
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const HorizontalLayout = (props: LayoutProps) => {
  const {
    hidden,
    children,
    settings,
    scrollToTop,
    footerProps,
    saveSettings,
    contentHeightFixed,
    horizontalLayoutProps
  } = props

  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings
  const appBarProps = horizontalLayoutProps?.appBar?.componentProps
  const userNavMenuContent = horizontalLayoutProps?.navMenu?.content
  const auth = useAuth()
  const { user } = useContext(AuthContext)

  let userAppBarStyle = {}

  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      <MainContentWrapper className='layout-content-wrapper' sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}>
        {!auth?.user?.payment_page && (
          <AppBar
            color='default'
            elevation={skin === 'bordered' ? 0 : 3}
            className='layout-navbar-and-nav-container'
            position={appBar === 'fixed' ? 'sticky' : 'static'}
            sx={{
              alignItems: 'center',
              color: 'text.primary',
              justifyContent: 'center',
              backgroundColor: 'background.paper',
              ...(appBar === 'static' && { zIndex: 13 }),
              ...(skin === 'bordered' && { borderBottom: theme => `1px solid ${theme.palette.divider}` }),
              transition:
                'border-bottom 0.2s ease-in-out, backdrop-filter .25s ease-in-out, box-shadow .25s ease-in-out',
              ...(appBar === 'fixed'
                ? appBarBlur && {
                    backdropFilter: 'blur(8px)',
                    backgroundColor: theme => hexToRGBA(theme.palette.background.paper, 0.9)
                  }
                : {}),
              ...userAppBarStyle
            }}
            {...userAppBarProps}
          >
            <Box
              className='layout-navbar'
              sx={{
                width: '100%',
                ...(navHidden ? {} : { borderBottom: theme => `1px solid ${theme.palette.divider}` })
              }}
            >
              <Toolbar
                className='navbar-content-container'
                sx={{
                  mx: 'auto',
                  ...(contentWidth === 'boxed' && { '@media (min-width:1440px)': { maxWidth: 1440 } }),
                  minHeight: theme => `${(theme.mixins.toolbar.minHeight as number) - 1}px !important`
                }}
              >
                <AppBarContent
                  {...props}
                  hidden={hidden}
                  settings={settings}
                  saveSettings={saveSettings}
                  appBarContent={horizontalLayoutProps?.appBar?.content}
                  appBarBranding={horizontalLayoutProps?.appBar?.branding}
                />
              </Toolbar>
            </Box>

            {!navHidden && (
              <Box
                className='layout-horizontal-nav'
                sx={{
                  width: '100%',
                  ...horizontalLayoutProps?.navMenu?.sx
                }}
              >
                <Toolbar
                  className='horizontal-nav-content-container'
                  sx={{
                    mx: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    ...(contentWidth === 'boxed' && {
                      '@media (min-width:1440px)': { maxWidth: 1440 }
                    }),
                    minHeight: theme =>
                      `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`,
                    px: 2,
                    '@media (max-width: 1440px)': {
                      px: 1
                    },
                    '@media (max-width: 768px)': {
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }
                  }}
                >
                  {(userNavMenuContent && userNavMenuContent(props)) || (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          '@media (max-width: 768px)': {
                            flexDirection: 'column',
                            gap: 1.5
                          }
                        }}
                      >
                        <Navigation
                          {...props}
                          horizontalNavItems={
                            (horizontalLayoutProps as NonNullable<LayoutProps['horizontalLayoutProps']>).navMenu
                              ?.navItems
                          }
                        />
                      </Box>
                      {(user?.role.includes('admin') || user?.role.includes('ceo')) &&
                        !window.location.pathname.includes('/c-panel') && <StaticsModal />}

                      <QrCodeModal />
                    </>
                  )}
                </Toolbar>
              </Box>
            )}
          </AppBar>
        )}

        <ContentWrapper
          className='layout-page-content'
          sx={{
            ...(contentHeightFixed && { display: 'flex', overflow: 'hidden' }),
            ...(contentWidth === 'boxed' && {
              mx: 'auto',
              '@media (min-width:1440px)': { maxWidth: 1440 },
              '@media (min-width:1200px)': { maxWidth: '100%' }
            })
          }}
        >
          {children}
        </ContentWrapper>

        <Footer {...props} footerStyles={footerProps?.sx} footerContent={footerProps?.content} />

        {themeConfig.disableCustomizer || hidden ? null : (
          <>
            {(user?.role.includes('ceo') || user?.role.includes('admin')) &&
              !window.location.pathname.includes('/c-panel') && <DraggableIcon />}

            <Customizer />
          </>
        )}
        {scrollToTop ? (
          scrollToTop(props)
        ) : (
          <ScrollToTop className='mui-fixed'>
            <Fab color='primary' size='small' aria-label='scroll back to top'>
              <Icon icon='mdi:arrow-up' />
            </Fab>
          </ScrollToTop>
        )}
      </MainContentWrapper>
    </HorizontalLayoutWrapper>
  )
}

export default HorizontalLayout
