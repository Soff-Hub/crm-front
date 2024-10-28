// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types'
import useResponsive from 'src/@core/hooks/useResponsive'
import { formatCurrency } from 'src/@core/utils/format-currency'

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  const { title, color, icon, stats } = props

  const { isMobile, isTablet } = useResponsive()

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '10px 0px !important' : '15px 10px !important'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mb: 2 }}>
          <CustomAvatar
            sx={{ width: isMobile ? '30px' : '30px', height: isMobile ? '30px' : '30px', p: 1 }}
            className='text-center fs-2'
            skin='light'
            variant='rounded'
            color={color}
          >
            {icon}
          </CustomAvatar>
        </Box>
        <Typography
          className='text-center'
          variant='caption'
          sx={{ mb: 2, fontSize: isMobile ? '12px !important' : isTablet ? '14px !important' : '16px !important' }}
        >
          {stats}
        </Typography>
        <Typography className='text-center' variant='h4' sx={{ mb: 0, fontSize: '16px !important' }}>
          {formatCurrency(title)}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
