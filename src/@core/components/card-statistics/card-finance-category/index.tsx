// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Types Imports
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types'
import useResponsive from 'src/@core/hooks/useResponsive'
import { formatCurrency } from 'src/@core/utils/format-currency'

const CardFinanceCategory = (props: CardStatsVerticalProps) => {
  // ** Props
  const { title, stats } = props

  const { isMobile, isTablet } = useResponsive()

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: isMobile ? '10px 0px !important' : '15px 10px !important' }}>
        <Typography className='text-center' variant='h4' sx={{ mb: 0, fontSize: '20px !important' }}>
          {title}
        </Typography>
        <Typography className='text-center' variant='body2' sx={{ mb: 2, fontSize: isMobile ? '12px !important' : isTablet ? '14px !important' : '20px !important' }}>
          {formatCurrency(stats)} UZS
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardFinanceCategory
