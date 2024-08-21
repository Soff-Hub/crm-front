import { Box } from '@mui/material';
import { useEffect } from 'react';
import useResponsive from 'src/@core/hooks/useResponsive';
import CompanyPaymentList from './CompanyPaymentList';
import CompanySmsHistory from './CompanySmsHistory';
import { useAppDispatch } from 'src/store';
import { fetchClientPayments, fetchCompanyDetails, fetchLogs, fetchSMSHistory } from 'src/store/apps/c-panel/companySlice';
import { fetchSMSTariffs, fetchTariffs } from 'src/store/apps/c-panel';
import Details from './Details';
import EditDetails from './EditDetails';
import CreatePayment from './CreatePayment';
import ClientLogs from './ClientLogs';
import CreateSMSPayment from './CreateSMSPayment';

type Props = {
    slug?: number | undefined
}

export default function CreateCompany({ slug }: Props) {
    const dispatch = useAppDispatch()
    const { isMobile } = useResponsive()

    async function pageLoad() {
        if (slug) return await Promise.all([
            dispatch(fetchCompanyDetails(slug)),
            dispatch(fetchSMSHistory(slug)),
            dispatch(fetchClientPayments(slug)),
            dispatch(fetchTariffs()),
            dispatch(fetchSMSTariffs()),
            dispatch(fetchLogs(slug)),
        ])
    }

    useEffect(() => {
        pageLoad()
    }, [])


    const style = {
        padding: '0px',
        display: 'flex',
        alignItems: "start",
        gap: '20px',
        flexDirection: isMobile ? 'column' : 'row',
    }

    return (
        <Box>
            <Box sx={style}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Details />
                    <EditDetails />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", gap: "20px" }}>
                        <CompanySmsHistory />
                        <CompanyPaymentList />
                    </Box>
                    <ClientLogs />
                </Box>
            </Box>
            <CreatePayment />
            <CreateSMSPayment />
        </Box>
    )
}