import CompanyMonthlyPlan from 'src/@core/components/c-panel/settings/monthlyPlan/CompanyMonthlyPlan'
import CompanySmsPlanList from 'src/@core/components/c-panel/settings/smsPlan/CompanySmsPlanList'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/store'
import { fetchSMSTariffs, fetchTariffs } from 'src/store/apps/c-panel'


export default function Settings() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        Promise.all([
            dispatch(fetchTariffs()),
            dispatch(fetchSMSTariffs())
        ])
    }, [])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <CompanyMonthlyPlan />
            <CompanySmsPlanList />
        </Box >
    )
}