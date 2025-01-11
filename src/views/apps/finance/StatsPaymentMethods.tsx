import { Box, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import useResponsive from 'src/@core/hooks/useResponsive'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { useAppSelector } from 'src/store'

export default function StatsPaymentMethods() {
  const { all_numbers, numbersLoad: loading } = useAppSelector(state => state.finance)
  const { isMobile } = useResponsive()

  const { t } = useTranslation()
  const props: any = {
    series: all_numbers?.payment_types.map(el => el.amount),
    options: {
      chart: {
        width: isMobile ? '100%' : 380,
        type: 'pie'
      },
      labels: all_numbers?.payment_types.map(el => el.name),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ],
      title: {
        text: t('Tushumlar'),
        style: {
          fontSize: '20px',
          fontWeight: 500,
          opacity: 0.6
        }
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${formatCurrency(value)} so'm`
        }
      }
    }
  }

  return (
    <div>
      <div id='chart-circle'>
        {loading ? (
          <Box sx={{ p: '5px' }}>
            <Skeleton variant='text' width={isMobile ? '100%' : 200} height={30} />
            <Box sx={{ display: 'flex', padding: '8px 25px', gap: '30px' }}>
              <Skeleton variant='circular' width={200} height={200} />
              <Box>
                <Skeleton variant='text' width={120} height={30} />
                <Skeleton variant='text' width={120} height={30} />
                <Skeleton variant='text' width={120} height={30} />
              </Box>
            </Box>
          </Box>
        ) : props?.series?.some((el: number) => el > 0) && all_numbers ? (
          <Box>
            <ReactApexcharts options={props.options} series={props.series} type='pie' width={isMobile ? '100%' : 380} />
            {all_numbers?.payment_types.map(item => (
              <Box display='flex' alignItems='center' gap={2}>
                <Typography  display='flex'>{item.name} : </Typography>
                <Typography  fontSize={12}>{item.amount}</Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <EmptyContent title="To'lovlar mavjud emas" />
        )}
      </div>
    </div>
  )
}
