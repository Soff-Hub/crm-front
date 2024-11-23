// ** React Import
import { useContext, useEffect, useRef } from 'react'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Layout Components
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import api from '../utils/api'
import { useAppDispatch } from 'src/store'
import { toggleBotStatus, setSoffBotText, toggleModal } from 'src/store/apps/page'
import useRoles from 'src/hooks/useRoles'

const Layout = (props: LayoutProps) => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props
  const dispatch = useAppDispatch()
  let currentDate = new Date().toISOString()
  let last_login = localStorage.getItem('last_login')
  const { roles } = useRoles()
  const is_ceo = roles.find((item: any) => item.name === 'CEO' && item.is_active)
  const is_teacher = roles.find((item: any) => item.name === 'TEACHER' && item.is_active)

  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed)

  // console.log(currentDate,last_login);

  function getYearMonthDay(timestamp: any) {
    if (timestamp) {
      const [date] = timestamp.split('T')
      return date
    }
  }

  const formattedCurrentDate = getYearMonthDay(currentDate)
  const formattedLastLogin = getYearMonthDay(last_login)

  useEffect(() => {
    if (formattedCurrentDate != formattedLastLogin) {
      dispatch(toggleModal(true))
    }

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
    api
      .get('auth/analytics/')
      .then(res => {
        dispatch(toggleBotStatus(res.data.robot_mood))
        if (res.data.role == 'ceo') {
          dispatch(
            setSoffBotText({
              absent_students: res.data.absent_students,
              attending_the_class: res.data.attending_the_class,
              income: res.data.income,
              new_leads: res.data.new_leads,
              robot_mood: res.data.robot_mood,
              sms_limit: res.data.sms_limit,
              unconnected_leads: res.data.unconnected_leads,
              role: res.data.role,
              summary: res.data?.summary
            })
          )
        } else if (res.data.role == 'teacher') {
          dispatch(
            setSoffBotText({
              missed_attendance: res.data.missed_attendance,
              groups: res.data.detail,
              role: res.data.role,
              summary: res.data?.summary
            })
          )
        }
      })
      .catch(err => {
        console.log(err)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden])

  if (settings.layout === 'horizontal') {
    return <HorizontalLayout {...props}>{children}</HorizontalLayout>
  }

  return <VerticalLayout {...props}>{children}</VerticalLayout>
}

export default Layout
