import { useEffect, FC, PropsWithChildren, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { Loading } from 'src/shared/ui'

export const PublicGuard: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth()
  const router = useRouter()

  if (router.pathname.split('/').includes('r')) {
    return <Fragment>{children}</Fragment>
  }

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (window.localStorage.getItem('userData')) {
      router.replace('/')
    }
  }, [router.route])

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return <Loading />
  }

  return <Fragment>{children}</Fragment>
}

PublicGuard.displayName = 'PublicGuard'
