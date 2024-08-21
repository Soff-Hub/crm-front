import { Box, Button, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EmptyContent from 'src/@core/components/empty-content';
import { useAppDispatch, useAppSelector } from 'src/store';
import { handleOpenSMSModal } from 'src/store/apps/c-panel';
import CreateMonthlyPlan from './components/CreateMonthlyPlan';
import EditMonthlyPlan from './components/EditMonthlyPlan';
import SMSCard from './components/SMSCard';

export default function CompanySmsPlanList() {
    const { smsTariffs, isGettingSMSTariffs } = useAppSelector(state => state.cPanelSlice)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    return (
        <Box sx={{ pb: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant='h6'>{t("SMS tariflar")}</Typography>
                <Button onClick={() => dispatch(handleOpenSMSModal(true))} variant='contained' color='primary'>{t("SMS tarif qo'shish")}</Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: "repeat(5,1fr)", alignItems: "start", gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
                {isGettingSMSTariffs ?
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
                        </Box>)) : smsTariffs.length ? smsTariffs.map(tariff => (
                            <SMSCard item={tariff} />
                        )) : <Box sx={{ gridColumn: "1/6" }}><EmptyContent /></Box>}

            </Box>
            <CreateMonthlyPlan />
            <EditMonthlyPlan />
        </Box>
    )
}