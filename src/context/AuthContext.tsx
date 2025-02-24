import { createContext, useEffect, useState, ReactNode } from 'react'

import { useRouter } from 'next/router'

import Cookie from 'js-cookie'
import axios from 'axios'

import authConfig from 'src/configs/auth'

import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'
import api from 'src/@core/utils/api'
import { setCompanyInfo, setRoles } from 'src/store/apps/user'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'

const defaultProvider: AuthValuesType = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  initAuth: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const { i18n } = useTranslation()
  const router = useRouter()
  const { pathname, query, asPath } = router

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
          if (response?.data) {
            dispatch(
              setRoles(response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()))
            )
          }
          setUser({
            phone: response.data.phone,
            last_login: response.data?.last_login,
            gpa: response.data.gpa,
            id: response.data.id,
            fullName: response.data.first_name,
            username: response.data.phone,
            password: 'null',
            currentRole: response.data.roles[0],
            avatar: response.data.image,
            payment_page: response.data.payment_page,
            role: response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()),
            balance: response.data?.balance || 0,
            branches: response.data.branches.filter((item: any) => item.exists === true),
            active_branch: response.data.active_branch,
            qr_code: response.data.qr_code
          })
        })
        .catch(() => {
          localStorage.clear()
          setUser(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.push('/login')
          }
        })

      if (
        !window.location.hostname.split('.').includes('c-panel') &&
        !window.location.hostname.split('.').includes('localhost')
      ) {
        const resp = await api.get('common/settings/list/')
        dispatch(setCompanyInfo(resp.data[0]))
      }
    } else {
      setLoading(false)
      window.localStorage.removeItem('accessToken')
      window.localStorage.removeItem('userData')
    }
  }

  useEffect(() => {
    initAuth()
  }, [])

  useEffect(() => {
    router.push({ pathname, query }, asPath)
  }, [i18n.language])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    api
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        if (!params.rememberMe) {
          Cookie.set('token', response.data.tokens.access)
          Cookie.set('roles', JSON.stringify(response.data.roles))
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.tokens.access)
          window.localStorage.setItem('userData', JSON.stringify({ ...response.data, role: 'admin', tokens: null }))
        }

        const settings: any = window.localStorage.getItem('settings')
        i18n.changeLanguage(JSON.parse(settings)?.locale || 'uz')

        const userRoles = response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase())

        const isMarketolog = userRoles.includes('marketolog')

        if (!response.data.payment_page) {
          if (
            !window.location.hostname.split('.').includes('c-panel') &&
            !window.location.hostname.split('.').includes('localhost')
          ) {
            const resp = await api.get('common/settings/list/')
            dispatch(setCompanyInfo(resp.data[0]))
          }

          const returnUrl = router.query.returnUrl

          const redirectURL = isMarketolog
            ? '/lids'
            : returnUrl && returnUrl !== '/'
            ? returnUrl
            : '/'
          router.replace(redirectURL as string)
        } else {
          router.replace('/crm-payments')
        }

        dispatch(setRoles(userRoles))
        setUser({
          last_login: response.data?.last_login,
          phone: response.data.phone,
          gpa: response.data.gpa,
          id: response.data.id,
          fullName: response.data.first_name,
          username: response.data.phone,
          password: 'null',
          avatar: response.data.image,
          payment_page: response.data.payment_page,
          role: userRoles,
          balance: response.data?.balance || 0,
          branches: response.data.branches.filter((item: any) => item.exists === true),
          active_branch: response.data.active_branch
        })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.clear()
    sessionStorage.clear()
    Object.keys(Cookie.get()).forEach(cookie => Cookie.remove(cookie))
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
