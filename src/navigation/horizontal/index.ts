import { Button } from '@mui/material'
import path from 'path'
import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import { AuthContext } from 'src/context/AuthContext'
import { toggleAmoModal } from 'src/store/apps/page'

const Navigation = (t: any): HorizontalNavItemsType => {
  const { user } = useContext(AuthContext)
  const dispatch = useDispatch()
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
      slug: 'settings',
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
              title: t('Umumiy sozlamalar'),
              path: '/settings/ceo/all-settings'
            },
            {
              title: 'Xodimlar',
              path: '/settings/ceo/users'
            }
          ]
        },
        {
          title: t('Harakatlar tarixi'),
          children: [
            {
              title: t("To'lovlar"),
              path: '/settings/logs/payment-history'
            },
            {
              title: t('Bot xabarnoma'),
              path: '/settings/logs/bot-notification'
            },
            {
              title: t('Yuborilgan SMS lar'),
              path: '/settings/logs/sms-history'
            }
          ]
        },
        {
          title: 'Formalar',
          path: '/settings/forms/'
        },
        {
          title: 'Amo CRM sozlamalari',
          path: '/settings/amocrm/'
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
        },
        {
          title: t('Davomatlar'),
          path: '/reports/attendances'
        }
      ]
    }

    // {
    //   title: t("Video qo'llanmalar"),
    //   icon: 'ph:video-light',
    //   path: '/video-tutorials'
    // }
  ]

  const adminItems = [
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
      slug: 'settings',
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
          title: 'Formalar',
          path: '/settings/forms/'
        },
        {
          title: 'Amo CRM sozlamalari',
          path: '/settings/amocrm/'
        }
      ]
    },
    {
      title: t('Hisobotlar'),
      icon: 'tabler:report',
      children: [
        {
          title: "O'quvchilar to'lovi",
          path: '/reports/student-payment'
        },
        {
          title: t('Davomatlar'),
          path: '/reports/attendances'
        }
      ]
    }
  ]

  const watcherItems = items.filter((el) => el.slug !== 'settings');

  return user?.role.includes('ceo')
    ? items
    : user?.role.includes('casher')
    ? items.filter((el) => el.path === '/finance')
    : user?.role.includes('watcher')
    ? watcherItems
    : adminItems;
}

export default Navigation
