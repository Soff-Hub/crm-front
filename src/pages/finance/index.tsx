// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CardStatsType } from 'src/@fake-db/types'

// ** Demo Components Imports
import CardStatisticsSales from 'src/views/ui/cards/statistics/CardStatisticsSales'
import CardStatisticsCharts from 'src/views/ui/cards/statistics/CardStatisticsCharts'
import CardStatisticsCharts2 from 'src/views/ui/cards/statistics/CardStatisticsCharts2'
import CardStatisticsVertical from 'src/views/ui/cards/statistics/CardStatisticsVertical'
import CardStatisticsHorizontal from 'src/views/ui/cards/statistics/CardStatisticsHorizontal'
import CardStatisticsCharacters from 'src/views/ui/cards/statistics/CardStatisticsCharacters'
import CardStatisticsLiveVisitors from 'src/views/ui/cards/statistics/CardStatisticsLiveVisitors'
import CardStatisticsMarketingSales from 'src/views/ui/cards/statistics/CardStatisticsMarketingSales'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Typography } from '@mui/material'
import EditableTable from 'src/@core/components/table/editable-table'

const CardStatistics = () => {

    const apiData: CardStatsType = {
        statsHorizontal: [
            {
                color: 'success',
                stats: '64,550,000',
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: 'Umumiy Tushum'
            },
            {
                stats: '31,412,000',
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: 'Umumiy Chiqim'
            },
            {
                icon: 'ph:student-light',
                trend: 'negative',
                trendNumber: '7.2%',
                title: "O'quvchilar statistikasi",
                stats: '313',
                color: 'warning',
            },
            {
                stats: '250',
                trend: 'positive',
                trendNumber: '8.1%',
                title: 'Lidlar statistikasi',
                icon: 'mdi:account-outline'
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

                    <Grid item xs={12} md={12}>
                        <EditableTable />
                    </Grid>

                    {/* <Grid item xs={12}>
                        <CardStatisticsCharacters data={apiData.statsCharacter} />
                    </Grid> */}

                    <Grid item xs={12}>
                        <CardStatisticsVertical data={apiData.statsVertical} />
                    </Grid>

                    <Grid item xs={12}>
                        <CardStatisticsCharts />
                    </Grid>

                    {/* <Grid item xs={12}>
                        <CardStatisticsCharts2 />
                    </Grid> */}
                </Grid>
            </KeenSliderWrapper>
        </ApexChartWrapper>
    )
}


export default CardStatistics
