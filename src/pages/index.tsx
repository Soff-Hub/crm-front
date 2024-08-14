// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

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

  return '/dashboard'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role)
      // Redirect user to Home URL

      if (auth.user.payment_page) router.replace("/crm-payments")
      else router.replace(homeRoute)
    }
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
