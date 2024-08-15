import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customTableProps } from 'src/pages/groups';
import DataTable from '../../table';
import useResponsive from 'src/@core/hooks/useResponsive';

type Props = {}

export default function CompanyPaymentList({ }: Props) {

    const { t } = useTranslation()
    const [loading, setLoading] = useState<any>(null)
    const { isMobile } = useResponsive()


    const [data, setData] = useState<any>([
        {
            id: 1,
            created_at: "12.12.2024",
            amount: 500000
        },
        {
            id: 1,
            created_at: "12.12.2024",
            amount: 500000
        }
    ])

    const columns: customTableProps[] = [
        {
            xs: 0.1,
            title: t("ID"),
            dataIndex: 'index'
        },
        {
            xs: 0.5,
            title: t("Sana"),
            dataIndex: 'created_at',
            // render: (date: string) => formatDateTime(date)
        },
        {
            xs: 0.4,
            title: t("Summa"),
            dataIndex: 'amount',
            // render: (amount: any) => `${formatCurrency(amount)} UZS`
        },
        // {
        //     xs: 1,
        //     title: t("Izoh"),
        //     dataIndex: 'description',
        // },
        // {
        //     xs: 1,
        //     title: t("Qabul qildi"),
        //     dataIndex: 'admin',
        // },
        // {
        //     xs: 1,
        //     title: t("Amallar"),
        //     dataIndex: 'id',
        //     render: (id) => (
        //         <Box sx={{ display: 'flex', gap: '10px' }}>
        //             {loading === id ? <IconifyIcon icon={'la:spinner'} fontSize={20} /> : <IconifyIcon onClick={() => getReceipt(id)} icon={`ph:receipt-light`} fontSize={20} />}
        //         </Box>
        //     )
        // }
    ]


    return (
        <Box sx={{ display: 'flex', gap: '15px', mt: 3, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '20px' }}>{"To'lovlar tarixi"}</Typography>
            <DataTable minWidth={isMobile ? '300px' : '400px'} data={data} columns={columns} />
        </Box>
    )
}