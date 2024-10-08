// ** React Imports
import { ReactNode } from 'react';

// ** Next Imports
import Head from 'next/head';
import { Router } from 'next/router';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

// ** Store Imports
import { store, useAppSelector } from 'src/store';
import { Provider } from 'react-redux';

// ** Loader Import
import NProgress from 'nprogress';

// ** Emotion Imports
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';

// ** Config Imports
import 'src/configs/i18n';
import { defaultACLObj } from 'src/configs/acl';
import themeConfig from 'src/configs/themeConfig';

// ** Third Party Import
import { Toaster } from 'react-hot-toast';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout';
import AclGuard from 'src/@core/components/auth/AclGuard';
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import AuthGuard from 'src/@core/components/auth/AuthGuard';
import GuestGuard from 'src/@core/components/auth/GuestGuard';
import WindowWrapper from 'src/@core/components/window-wrapper';

// ** Spinner Import
import Spinner from 'src/@core/components/spinner';

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext';
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast';

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

// ** Prismjs Styles
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';

import 'src/iconify-bundle/icons-bundle-react';

// ** Global css styles
import '../../styles/globals.css';
import DisabledProvider from 'src/@core/layouts/DisabledProvider';

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', NProgress.start)
  Router.events.on('routeChangeError', NProgress.done)
  Router.events.on('routeChangeComplete', NProgress.done)
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  if (authGuard) return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  return <>{children}</>
}

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: ExtendedAppProps) => {

  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout = Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  function MyHead() {

    const { companyInfo } = useAppSelector(state => state.user)

    return <Head>
      <meta name="robots" content="noindex, nofollow" />
      <title>{`${companyInfo.training_center_name} - Taʼlim tizimini nazorat qilish platformasi`}</title>
      <link rel='shortcut icon' href={companyInfo.logo} />
    </Head>
  }

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <MyHead />
        <AuthProvider>
          <DisabledProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <WindowWrapper>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                      </WindowWrapper>
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </DisabledProvider>
        </AuthProvider>
      </CacheProvider>
    </Provider>
  )
}

export default App
