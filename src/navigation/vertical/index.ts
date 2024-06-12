// ** Type import
import { useContext } from 'react'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { AuthContext } from 'src/context/AuthContext'

export const TeacherNavigation = (t: any): any => {

  return [
    {
      title: t("Guruhlar"),
      icon: 'mdi:home-outline',
      path: '/dashboard',
    },
    {
      title: t("Profil"),
      icon: 'mdi:receipt-text-edit-outline',
      path: '/lids'
    }
  ]
}


export const StudentNavigation = (t: any): any => {

  return [
    {
      title: t("Guruhlar"),
      icon: 'mdi:home-outline',
      path: '/student-groups',
    },
    {
      title: t("Profil"),
      icon: 'mdi:receipt-text-edit-outline',
      path: '/student-profile'
    }
  ]
}

export const CPanelNavigation = (t: any): any => {

  return [
    {
      title: t("CPanel"),
      icon: 'mdi:home-outline',
      path: '/c-panel',
    },
    {
      title: t("Sozlamalar"),
      icon: 'mdi:receipt-text-edit-outline',
      path: '/c-panel/settings'
    }
  ]
}

const Navigation = (t: any): VerticalNavItemsType => {

  const { user } = useContext(AuthContext)

  const items = [
    {
      title: t("Bosh sahifa"),
      icon: 'mdi:home-outline',
      path: '/dashboard'
    },
    {
      title: t("Lidlar"),
      icon: 'mdi:receipt-text-edit-outline',
      path: '/lids'
    },
    {
      title: t("Mentorlar"),
      icon: 'fa6-solid:chalkboard-user',
      path: '/mentors'
    },
    {
      title: t("Guruhlar"),
      icon: 'uil:layer-group',
      path: '/groups'
    },
    {
      title: t("O'quvchilar"),
      icon: 'mdi:account-student',
      path: '/students'
    },
    {
      title: t("Sozlamalar"),
      icon: 'mdi:settings',
      children: [
        {
          title: 'SMS Sozlamalari',
          path: '/settings/sms'
        },
        {
          title: 'Ofis',
          children: [
            {
              title: 'Kurslar',
              path: '/settings/office/courses'
            },
            {
              title: 'Xonalar',
              path: '/settings/office/rooms'
            },
            {
              title: 'Dam olish kunlari',
              path: '/settings/office/free-days'
            },
            // {
            //   title: 'Arxiv',
            //   path: '/settings/office/archive'
            // },
            // {
            //   title: 'Tark etgan talabalar',
            //   path: '/settings/office/lefted-students'
            // }
          ]
        },
        {
          title: 'CEO',
          children: [
            {
              title: 'Umumiy sozlamalar',
              path: '/settings/ceo/all-settings'
            },
            {
              title: 'Xodimlar',
              path: '/settings/ceo/users'
            },
            // {
            //   title: 'Billing',
            //   path: '/settings/ceo/billing'
            // },
          ]
        },
        {
          title: 'Formalar',
          path: '/settings/forms/'
        }
      ]
    },
    {
      title: t("Moliya"),
      icon: 'material-symbols-light:finance-mode',
      path: '/finance'
    },
  ]


  return user?.role.includes('casher') ? items : items.filter(el => el.path !== '/finance')
}

export default Navigation
