// ** React Imports
import { ReactNode, useContext, useEffect } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import VerticalNavItems, { CPanelNavigation, StudentNavigation, TeacherNavigation } from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { AuthContext } from 'src/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store'
import { fetchNotification } from 'src/store/apps/user'

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const router = useRouter()

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }


  useEffect(() => {
    if (user) {
      (async function () {
        if (!window.location.hostname.split('.').includes('c-panel')) {
          await dispatch(fetchNotification())
        }
      })()
    }
  }, [])

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={
        {
          navMenu: {
            navItems: router.pathname.split('/')?.[1] === 'c-panel' ?
              CPanelNavigation(t) : user?.role.length === 1 && user?.role.includes('teacher') ?
                TeacherNavigation(t) : user?.role.includes('student') ? StudentNavigation(t) :
                  user?.role.includes('teacher') ?
                    VerticalNavItems(t) : VerticalNavItems(t)
          },
          appBar: {
            content: props => (
              <VerticalAppBarContent
                hidden={hidden}
                settings={settings}
                saveSettings={saveSettings}
                toggleNavVisibility={props.toggleNavVisibility}
              />
            )
          }
        }
      }
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: router.pathname.split('/')?.[1] === 'c-panel' ?
              CPanelNavigation(t) : user?.role.length === 1 && user?.role.includes('teacher') ?
                TeacherNavigation(t) : user?.role.includes('student') ? StudentNavigation(t) : HorizontalNavItems(t)

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
          },
        }
      })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
