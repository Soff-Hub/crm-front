// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import LandingMain from 'src/views/landing/LandingMain'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string[]) => {
  return '/dashboard'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  if (auth.user && auth.user.role) {
    const homeRoute = getHomeRoute(auth.user.role)

    // Redirect user to Home URL
    router.replace(homeRoute)
  }

  useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (auth.user) {
    return <Spinner sx={{ height: '100%' }} />
  }

  return <LandingMain />
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home
