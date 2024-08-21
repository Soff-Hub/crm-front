import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DataTable, { customTableDataProps } from '../../table';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useAppSelector } from 'src/store';

export default function ClientLogs() {
    const { isGettingLogs, logs } = useAppSelector(state => state.companyDetails)
    const { t } = useTranslation()
    const { isMobile } = useResponsive()

    const column: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: 'index',
        },
        {
            xs: 0.3,
            title: t("Foydalanuvchi"),
            dataIndex: 'user_name',
        },
        {
            xs: 0.3,
            title: t("Sana"),
            dataIndex: 'date',
        },
        {
            xs: 0.3,
            title: t("Telefon raqam"),
            dataIndex: 'user_phone'
        }
    ]

    return (
        <Box sx={{ display: 'flex', width: "auto", gap: '15px', mt: 3, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '20px' }}>{"So'nggi faolliklar"}</Typography>
            <DataTable
                minWidth={"500px"}
                loading={isGettingLogs}
                columns={column}
                data={logs?.data || []}
            />
        </Box>
    )
}