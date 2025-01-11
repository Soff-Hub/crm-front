// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { AvatarProps } from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { Icon } from '@iconify/react'

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
  width: 40,
  height: 40,
  marginRight: theme.spacing(4)
}))

const CardStatsHorizontal = (props: CardStatsHorizontalProps) => {
  // ** Props
  const { title, icon,iconplus, stats,bgColor, trendNumber, color = 'primary', trend = 'positive' } = props

  

  return (
    <Card className={bgColor}>
      <CardContent sx={{display:'flex', justifyContent:'space-between', py: theme => `${theme.spacing(4.125)} !important` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Avatar skin='light' color={color} variant='rounded' sx={{ margin: '0' }}>
            {icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h6'>{formatCurrency(stats)} UZS</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <Box sx={{ display: 'inline-flex', color: trend === 'positive' ? 'success.main' : 'error.main' }}>
                  <Icon icon={trend === 'positive' ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                </Box>
                <Typography variant='caption' sx={{ color: trend === 'positive' ? 'success.main' : 'error.main' }}>
                  {trendNumber}
                </Typography> */}
              </Box>
            </Box>
            <Typography sx={{ fontSize: '14px' }} variant='caption'>{title}</Typography>
          </Box>
           
        </Box>
        <Box>
        {iconplus?.props?.icon && <Icon icon={`${iconplus.props.icon}`} />}
          </Box>
      </CardContent>
    </Card>
  )
}

export default CardStatsHorizontal
