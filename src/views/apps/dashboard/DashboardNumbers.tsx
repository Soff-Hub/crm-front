import { Grid } from '@mui/material';
import React from 'react';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';
import FinanceAllNumber from '../finance/FinanceAllNumber';
import StatsPaymentMethods from '../finance/StatsPaymentMethods';
import CardStatisticsLiveVisitors from 'src/views/ui/cards/statistics/CardStatisticsLiveVisitors'

const DashboardNumbers = () => {
    return (
        <div style={{ marginTop: '50px' }}>
            <ApexChartWrapper>
                <Grid container spacing={4} columnSpacing={6}>
                    <Grid item xs={12}>
                        <FinanceAllNumber />
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                        <StatsPaymentMethods />
                    </Grid>
                    <Grid item xs={12} md={8} mb={10}>
                        <CardStatisticsLiveVisitors />
                    </Grid>
                </Grid>
            </ApexChartWrapper>
        </div>
    );
}

export default DashboardNumbers;
