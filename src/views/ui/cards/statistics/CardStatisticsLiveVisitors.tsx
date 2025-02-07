// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { formatCurrency } from 'src/@core/utils/format-currency'
import { Box, Grid, LinearProgress, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import { useAppSelector } from 'src/store'
import useResponsive from 'src/@core/hooks/useResponsive'

const CardWidgetsWeeklyOverview = () => {
  // ** Hook
  const { isMobile } = useResponsive()

  const theme = useTheme()
  const { t } = useTranslation()

  const { all_numbers, numbersLoad: loading } = useAppSelector(state => state.finance)

  

  const data = all_numbers
    ? [
        {
          name: t('Chiqimlar'),
          data: Object.values(all_numbers.expense)
        },
        {
          name: t('Tushumlar'),
          data: Object.values(all_numbers.benefit)
        },
        {
          name: t('Foyda'),
          data: Object.values(all_numbers.difference)
        }
      ]
    : []

  const options: ApexOptions = {
    chart: {
      type: 'area',
      offsetY: 3,
      offsetX: 0,
      parentHeightOffset: 0,
      toolbar: { show: true, tools: { zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } },
      dropShadow: {
        enabled: true,
        color: '#563BFF',
        top: 10,
        left: 5,
        blur: 10,
        opacity: 0.1
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        columnWidth: '0%',
        endingShape: 'rounded',
        startingShape: 'rounded',
        colors: {
          ranges: [
            {
              to: 50,
              from: 40,
              color: 'transparent'
            }
          ]
        }
      }
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      fillOpacity: 0,
      strokeOpacity: 1
    },
    stroke: {
      curve: 'smooth'
    },
    legend: { show: false },
    dataLabels: {
      enabled: false
    },
    colors: ['#EE6D7A', '#f2b92a', '#72E128'],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0,
        opacityTo: 0
      }
    },
    grid: {
      show: true,
      borderColor: '#f3f4f6'
    },
    xaxis: {
      categories: ['Yan', 'Fev', 'Mart', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'].map(month =>
        t([month])
      ),
      tickPlacement: 'on',
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        show: true,
        style: {
          fontFamily: 'Inter,Verdana',
          fontSize: '12px',
          colors: '#9ca3af'
        }
      }
    },
    yaxis: {
      show: true,
      tickAmount: 5,
      labels: {
        formatter: value => `${formatCurrency(value)}`,
        rotate: isMobile ? -45 : 0,
        style: {
          fontFamily: 'Inter,Verdana',
          fontSize: '12px',
          colors: '#9ca3af'
        }
      },
      forceNiceScale: true
    },
    tooltip: {
      enabled: true
    }
  }

  return (
    <>
      <Card sx={{ p: '20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <Skeleton variant='text' width={'200px'} />
          ) : (
            <Typography sx={{ fontSize: '22px', fontFamily: 'Inter' }}>
              {all_numbers?.year} {t('yildagi aylanmalar')}
            </Typography>
          )}
        </Box>
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
              {[10, 12, 7, 20, 30, 13, 45, 33, 12, 41, 18, 9, 21].map(el => (
                <Skeleton variant='rounded' width={'50px'} height={el * 5} />
              ))}
            </Box>
          ) : all_numbers ? (
            <ReactApexcharts type='area' height={208} series={data} options={options} />
          ) : (
            <EmptyContent />
          )}
        </Box>
      </Card>
      {/* <Typography sx={{ marginTop: 5, marginBottom: 5 }} variant='h6' gutterBottom>
        Moliyaviy Ma'lumotlar
      </Typography> */}

      {/* <div className='container'>
        <div className='row row-cols-1 row-cols-md-3 g-4'>
          <div className='col'>
            <div className='card d-flex flex-column p-4 text-white shadow-lg h-100' style={{ background: '#007bff' }}>
              <div className='d-flex align-items-center mb-3'>
                <svg
                  className='w-6 h-6 me-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='fs-6 fw-semibold'>Reja qilingan summa</span>
              </div>
              <p className='fs-3 fw-bold'>$5000</p>
            </div>
          </div>

          <div className='col'>
            <div className='card d-flex flex-column p-4 text-white shadow-lg h-100' style={{ background: '#28a745' }}>
              <div className='d-flex align-items-center mb-3'>
                <svg
                  className='w-6 h-6 me-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                  />
                </svg>
                <span className='fs-6 fw-semibold'>Foyda</span>
              </div>
              <p className='fs-3 fw-bold'>$2000</p>
            </div>
          </div>

          <div className='col'>
            <div className='card d-flex flex-column p-4 text-white shadow-lg h-100' style={{ background: '#f39c12' }}>
              <div className='d-flex align-items-center mb-3'>
                <svg
                  className='w-6 h-6 me-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
                  />
                </svg>
                <span className='fs-6 fw-semibold'>Bajarilgan foiz</span>
              </div>
              <p className='fs-3 fw-bold'>40%</p>
            </div>
          </div>
        </div>

     
      </div> */}
    </>
  )
}

export default CardWidgetsWeeklyOverview
