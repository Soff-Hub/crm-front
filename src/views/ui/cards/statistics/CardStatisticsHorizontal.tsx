// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Components Imports
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'
import useResponsive from 'src/@core/hooks/useResponsive'

interface Props {
  data: any[]
}

const CardStatsHorizontal = ({ data }: Props) => {
  const { isMobile } = useResponsive()
  if (data) {
    return (
      <Grid container spacing={isMobile ? 4 : 7}>
        {data.map((item: CardStatsHorizontalProps, index: number) => {
          return (
            <Grid
              item
              xs={12}
              md={3}
              sm={3}
              key={index}
             
            >
              {item.id ? (
                <a href={item.id} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <CardStatisticsHorizontal {...item} bgColor={item.bgColor} iconplus={<Icon icon={item.iconplus as string} />}   icon={<Icon icon={item.icon as string} />} />
                </a>
              ) : (
                <CardStatisticsHorizontal {...item} bgColor={item.bgColor} iconplus={<Icon icon={item.iconplus as string} />}  icon={<Icon icon={item.icon as string} />} />
              )}
            </Grid>
          )
        })}
      </Grid>
    )
  } else {
    return null
  }
}

export default CardStatsHorizontal
