import { Box } from '@mui/material';
import { useEffect } from 'react';
import PaymentsList from 'src/@core/components/c-panel/sms-payments/PaymentsList';
import { useAppDispatch } from 'src/store';
import { fetchCRMPayments } from 'src/store/apps/c-panel';


export default function SMSPayments() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchCRMPayments())
    }, [])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <PaymentsList />
        </Box >
    )
}