// ** Type import
import { useTranslation } from 'react-i18next'
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const Navigation = (): HorizontalNavItemsType => {
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
          children: [
            {
              title: 'Barcha formalar',
              path: '/settings/forms/'
            },
            {
              title: 'Yangi forma yaratish',
              path: '/settings/forms/create'
            }
          ]
        }
      ]
    }
  ]
}

export default Navigation
