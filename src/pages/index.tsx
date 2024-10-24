// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
// import Spinner from 'src/@core/components/spinner'

const Spinner = dynamic(() => import("src/@core/components/spinner"), { ssr: false })
// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import dynamic from 'next/dynamic'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string[]) => {
  if (window.location.hostname.split('.').includes('c-panel')) {
    return '/c-panel'
  }
  if (role.includes('student')) {
    return '/student-profile'
  }
  if (role.includes('casher') && (!role.includes('ceo') || !role.includes('admin'))) {
    return '/finance'
  }

  return '/dashboard'
}

const Home = () => {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role)
      if (auth.user.payment_page) router.replace("/crm-payments")
      else router.replace(homeRoute)
    }
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
