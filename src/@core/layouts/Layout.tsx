import { useContext, useEffect, useRef, useState } from 'react'
import { LayoutProps } from 'src/@core/layouts/types'
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import api from '../utils/api'
import { useAppDispatch } from 'src/store'
import { toggleBotStatus, setSoffBotText, toggleModal } from 'src/store/apps/page'
import { AuthContext } from 'src/context/AuthContext'

const Layout = (props: LayoutProps) => {
  const { hidden, children, settings, saveSettings } = props
  const dispatch = useAppDispatch()
  let currentDate = new Date().toISOString()
  const { user } = useContext(AuthContext)
  const isCollapsed = useRef(settings.navCollapsed)

  const getYearMonthDay = (timestamp: any) => {
    if (timestamp) {
      const [date] = timestamp.split('T')
      return date
    }
  }

  const formattedCurrentDate = getYearMonthDay(currentDate)
  const formattedLastLogin = getYearMonthDay(user?.last_login)

  useEffect(() => {
    if (formattedCurrentDate !== formattedLastLogin) {
      if (window.location.pathname !== '/c-panel' || !user?.role.includes('student')) {
        dispatch(toggleModal(true))
      }
    }
    api
      .get('auth/analytics/')
      .then(res => {
        dispatch(toggleBotStatus(res.data.robot_mood))
        if (user?.role.join(', ').includes('admin')) {
          dispatch(
            setSoffBotText({
              missed_attendance: res.data.missed_attendance,
              groups: res.data.detail,
              absent_students: res.data.absent_students,
              income: res.data.income,
              new_leads: res.data.new_leads,
              robot_mood: res.data.robot_mood,
              sms_limit: res.data.sms_limit,
              unconnected_leads: res.data.unconnected_leads,
              role: res.data.role,
              summary: res.data?.summary,
              added_students: res.data?.added_students,
              left_students: res.data?.left_students,
              not_using_platform: res.data.not_using_platform
            })
          )
        } else if (user?.role.join(', ').includes('ceo')) {
          dispatch(
            setSoffBotText({
              missed_attendance: res.data.missed_attendance,
              groups: res.data.detail,
              absent_students: res.data.absent_students,
              income: res.data.income,
              new_leads: res.data.new_leads,
              robot_mood: res.data.robot_mood,
              sms_limit: res.data.sms_limit,
              unconnected_leads: res.data.unconnected_leads,
              role: res.data.role,
              summary: res.data?.summary,
              added_students: res.data?.added_students,
              left_students: res.data?.left_students,
              not_using_platform: res.data.not_using_platform
            })
          )
        } else if (user?.role.join(', ') == 'teacher') {
          dispatch(
            setSoffBotText({
              missed_attendance: res.data.missed_attendance,
              groups: res.data.detail,
              role: res.data.role,
              summary: res.data?.summary,
              not_using_platform: res.data.not_using_platform
            })
          )
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  useEffect(() => {
    if (hidden) {
      if (settings.navCollapsed) {
        saveSettings({ ...settings, navCollapsed: false, layout: 'vertical' })
        isCollapsed.current = true
      }
    } else {
      if (isCollapsed.current) {
        saveSettings({ ...settings, navCollapsed: true, layout: settings.lastLayout })
        isCollapsed.current = false
      } else {
        if (settings.lastLayout !== settings.layout) {
          saveSettings({ ...settings, layout: settings.lastLayout })
        }
      }
    }
  }, [hidden])

  if (settings.layout === 'horizontal') {
    return <HorizontalLayout {...props}>{children}</HorizontalLayout>
  }

  return <VerticalLayout {...props}> {children}</VerticalLayout>
}

export default Layout
