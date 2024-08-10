import { Box, Skeleton } from '@mui/material';
import EmptyContent from 'src/@core/components/empty-content';
import { useAppSelector } from 'src/store';
import CreateMonthlyPlan from './components/CreateMonthlyPlan';
import EditMonthlyPlan from './components/EditMonthlyPlan';
import Heading from './components/Heading';
import MonthlyCard from './components/MonthlyCard';

type Props = {}

export default function CompanyMonthlyPlan({ }: Props) {
    const { tariffs, isGettingTariffs } = useAppSelector(state => state.cPanelSlice)
    console.log(isGettingTariffs);

    return (
        <Box sx={{ borderBottom: "2px solid #d1d5db", pb: 5 }}>
            <Heading />
            <Box sx={{ display: 'grid', gridTemplateColumns: "repeat(5,1fr)", alignItems: "center", gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
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
                            <MonthlyCard key={tariff.id} item={tariff} />
                        )) : <EmptyContent />}
            </Box>
            <CreateMonthlyPlan />
            <EditMonthlyPlan />
        </Box >
    )
}