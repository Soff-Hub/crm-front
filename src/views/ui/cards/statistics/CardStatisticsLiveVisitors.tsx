// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const series = [
  {
    name: 'Sales',
    type: 'column',
    data: [73, 58, 46, 55, 56, 37, 28, 61, 34, 71, 91, 82]
  },
  {
    type: 'line',
    name: 'Sales',
    data: [63, 38, 31, 45, 46, 27, 18, 51, 24, 61, 81, 72]
  }
]

const CardWidgetsWeeklyOverview = ({ data }: any) => {
  // ** Hook
  const theme = useTheme()
  const { t } = useTranslation()

  const [type, setType] = useState<'expense' | 'benefit'>('benefit')

  const options: ApexOptions = {
    chart: {
      offsetY: 3,
      offsetX: -30,
      parentHeightOffset: 0,
      toolbar: { show: true, tools: { zoom: false, zoomin: false, zoomout: false } }
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
      size: 3.5,
      strokeWidth: 2,
      fillOpacity: 1,
      strokeOpacity: 1,
      colors: [theme.palette.background.paper],
      strokeColors: hexToRGBA(theme.palette.error.main, 1)
    },
    stroke: {
      width: [0, 2],
      colors: [theme.palette.customColors.trackBg, theme.palette.error.main]
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [hexToRGBA(theme.palette.customColors.trackBg, 1)],
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
      min: 0,
      // max: 90,
      show: true,
      tickAmount: 5,
      labels: {
        formatter: value => `${formatCurrency(value)}`,
        style: {
          fontSize: '0.75rem',
          colors: theme.palette.text.disabled
        }
      }
    }
  }

  return (
    <Card sx={{ p: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '22px' }}>Yillik summa</Typography>
        <FormControl className='ms-auto'>
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
                <MenuItem value={year}>{year}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl className='ms-2'>
          <InputLabel size='small' id='user-view-language-label'>{t('Tur')}</InputLabel>
          <Select
            size='small'
            label={t('Tur')}
            id='user-view-language'
            labelId='user-view-language-label'
            name='department'
            sx={{ mb: 1 }}
            defaultValue={'benefit'}
            onChange={(e: any) => setType(e.target.value)}
          >
            <MenuItem value={"benefit"}>{"Tushum"}</MenuItem>
            <MenuItem value={"expense"}>{"Chiqim"}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <ReactApexcharts type='line' height={208} series={data?.[type] || []} options={options} />
      </Box>
    </Card>
  )
}

export default CardWidgetsWeeklyOverview
