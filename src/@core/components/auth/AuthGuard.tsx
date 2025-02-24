import { ReactNode, ReactElement, useEffect, FC, PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

type Props = {
  fallback: ReactElement | null
}

const AuthGuard: FC<PropsWithChildren<Props>> = ({ children, fallback }) => {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    if (auth.user === null && !window.localStorage.getItem('userData')) {
      if (router.pathname.split('/').includes('forms') && router.pathname.split('/').includes('r')) {
        return
      } else if (router.asPath !== '/') {
        router.replace({
          pathname: '/login'
        })
      } else {
        router.replace('/login')
      }
    }
  }, [router.route])

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
