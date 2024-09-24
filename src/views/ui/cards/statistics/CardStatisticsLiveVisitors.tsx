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
import { useAppSelector } from 'src/store'
import useResponsive from 'src/@core/hooks/useResponsive'

const CardWidgetsWeeklyOverview = () => {
  // ** Hook
  const { isMobile } = useResponsive()

  const theme = useTheme()
  const { t } = useTranslation()

  const { all_numbers, numbersLoad: loading } = useAppSelector(state => state.finance)

  const data = all_numbers ? [
    {
      name: t('Chiqimlar'),
      data: Object.values(all_numbers.expense),
    }, {
      name: t('Tushumlar'),
      data: Object.values(all_numbers.benefit),
    }, {
      name: t('Foyda'),
      data: Object.values(all_numbers.difference),
    }
  ] : []

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
      },
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
        opacityTo: 0,
      },
    },
    grid: {
      show: true,
      borderColor: "#f3f4f6"
    },
    xaxis: {
      categories: ['Yan', 'Fev', 'Mart', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'].map(month => t([month])),
      tickPlacement: 'on',
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        show: true,
        style: {
          fontFamily: "Inter,Verdana",
          fontSize: "12px",
          colors: "#9ca3af"
        }
      },
    },
    yaxis: {
      show: true,
      tickAmount: 5,
      labels: {
        formatter: (value) => `${formatCurrency(value)}`,
        rotate: isMobile ? -45 : 0,
        style: {
          fontFamily: "Inter,Verdana",
          fontSize: "12px",
          colors: "#9ca3af"
        }
      },
      forceNiceScale: true
    },
    tooltip: {
      enabled: true
    },
  }


  return (
    <Card sx={{ p: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {loading ? <Skeleton variant='text' width={'200px'} /> : <Typography sx={{ fontSize: '22px', fontFamily: "Inter" }}>{all_numbers?.year} {t('yildagi aylanmalar')}</Typography>}
      </Box>
      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            {
              [10, 12, 7, 20, 30, 13, 45, 33, 12, 41, 18, 9, 21].map(el => <Skeleton variant="rounded" width={'50px'} height={el * 5} />)
            }
          </Box>
        ) : all_numbers ? <ReactApexcharts type='area' height={208} series={data} options={options} /> : <EmptyContent />}
      </Box>
    </Card>
  )
}

export default CardWidgetsWeeklyOverview
