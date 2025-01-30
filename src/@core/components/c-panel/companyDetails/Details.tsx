import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { useAppSelector } from 'src/store'
import CompanyCardActions from './CompanyCardActions'
import RowOptions from 'src/views/apps/crm-payments/RowOptions'
import CrmRowOptions from 'src/views/apps/c-panel/CrmRowOptions'
import { useRouter } from 'next/router'

export default function Details() {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const { details, isLoading } = useAppSelector(state => state.companyDetails)
  const { query } = useRouter()

  const statsFields = {
    student_count: {
      name: "O'quvchilar soni",
      value: details?.students_count
    },
    branches_count: {
      name: 'Filiallar soni',
      value: details?.client_data?.branches_count
    },
    courses_count: {
      name: 'Kurslar soni',
      value: details?.client_data?.courses_count
    },
    groups_count: {
      name: 'Guruhlar soni',
      value: details?.client_data?.groups_count
    },
    rooms_count: {
      name: 'Xonalar soni',
      value: details?.client_data?.rooms_count
    },
    employees_count: {
      name: 'Xodimlar soni',
      value: details?.client_data?.employees_count
    },
    sms_service: {
      name: 'SMS xizmati',
      value: details?.sms_data
    },
    last_payment: {
      name: 'Tarif',
      value: details?.order_data?.tariff_data
    },
    created_at: {
      name: 'Markaz ochilgan sana',
      value: details?.date
    },
    next_payment: {
      name: "Keyingi to'lov",
      value: details?.expiration_date
    },
    payment_type: {
      name: "To'lov turi",
      value:
        details?.payment_service == 'by_coming_date'
          ? 'Har oy boshida'
          : details?.payment_service == 'by_added_at'
          ? 'Qoshilgan sanadan pul yechish'
          : details?.payment_service == 'by_lesson_price'
          ? 'Xar dars uchun pul yechish'
          : 'Har nechtadur darsda'
    },
    salary_type: {
      name: 'Oylik turi',
      value:
        details?.salary_service == 'by_course_price'
          ? 'Kurs narxidan oylik hisoblash'
          : details?.salary_service == 'by_student_arrears'
          ? 'Yechilgan puldan oylik hisoblash'
          : "To'langan puldan oylik hisoblash"
    }
  }

  return (
    <Card sx={{ maxWidth: '400px', minWidth: isMobile ? '300px' : '400px', marginTop: '18px' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {isLoading ? (
          <Skeleton variant='rounded' height={20} width='70%' animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h6'>{details?.name}</Typography>
            <CrmRowOptions id={String(query?.slug)} />
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.student_count.name)} -</Typography>
            <Typography color={'green'}>{statsFields.student_count.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.branches_count.name)} -</Typography>
            <Typography color={'green'}>{statsFields.branches_count.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.courses_count.name)} -</Typography>
            <Typography color={'green'}>{statsFields.courses_count.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.employees_count.name)} -</Typography>
            <Typography color={'green'}>{statsFields.employees_count.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.groups_count.name)} -</Typography>
            <Typography color={'green'}>{statsFields.groups_count.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.rooms_count.name)} -</Typography>
            <Typography color={'green'}>{statsFields.rooms_count.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.sms_service.name)}</Typography>
            <Typography color={'green'}>{statsFields.sms_service.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.created_at.name)}</Typography>
            <Typography color={'green'}>{statsFields.created_at.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.last_payment.name)}</Typography>
            {statsFields.last_payment.value ? (
              <Typography color={'green'}>
                <span style={{ color: '#22d3ee', marginRight: '5px' }}>
                  {statsFields.last_payment.value?.month_count} {t('oylik')}
                </span>
                <span style={{ color: '#f59e0b', marginRight: '5px' }}>
                  ({formatCurrency(statsFields.last_payment.value?.amount)} so'm)
                </span>
                <span style={{ color: '#84cc16' }}>
                  ({statsFields.last_payment.value?.min_count}-{statsFields.last_payment.value?.max_count}{' '}
                  {t("ta o'quvchi")})
                </span>
              </Typography>
            ) : (
              <Typography color={'red'}>Tarifsiz</Typography>
            )}
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.payment_type.name)}</Typography>
            <Typography color={'green'}>{statsFields.payment_type.value}</Typography>
          </Box>
        )}
         {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.salary_type.name)}</Typography>
            <Typography color={'green'}>{statsFields.salary_type.value}</Typography>
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant='rounded' height={20} animation='wave' />
        ) : (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography>{t(statsFields.next_payment.name)}</Typography>
            <Typography color={'green'}>{statsFields.next_payment.value}</Typography>
          </Box>
        )}
        <CompanyCardActions />
      </CardContent>
    </Card>
  )
}
