// ** MUI Imports
import Fab from '@mui/material/Fab'
import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import MuiToolbar, { ToolbarProps } from '@mui/material/Toolbar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import Customizer from 'src/@core/components/customizer'
import Footer from './components/shared-components/footer'
import Navigation from './components/horizontal/navigation'
import ScrollToTop from 'src/@core/components/scroll-to-top'
import AppBarContent from './components/horizontal/app-bar-content'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useAuth } from 'src/hooks/useAuth'
import DraggableIcon from '../components/soffBotIcon'
import StaticsModal from '../components/statics-modal'

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
const FixedIcon = styled('img')(
  ({ top, left, bottom, right }: { top?: string; left?: string; bottom?: string; right?: string }) => ({
    position: 'fixed',
    top: top || 'unset',
    left: left || 'unset',
    bottom: bottom || 'unset',
    right: right || 'unset',
    zIndex: 1000,
    cursor: 'pointer'
  })
)

const HorizontalLayout = (props: LayoutProps) => {
  // ** Props
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

  // ** Vars
  const { skin, appBar, navHidden, appBarBlur, contentWidth } = settings
  const appBarProps = horizontalLayoutProps?.appBar?.componentProps
  const userNavMenuContent = horizontalLayoutProps?.navMenu?.content
  const auth = useAuth()

  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  return (
    <HorizontalLayoutWrapper className='layout-wrapper'>
      <MainContentWrapper className='layout-content-wrapper' sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}>
        {/* Navbar (or AppBar) and Navigation Menu Wrapper */}
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
            {/* Navbar / AppBar */}
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

            {/* Navigation Menu */}
            {navHidden ? null : (
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
                    justifyContent: 'space-between', // Ensures spacing between items
                    alignItems: 'center', // Centers items vertically
                    ...(contentWidth === 'boxed' && {
                      '@media (min-width:1440px)': { maxWidth: 1440 }
                    }),
                    minHeight: theme =>
                      `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`,
                    px: 2, // Add horizontal padding for better spacing
                    '@media (max-width: 1440px)': {
                      px: 1 // Adjust padding for MacBook widths
                    },
                    '@media (max-width: 768px)': {
                      flexDirection: 'column', // Stack items vertically for smaller screens
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
                          gap: 2, // Adds spacing between nav items
                          '@media (max-width: 768px)': {
                            flexDirection: 'column', // Stack navigation items vertically
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
                      <StaticsModal />
                    </>
                  )}
                </Toolbar>
              </Box>
            )}
          </AppBar>
        )}
        {/* Content */}
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
        {/* Footer */}
        <Footer {...props} footerStyles={footerProps?.sx} footerContent={footerProps?.content} />
        {/* Customizer */}
        {/* <img
          src='/images/avatars/happybot.webp'
          width='50'
          height='50'
          alt='Happy Bot'
        />{' '} */}
        {themeConfig.disableCustomizer || hidden ? null : (
          <>
            <DraggableIcon
            />
            <Customizer />
          </>
        )}
        {/* Scroll to top button */}
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
