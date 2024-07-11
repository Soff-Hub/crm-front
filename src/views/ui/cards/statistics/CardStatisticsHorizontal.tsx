// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Imports
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Components Imports
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

interface Props {
  data: CardStatsHorizontalProps[]
}

const CardStatsHorizontal = ({ data }: Props) => {
  if (data) {
    return (
      <Grid container spacing={6}>
        {data.map((item: CardStatsHorizontalProps, index: number) => {
          return (
            <Grid item xs={12} md={2} sm={4} key={index}>
              {item.id ? (
                <a href={item.id} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
                </a>
              ) : <CardStatisticsHorizontal {...item} icon={<Icon icon={item.icon as string} />} />
              }
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
