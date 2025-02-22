import { useEffect, FC, PropsWithChildren, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { Loading } from 'src/shared/ui'

export const ProtectedGuard: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    if (auth.user === null && !window.localStorage.getItem('userData')) {
      if (router.pathname.split('/').includes('forms') && router.pathname.split('/').includes('r')) {
        return
      } else if (router.asPath !== '/dashboard') {
        router.replace({
          pathname: '/login'
        })
      } else {
        router.replace('/login')
      }
    }
  }, [router.route])

  if (auth.loading || auth.user === null) {
    return <Loading />
  }

  return <Fragment>{children}</Fragment>
}

ProtectedGuard.displayName = 'ProtectedGuard'
