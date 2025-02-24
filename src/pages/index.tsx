'use client'

import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchLessons, fetchStatistics } from 'src/store/apps/dashboard'
import DashboardPage from 'src/views/apps/dashboard/DashboardPage'
import MyGroups from 'src/views/my-groups'

const AppCalendar = () => {
  const { weeks, interval } = useAppSelector(state => state.dashboard)
  const dispatch = useAppDispatch()
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const pageLoad = async () => {
    if (
      !user?.role.includes('admin') &&
      !user?.role.includes('ceo') &&
      !user?.role.includes('teacher') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      router.back()
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    await Promise.all([dispatch(fetchStatistics()), dispatch(fetchLessons({ queryWeeks: weeks, interval: interval }))])
  }

  useEffect(() => {
    pageLoad()
  }, [])

  return user?.currentRole === 'teacher' ? <MyGroups /> : <DashboardPage />
}

export default AppCalendar
