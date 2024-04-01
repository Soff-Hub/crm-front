// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CardStatsType } from 'src/@fake-db/types'

// ** Demo Components Imports
import CardStatisticsHorizontal from 'src/views/ui/cards/statistics/CardStatisticsHorizontal'
import CardStatisticsLiveVisitors from 'src/views/ui/cards/statistics/CardStatisticsLiveVisitors'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Typography } from '@mui/material'
import GroupFinanceTable from 'src/views/apps/finance/GroupTable'
import FinanceEditableTable from 'src/views/apps/finance/GroupEditableTable'

const CardStatistics = () => {

    const apiData: CardStatsType = {
        statsHorizontal: [
            {
                color: 'success',
                stats: '64,550,000',
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: 'Tushum (oxirgi oy)',
                id: '#tushumlar'
            },
            {
                stats: '31,412,000',
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: 'Chiqim (oxirgi oy)',
                id: '#chiqimlar'
            },
            {
                color: 'success',
                stats: '64,550,000',
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: 'Tushum (oxirgi yil)',
                id: '#tushumlar'
            },
            {
                stats: '31,412,000',
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: 'Chiqim (oxirgi yil)',
                id: '#chiqimlar'
            }
        ],
        statsVertical: [
            {
                stats: '155k',
                color: 'primary',
                icon: 'mdi:cart-plus',
                trendNumber: '+22%',
                title: 'Total Orders',
                chipText: 'Last 4 Month'
            },
            {
                stats: '$89.34k',
                color: 'warning',
                trend: 'negative',
                trendNumber: '-18%',
                title: 'Total Profit',
                icon: 'mdi:wallet-giftcard',
                chipText: 'Last One Year'
            },
            {
                icon: 'mdi:link',
                color: 'info',
                stats: '142.8k',
                trendNumber: '+62%',
                chipText: 'Last One Year',
                title: 'Total Impression'
            },
            {
                stats: '$13.4k',
                color: 'success',
                trendNumber: '+38%',
                icon: 'mdi:currency-usd',
                title: 'Total Sales',
                chipText: 'Last Six Months'
            },
            {
                color: 'error',
                stats: '$8.16k',
                trend: 'negative',
                trendNumber: '-16%',
                title: 'Total Expenses',
                icon: 'mdi:briefcase-outline',
                chipText: 'Last One Month'
            },
            {
                stats: '$2.55k',
                color: 'secondary',
                icon: 'mdi:trending-up',
                trendNumber: '+46%',
                title: 'Transactions',
                chipText: 'Last One Year'
            }
        ],
        statsCharacter: [
            {
                stats: '8.14k',
                title: 'Ratings',
                chipColor: 'primary',
                trendNumber: '+15.6%',
                chipText: 'Year of 2022',
                src: '/images/cards/card-stats-img-1.png'
            },
            {
                stats: '12.2k',
                trend: 'negative',
                title: 'Sessions',
                chipColor: 'success',
                trendNumber: '-25.5%',
                chipText: 'Last Month',
                src: '/images/cards/card-stats-img-2.png'
            },
            {
                stats: '42.4k',
                title: 'Customers',
                chipColor: 'warning',
                trendNumber: '+9.2%',
                chipText: 'Daily Customers',
                src: '/images/cards/card-stats-img-3.png'
            },
            {
                stats: '4.25k',
                trendNumber: '+10.8%',
                chipColor: 'secondary',
                title: 'Total Orders',
                chipText: 'Last Week',
                src: '/images/cards/card-stats-img-4.png'
            }
        ]
    }


    return (
        <ApexChartWrapper>
            <KeenSliderWrapper>
                <Grid container spacing={4}>

                    <Grid item xs={12}>
                        <Typography>Umumiy raqamlar</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <CardStatisticsHorizontal data={apiData.statsHorizontal} />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <CardStatisticsLiveVisitors />
                    </Grid>

                    <div id='tushumlar'></div>
                    <Grid item xs={12}>
                        <Typography>Guruh to'lovlari</Typography>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <GroupFinanceTable />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>Chiqimlar hisoboti</Typography>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <FinanceEditableTable />
                    </Grid>
                </Grid>
            </KeenSliderWrapper>
        </ApexChartWrapper>
    )
}


export default CardStatistics
