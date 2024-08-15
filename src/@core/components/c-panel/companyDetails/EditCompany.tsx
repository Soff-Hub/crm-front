import { Box } from '@mui/material';
import { useEffect } from 'react';
import useResponsive from 'src/@core/hooks/useResponsive';
import CompanyPaymentList from './CompanyPaymentList';
import CompanySmsHistory from './CompanySmsHistory';
import { useAppDispatch } from 'src/store';
import { fetchClientPayments, fetchCompanyDetails, fetchSMSHistory } from 'src/store/apps/c-panel/companySlice';
import Details from './Details';
import EditDetails from './EditDetails';

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
        ])
    }

    useEffect(() => {
        pageLoad()
    }, [])


    const style = {
        padding: '0px',
        display: 'flex',
        gap: '20px',
        flexDirection: isMobile ? 'column' : 'row'
    }

    return (
        <Box>
            <Box sx={style}>
                <Details />
                <CompanySmsHistory />
                <CompanyPaymentList />
            </Box>
            <EditDetails />
        </Box>
    )
}