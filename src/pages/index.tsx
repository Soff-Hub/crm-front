import { useLayoutEffect } from 'react'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const role = JSON.parse(localStorage.getItem('role') || '[]')

  useLayoutEffect(() => {
    if (role.includes('student')) {
      router.replace('/student-profile')
    } else if (role.includes('casher') && (!role.includes('ceo') || !role.includes('admin'))) {
      router.replace('/finance')
    } else {
      router.replace('/dashboard')
    }
  }, [])

  return null
}

export default Home
