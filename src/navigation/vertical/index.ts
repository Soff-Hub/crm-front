// ** Type import
import { useContext } from 'react'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { AuthContext } from 'src/context/AuthContext'

export const TeacherNavigation = (t: any): any => {
  return [
    {
      title: t('Guruhlar'),
      icon: 'mdi:home-outline',
      path: '/dashboard'
    }
    // {
    //   title: t("Profil"),
    //   icon: 'mdi:receipt-text-edit-outline',
    //   path: '/lids'
    // }
  ]
}

export const StudentNavigation = (t: any): any => {
  return [
    {
      title: t('Profil'),
      icon: 'et:profile-male',
      path: '/student-profile'
    }
    // {
    //   title: t("Guruhlar"),
    //   icon: 'uil:layer-group',
    //   path: '/student-profile/groups',
    // }
  ]
}

export const CPanelNavigation = (t: any): any => {
  return [
    {
      title: t('CPanel'),
      icon: 'mdi:home-outline',
      path: '/c-panel'
    },
    {
      title: t("Tarif to'lovlar"),
      icon: 'material-symbols:payments',
      path: '/c-panel/payments'
    },
    {
      title: t("SMS to'lovlar"),
      icon: 'material-symbols:payments',
      path: '/c-panel/sms-payments'
    },
    {
      title: t('Sozlamalar'),
      icon: 'mdi:receipt-text-edit-outline',
      path: '/c-panel/settings'
    }
  ]
}

const Navigation = (t: any): VerticalNavItemsType => {
  const { user } = useContext(AuthContext)

  const items = [
    {
      title: t('Bosh sahifa'),
      icon: 'clarity:home-solid',
      path: '/dashboard'
    },
    {
      title: t('Lidlar'),
      icon: 'mdi:receipt-text-edit-outline',
      path: '/lids'
    },
    {
      title: t('Mentorlar'),
      icon: 'fa6-solid:chalkboard-user',
      path: '/mentors'
    },
    {
      title: t('Guruhlar'),
      icon: 'uis:layer-group',
      path: '/groups'
    },
    {
      title: t("O'quvchilar"),
      icon: 'mdi:account-student',
      path: '/students'
    },
    {
      title: t('Sozlamalar'),
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
            }
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
            }
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
      title: t('Moliya'),
      icon: 'material-symbols:finance-mode-rounded',
      path: '/finance'
    },
    {
      title: t('Hisobotlar'),
      icon: 'tabler:report',
      children: [
        {
          title: "O'quvchilar to'lovi",
          path: '/reports/student-payment'
        }
      ]
    }
    // {
    //   title: t("Video qo'llanmalar"),
    //   icon: 'ph:video-light',
    //   path: '/video-tutorials'
    // }
  ]

  return user?.role.includes('casher') || user?.role.includes('ceo')
    ? items
    : items.filter(el => el.path !== '/finance')
}

export default Navigation
