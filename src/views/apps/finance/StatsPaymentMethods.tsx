import { Box, Chip, Grid, Skeleton, Typography } from '@mui/material'
import { Briefcase, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useSettings } from 'src/@core/hooks/useSettings'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { useAppSelector } from 'src/store'

export default function StatsPaymentMethods() {
  const { all_numbers, numbersLoad: loading } = useAppSelector(state => state.finance)
  const { isMobile } = useResponsive()
  const { settings } = useSettings()


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

            <Box sx={{marginTop:10}}>
              {all_numbers?.payment_types.map((item, index) => (
                <Box sx={{marginBottom:5}}>
                  {settings.mode === 'light' ? (
                    <div className='d-flex align-items-center justify-content-between p-2 bg-success bg-opacity-10 rounded px-3'>
                      <div className='d-flex align-items-center gap-2'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle bg-success'
                          style={{ width: '1.5rem', height: '1.5rem' }}
                        >
                          <Wallet className='text-white' style={{ width: '0.75rem', height: '0.75rem' }} />
                        </div>
                        <div>
                          <div className='fw-medium small'>{item?.name}</div>
                          <div className='text-muted small'>{item?.count || '1 операция'}</div>
                        </div>
                      </div>
                      <div className='text-end fw-medium text-success small'>
                        {formatCurrency(item?.amount) + " so'm"}
                      </div>
                    </div>
                  ) : (
                    <div className='d-flex align-items-center justify-content-between p-2 bg-dark bg-opacity-50 rounded px-3'>
                      <div className='d-flex align-items-center gap-2'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle bg-success'
                          style={{ width: '1.5rem', height: '1.5rem' }}
                        >
                          <Wallet className='text-white' style={{ width: '0.75rem', height: '0.75rem' }} />
                        </div>
                        <div>
                          <Typography fontSize={15}>{item?.name}</Typography>
                          <div className='small text-light'>
                              <Typography fontSize={12}>{item?.count||"1 операция"}</Typography>
                          </div>
                        </div>
                      </div>
                      <div className='text-end fw-medium text-light small'>
                        {formatCurrency(item?.amount) + " so'm"}
                      </div>
                    </div>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <EmptyContent title="To'lovlar mavjud emas" />
        )}
      </div>
    </div>
  )
}
