import { useEffect } from 'react'
import { useRouter } from 'next/router'
const Spinner = dynamic(() => import('src/@core/components/spinner'), { ssr: false })
import { useAuth } from 'src/hooks/useAuth'
import dynamic from 'next/dynamic'

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
      if (auth.user.payment_page) router.replace('/crm-payments')
      else router.replace(homeRoute)
    }
  }, [])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home
