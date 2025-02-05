// ** React Import
import { useContext, useEffect, useRef, useState } from 'react'
// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Layout Components
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import api from '../utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { toggleBotStatus, setSoffBotText, toggleModal } from 'src/store/apps/page'
import { AuthContext } from 'src/context/AuthContext'

const Layout = (props: LayoutProps) => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props
  const dispatch = useAppDispatch()
  let currentDate = new Date().toISOString()
  let last_login = localStorage.getItem('last_login')
  let userRole = localStorage.getItem('userRole')
  const {setUser, user } = useContext(AuthContext)
  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed)
  const [loading,setLoading] = useState(false)
  function getYearMonthDay(timestamp: any) {
    if (timestamp) {
      const [date] = timestamp.split('T')
      return date
    }
  }
  const reloadProfile = async () => {
    setLoading(true)
    await api.get('auth/profile/').then(async response => {
      setUser({
        last_login:response.data.last_login,
        phone: response.data?.phone,
        gpa:response.data?.gpa,
        id: response.data.id,
        fullName: response.data.first_name,
        username: response.data.phone,
        password: 'null',
        avatar: response.data.image,
        payment_page: response.data.payment_page,
        role: response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()),
        balance: response.data?.balance || 0,
        branches: response.data.branches.filter((item: any) => item.exists === true),
        active_branch: response.data.active_branch,
        qr_code: response.data.qr_code
      })
    }).catch((err) => {
      console.log(err);
      
      
    })
  }
  
  

  const formattedCurrentDate = getYearMonthDay(currentDate)
  const formattedLastLogin = getYearMonthDay(user?.last_login)

  

  useEffect(() => {
    if (
      (formattedCurrentDate !== formattedLastLogin ) && formattedLastLogin     
    ) {
      if (window.location.pathname !== '/c-panel' || !user?.role.includes('student')) {
        dispatch(toggleModal(true));
      }
    }
    reloadProfile()
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
        console.log(err)
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
    return (
      <>
        <HorizontalLayout {...props}>{children}</HorizontalLayout>
      </>
    )
  }

  return (
    <>
      <VerticalLayout {...props}> {children}</VerticalLayout>
    </>
  )
}

export default Layout
