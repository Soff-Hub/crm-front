import { useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

const Home = () => {
  const router = useRouter()
  const { user } = useAuth()

  useLayoutEffect(() => {
    if (user?.role.includes('student')) {
      router.replace('/student-profile')
    } else if (user?.role.includes('casher') && (!user.role.includes('ceo') || !user.role.includes('admin'))) {
      router.replace('/finance')
    } else {
      router.replace('/dashboard')
    }
  }, [])

  return null
}

export default Home
