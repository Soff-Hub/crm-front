import { Box } from '@mui/material'
import { useEffect } from 'react'
import PaymentsList from 'src/@core/components/c-panel/payments/PaymentsList'
import { useAppDispatch } from 'src/store'
import { fetchTariffs } from 'src/store/apps/c-panel'


export default function Payments() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTariffs())
    }, [])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <PaymentsList />
        </Box >
    )
}