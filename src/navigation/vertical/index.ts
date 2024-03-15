// ** Type import
import { useTranslation } from 'react-i18next'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

export const TeacherNavigation = (): any => {
  const { t } = useTranslation()
  
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

const Navigation = (): VerticalNavItemsType => {
  const { t } = useTranslation()
  
  return [
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
      title: t("O'quvchilar"),
      icon: 'mdi:account-student',
      path: '/students'
    },
    {
      title: t("Guruhlar"),
      icon: 'uil:layer-group',
      path: '/groups'
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
            {
              title: 'Arxiv',
              path: '/settings/office/archive'
            },
            {
              title: 'Tark etgan talabalar',
              path: '/settings/office/lefted-students'
            }
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
            {
              title: 'Billing',
              path: '/settings/ceo/billing'
            },
          ]
        },
        {
          title: 'Formalar',
          path: '/settings/forms/'
        }
      ]
    }
  ]
}

export default Navigation
