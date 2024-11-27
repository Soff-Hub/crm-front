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
import { AuthContext } from 'src/context/AuthContext'
import DraggableIcon from 'src/@core/components/soffBotIcon'

const Layout = (props: LayoutProps) => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props
  const dispatch = useAppDispatch()
  let currentDate = new Date().toISOString()
  let last_login = localStorage.getItem('last_login')
  let userRole = localStorage.getItem('userRole')
  const { user } = useContext(AuthContext)
  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed)

  function getYearMonthDay(timestamp: any) {
    if (timestamp) {
      const [date] = timestamp.split('T')
      return date
    }
  }

  const formattedCurrentDate = getYearMonthDay(currentDate)
  const formattedLastLogin = getYearMonthDay(last_login)

  useEffect(() => {
    if (formattedCurrentDate != formattedLastLogin || userRole != user?.role.join(', ')) {
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
        if (user?.role.join(', ').includes('admin')) {
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
              summary: res.data?.summary,
              added_students: res.data?.added_students,
              left_students: res.data?.left_students,
              not_using_platform: res.data.not_using_platform 
            })
          )
        } else if (user?.role.join(', ').includes('ceo')) {
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
        console.log(err)
      })
  }, [hidden])

  if (settings.layout === 'horizontal') {
    return (
      <>
        {/* <DraggableIcon /> */}
        <HorizontalLayout {...props}>{children}</HorizontalLayout>
      </>
    )
  }

  return (
    <>
      {/* <DraggableIcon /> */}
      <VerticalLayout {...props}> {children}</VerticalLayout>
    </>
  )
}

export default Layout
