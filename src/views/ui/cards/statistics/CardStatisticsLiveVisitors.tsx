// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { formatCurrency } from 'src/@core/utils/format-currency'
import { Box, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'

const CardWidgetsWeeklyOverview = ({ data, loading, year }: any) => {
  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation()

  const options: ApexOptions = {
    chart: {
      offsetY: 3,
      offsetX: 0,
      parentHeightOffset: 0,
      toolbar: { show: true, tools: { zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } },
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
      width: [2, 2, 2],
      curve: 'smooth'
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: ['#EE6D7A', '#f2b92a', '#72E128'],
    grid: {
      strokeDashArray: 7,
      borderColor: theme.palette.divider
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', "Sen", 'Okt', 'Noy', 'Dek'],
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 5,
      labels: {
        formatter: (value) => `${formatCurrency(value)}`,
        style: {
          fontSize: '0.75rem'
        },
        // rotate: -45,
      },
      forceNiceScale: true
    }
  }


  return (
    <Card sx={{ p: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '22px' }}>{year} {t('Yildagi aylanmalar')}</Typography>
        {/* <FormControl className='ms-auto'>
          <InputLabel size='small' id='user-view-language-label'>{t('Yil')}</InputLabel>
          <Select
            size='small'
            label={t('Yil')}
            id='user-view-language'
            labelId='user-view-language-label'
            sx={{ mb: 1 }}
            defaultValue={2024}
          >
            {
              [2024, 2025, 2026, 2027, 2028].map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))
            }
          </Select>
        </FormControl> */}
      </Box>
      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            {
              [10, 12, 7, 20, 30, 13, 45, 33, 12, 41, 18, 9, 21].map(el => <Skeleton variant="rounded" width={'50px'} height={el * 5} />)
            }
          </Box>
        ) : data ? <ReactApexcharts type='line' height={208} series={data} options={options} /> : <EmptyContent />}
      </Box>
    </Card>
  )
}

export default CardWidgetsWeeklyOverview
