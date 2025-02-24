import { Box, Grid, Skeleton, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import CardStatisticsHorizontal from 'src/views/ui/cards/statistics/CardStatisticsHorizontal'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import { fetchFinanceAllNumbers, updateNumberParams } from 'src/store/apps/finance'
import { formatDateString } from 'src/pages/finance'
import { AuthContext } from 'src/context/AuthContext'
import useResponsive from 'src/@core/hooks/useResponsive'

export const yearItems = [
  { label: 2021, value: 2021 },
  ...Array(new Date().getFullYear() - 2021)
    .fill(1)
    .map((item, index) => ({ label: 2021 + index + 1, value: 2021 + index + 1 }))
]
export const monthItems = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr'
].map((el, i) => ({ label: el, value: i + 1 < 10 ? `0${i + 1}` : `${i + 1}` }))

const FinanceAllNumber = () => {
  const { all_numbers, numbersLoad, allNumbersParams } = useAppSelector(state => state.finance)
  const { user } = useContext(AuthContext)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [date, setDate] = useState<any>('')
  const [activeBranch, setActiveBranch] = useState<any>(user?.active_branch)
  const { isMobile } = useResponsive()

  const statsHorizontal = all_numbers
    ? [
        {
          color: 'warning',
          stats: all_numbers?.label.benefit,
          trend: 'negative',
          icon: 'hugeicons:money-receive-flow-02',
          trendNumber: '12.6%',
          title: t('Tushumlar'),
          id: '#tushumlar'
        },
        {
          stats: all_numbers?.label.expense,
          color: 'error',
          icon: 'hugeicons:money-send-flow-02',
          trendNumber: '22.5%',
          title: t('Chiqimlar'),
          id: '#chiqimlar'
        },
        {
          color: Number(all_numbers?.label.difference) < 0 ? 'error' : 'success',
          stats: all_numbers?.label.difference,
          trend: Number(all_numbers?.label.difference) < 0 ? 'negative' : 'positive',
          icon: Number(all_numbers?.label.difference) < 0 ? 'mdi:trending-down' : 'mdi:trending-up',
          trendNumber: '12.6%',
          title: t('Foyda'),
          id: '#tushumlar'
        },
        {
          color: Number(all_numbers?.label.active_balance) < 0 ? 'error' : 'success',
          stats: all_numbers?.label?.active_balance,
          trend: Number(all_numbers?.label.active_balance) < 0 ? 'negative' : 'positive',
          icon: 'mdi:wallet',
          iconplus: 'mdi:plus',
          trendNumber: '12.6%',
          title: t('Aktiv balans'),
          bgColor: Number(all_numbers?.label.active_balance) < 0 ? 'bg-red-500' : 'bg-green-500',
          id: '/finance/investment'
        }
      ]
    : []

  return (
    <Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: 1 }}>
        <Typography sx={{ flexGrow: 1 }} variant='h5'>
          {t('Umumiy raqamlar')}
        </Typography>
      </Box>
      {numbersLoad ? (
        <Grid container spacing={isMobile ? 4 : 8}>
          {[1, 2, 3, 4].map((_, index) => (
            <Grid key={`${_}-${index}`} item xs={12} md={3}>
              <Skeleton
                variant='rounded'
                width={'100%'}
                height={'80px'}
                style={{ borderRadius: '10px' }}
                animation='wave'
              />
            </Grid>
          ))}
        </Grid>
      ) : all_numbers ? (
        <CardStatisticsHorizontal data={statsHorizontal} />
      ) : (
        <EmptyContent />
      )}
    </Grid>
  )
}

export default FinanceAllNumber
