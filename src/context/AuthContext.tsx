// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'
import api from 'src/@core/utils/api'
import { setCompanyInfo } from 'src/store/apps/user'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'src/store'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  initAuth: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const { i18n } = useTranslation()
  const router = useRouter()
  const { locales, locale: activeLocale, pathname, query, asPath } = router;

  // ** Hooks
  const dispatch = useAppDispatch()

  const initAuth = async (): Promise<void> => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
    if (storedToken) {

      const settings: any = window.localStorage.getItem('settings')
      i18n.changeLanguage(JSON.parse(settings)?.locale || 'uz')


      setLoading(true)
      await api
        .get(authConfig.meEndpoint, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(async response => {
          setLoading(false)
          setUser({
            id: response.data.id,
            // role: response.data.roles.find((el: any) => el.name === "Teacher").exists && !response.data.roles.find((el: any) => el.name === "Admin").exists && !response.data.roles.find((el: any) => el.name === "CEO").exists ? 'teacher' : 'admin',
            fullName: response.data.first_name,
            username: response.data.phone,
            password: 'null',
            avatar: response.data.image,
            role: response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()),
            balance: response.data?.balance || 0,
            branches: response.data.branches.filter((item: any) => item.exists === true),
            active_branch: response.data.active_branch
          })
        })
        .catch(() => {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        })

      if (!window.location.hostname.split('.').includes('c-panel')) {
        const resp = await api.get('common/settings/list/')
        dispatch(setCompanyInfo(resp.data[0]))
      }
    } else {
      setLoading(false)
      window.localStorage.clear()
    }
  }

  useEffect(() => {

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    router.push({ pathname, query }, asPath)
  }, [i18n.language])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    api
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        !params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.tokens.access)
          : null
        const returnUrl = router.query.returnUrl

        if (!window.location.hostname.split('.').includes('c-panel')) {
          const resp = await api.get('common/settings/list/')
          dispatch(setCompanyInfo(resp.data[0]))
        }


        setUser({
          id: response.data.id,
          // role: response.data.roles.find((el: any) => el.name === "Teacher").exists && !response.data.roles.find((el: any) => el.name === "Admin").exists && !response.data.roles.find((el: any) => el.name === "CEO").exists ? 'teacher' : 'admin',
          fullName: response.data.first_name,
          username: response.data.phone,
          password: 'null',
          avatar: response.data.image,
          role: response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()),
          balance: response.data?.balance || 0,
          branches: response.data.branches.filter((item: any) => item.exists === true),
          active_branch: response.data.active_branch
        })

        !params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify({ ...response.data, role: 'admin', tokens: null })) : null

        const settings: any = window.localStorage.getItem('settings')
        i18n.changeLanguage(JSON.parse(settings)?.locale || 'uz')

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ phone: params.phone, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    initAuth
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
