import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EmptyContent from 'src/@core/components/empty-content';
import { useAppSelector } from 'src/store';
import CreateMonthlyPlan from './components/CreateMonthlyPlan';
import EditMonthlyPlan from './components/EditMonthlyPlan';
import Heading from './components/Heading';
import MonthlyCard from './components/MonthlyCard';

type Props = {}

export default function CompanyMonthlyPlan({ }: Props) {
    const { tariffs, isGettingTariffs } = useAppSelector(state => state.cPanelSlice)
    const { t } = useTranslation()

    return (
        <Box sx={{ pb: 5 }}>
            <Heading />
            <Box sx={{ display: 'grid', gridTemplateColumns: "repeat(4,1fr)", alignItems: "start", gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
                {isGettingTariffs ?
                    [1, 2, 3, 4].map((el, i) => (
                        <Box key={i} onClick={() => { }}>
                            <Skeleton
                                sx={{ bgcolor: 'gray.300' }}
                                variant="rectangular"
                                width={'100%'}
                                height={'150px'}
                                style={{ borderRadius: '10px' }}
                                animation="wave"
                            />
                        </Box>)) : tariffs.length ? tariffs.map(tariff => (
                            <Paper sx={{ display: "flex", flexDirection: "column", gap: "15px", padding: "15px" }}>
                                <Typography sx={{ color: "orange" }} variant="h6">{tariff.min_count}-{tariff.max_count} {t("ta o'quvchi")}</Typography>
                                {tariff.tariffs?.map(item => <MonthlyCard key={item.id} item={item} />)}
                            </Paper>
                        )) : <Box sx={{ gridColumn: "1/5" }}><EmptyContent /></Box>}
            </Box>
            <CreateMonthlyPlan />
            <EditMonthlyPlan />
        </Box >
    )
}