// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'


// ** Types Imports
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types'

const CardStatsVertical = (props: CardStatsVerticalProps) => {
  // ** Props
  const { title, color, icon, stats} = props

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mb: 2 }}>
          <CustomAvatar sx={{ width: "60px", height: "60px" }} className='text-center fs-2' skin='light' variant='rounded' color={color}>
            {icon}
          </CustomAvatar>
        </Box>
        <Typography className='text-center' variant='body2' sx={{ mb: 3 }}>
          {stats}
        </Typography>
        <Typography className='text-center' variant='h4' sx={{ mb: 1 }}>
          {title}
        </Typography>
        
      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
