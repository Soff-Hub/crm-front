import { FC, PropsWithChildren, ReactNode, useContext } from 'react'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Layout from 'src/@core/layouts/Layout'
import VerticalNavItems, { CPanelNavigation, StudentNavigation, TeacherNavigation } from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'
import { useSettings } from 'src/@core/hooks/useSettings'
import { AuthContext } from 'src/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

type Props = {
  contentHeightFixed?: boolean
}

const UserLayout: FC<PropsWithChildren<Props>> = ({ children, contentHeightFixed }) => {
  const { settings, saveSettings } = useSettings()
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const router = useRouter()

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems:
            router.pathname.split('/')?.[1] === 'c-panel'
              ? CPanelNavigation(t)
              : user?.role.length === 1 && user?.role.includes('teacher')
              ? TeacherNavigation(t)
              : user?.role.includes('student')
              ? StudentNavigation(t)
              : user?.role.includes('teacher')
              ? VerticalNavItems(t)
              : VerticalNavItems(t)
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
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems:
              router.pathname.split('/')?.[1] === 'c-panel'
                ? CPanelNavigation(t)
                : user?.currentRole === 'teacher'
                ? TeacherNavigation(t)
                : user?.role.includes('student')
                ? StudentNavigation(t)
                : HorizontalNavItems(t)
          },
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
