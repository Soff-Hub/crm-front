//@ts-nocheck
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import IconifyIcon from 'src/@core/components/icon'
import Box from '@mui/material/Box'
import { useAppDispatch, useAppSelector } from 'src/store'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Skeleton, Tooltip } from '@mui/material'
import { updateStudentParams } from 'src/store/apps/students'
import { formatCurrency } from 'src/@core/utils/format-currency'

export default function DashboardStats() {
  const { stats, statsData, isStatsLoading } = useAppSelector(state => state.dashboard)
  const dispatch = useAppDispatch()
  const { isMobile, isTablet } = useResponsive()
  const { push } = useRouter()
  const { t } = useTranslation()

  console.log(stats)

  function click(link: string) {
    if (link === 'debtors_amount') {
      dispatch(updateStudentParams({ is_debtor: true, last_payment: '' }))
      return push('/students')
    } else if (link === 'debtor_users') {
      dispatch(updateStudentParams({ is_debtor: true, last_payment: '' }))
      return push('/students')
    } else if (link === 'last_payment') {
      dispatch(updateStudentParams({ is_debtor: '', last_payment: true }))
      return push('/students')
    } else if (link === 'group_status') {
      dispatch(updateStudentParams({ group_status: 'new' }))
      return push('/students')
    } else if (link === 'active_students') {
      dispatch(updateStudentParams({ group_status: 'active' }))
      return push('/students')
    } else if (link === 'not_activated') {
      dispatch(updateStudentParams({ group_status: 'not_activated' }))
      return push('/students')
    }

    push(link)
  }

  const tooltip = {
    active_groups: 'Ayni vaqtda faol guruhlar soni',
    active_students: "Ayni vaqtda faol o'quvchilar soni",
    debtor_users: "Qarzdor o'quvchilar soni",
    debtors_amount: `Faol o'quvchilar qarzdorligi : ${formatCurrency(stats?.active_debts_amount) + " so'm"}    
    ${
      stats?.archive_debts_amount < 0 &&
      `Arxivdagi o'quvchilar qarzdorligi : ${formatCurrency(stats.archive_debts_amount) + " so'm"}`
    } 
      
    `,
    leads_count: "Kurslarga ro'yxatdan o'tgan faol lidlar soni",
    not_activated_students: "Sinov darsiga kelib ketgan o'quvchilar soni",
    payment_approaching: "To'lov qilishiga 7 kundan kam qolgan o'quvchilar soni",
    teacher_count: "O'qituvchilar soni",
    test_students: "Sinov darsida o'qiyotgan o'quvchilar soni"
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: '10px',
        mb: 5,
        gridTemplateColumns: `repeat(${isMobile ? 3 : isTablet ? 4 : 9}, 1fr)`
      }}
    >
      {isStatsLoading
        ? statsData.map((_, index) => (
            <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => click(_.link)}>
              <Skeleton
                sx={{ bgcolor: 'grey.300' }}
                variant='rectangular'
                width={'100%'}
                height={'140px'}
                style={{ borderRadius: '10px' }}
                animation='wave'
              />
            </Box>
          ))
        : ''}
      {stats && !isStatsLoading
        ? stats?.payment_approaching
          ? statsData.map((_, index) => (
              <Tooltip arrow title={tooltip[_.key]}>
                <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => click(_.link)}>
                  <CardStatsVertical
                    title={stats?.[_.key]}
                    stats={t(_.title)}
                    icon={<IconifyIcon fontSize={'4rem'} icon={_.icon} />}
                    color={_.color}
                  />
                </Box>
              </Tooltip>
            ))
          : statsData
              ?.filter(el => el.key !== 'payment_approaching')
              .map((_, index) => (
                <Tooltip arrow title={tooltip[_.key]}>
                  <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => click(_.link)}>
                    <CardStatsVertical
                      title={stats?.[_.key]}
                      stats={t(_.title)}
                      icon={<IconifyIcon fontSize={'4rem'} icon={_.icon} />}
                      color={_.color}
                    />
                  </Box>
                </Tooltip>
              ))
        : null}
    </Box>
  )
}
