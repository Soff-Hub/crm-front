import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DataTable, { customTableDataProps } from '../../table';
import useResponsive from 'src/@core/hooks/useResponsive';
import { formatCurrency } from 'src/@core/utils/format-currency';
import Link from 'next/link';
import { useAppSelector } from 'src/store';

type Props = {}

export default function CompanyPaymentList({ }: Props) {
    const { isGettingPayments, payments } = useAppSelector(state => state.companyDetails)
    const { t } = useTranslation()
    const { isMobile } = useResponsive()


    const column: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: 'index',
        },
        {
            xs: 0.4,
            title: t("Tarif"),
            dataIndex: 'tariff_data',
            render: (item: any) => (<div>
                <span style={{ color: "#22d3ee", marginRight: "5px" }}>{item.month_count} {t("oylik")}</span><br />
                <span style={{ color: "#f59e0b", marginRight: "5px" }}>({formatCurrency(item.amount)} so'm)</span><br />
                <span style={{ color: "#84cc16" }}>({item.min_count}-{item.max_count} {t("ta o'quvchi")})</span>
            </div>)
        },
        {
            xs: 0.3,
            title: t("Chek"),
            dataIndex: 'receipt',
            render: (chek) => <Link href={chek} target="_blank">
                {t("Chekni ko'rish")}
            </Link>
        },
        {
            xs: 0.3,
            title: t("Sana"),
            dataIndex: 'date',
            render: (date) => date
        },
        {
            xs: 0.3,
            title: t("Izoh"),
            dataIndex: 'description'
        },
        {
            xs: 0.3,
            title: t("To'lov holati"),
            dataIndex: 'status',
            render: (status) => status == "moderation" ? <Chip label={t("Tasdiqlanmagan")} size="small" />
                : status == "approved" ? <Chip color="success" label={t("Qabul qilindi")} size="small" />
                    : <Chip color="error" label={t("Bekor qilindi")} size="small" />
        },
    ]

    return (
        <Box sx={{ display: 'flex', width: "auto", gap: '15px', mt: 3, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '20px' }}>{"To'lovlar tarixi"}</Typography>
            <DataTable
                minWidth={"500px"}
                loading={isGettingPayments}
                columns={column}
                data={payments?.results || []}
            />
        </Box>
    )
}