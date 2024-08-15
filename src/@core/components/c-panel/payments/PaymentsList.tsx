import { Box, Button, Chip, Pagination, Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import DataTable, { customTableDataProps } from 'src/@core/components/table';
import { formatCurrency } from 'src/@core/utils/format-currency';
import UserIcon from 'src/layouts/components/UserIcon';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchCRMPayments, setOpenModal, updateClientParams } from 'src/store/apps/c-panel';
import TransitionsModal from './EditModal';



export default function PaymentsList() {
    const { t } = useTranslation()
    const { clientOwnPayments, clientQueryParams, isGettingOwnPayments } = useAppSelector(state => state.cPanelSlice)
    const dispatch = useAppDispatch()

    const column: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: 'index',
        },
        {
            xs: 0.4,
            title: t("Markaz"),
            dataIndex: 'tenant_data',
            render: (item: any) => <span>{item.name}</span>
        },
        {
            xs: 0.3,
            title: t("Summasi"),
            dataIndex: 'amount',
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.3,
            title: t("Chek"),
            dataIndex: 'receipt',
            render: (chek) => <Link href={chek} target="_blank"><Button
                component="label"
                role={undefined}
                size="small"
                variant="outlined"
                tabIndex={-1}
                startIcon={<UserIcon icon={"material-symbols:download"} />}
            >
                {t("Chekni ko'rish")}
            </Button>
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
        {
            xs: 0.1,
            title: t(""),
            dataIndex: 'id',
            render: (id) => (
                <>
                    <UserIcon onClick={() => dispatch(setOpenModal(id))} icon="lucide:edit" />
                    <TransitionsModal id={id} />
                </>)
        },
    ]

    const handlePagination = async (page: number) => {
        const queryString = new URLSearchParams({ ...clientQueryParams, page: String(page) }).toString();
        dispatch(updateClientParams({ page: page }))
        await dispatch(fetchCRMPayments(queryString))
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }
            } >
                <Typography variant='h6'>{t("CRM uchun to'lovlari")}</Typography>
                <DataTable
                    loading={isGettingOwnPayments}
                    columns={column}
                    data={clientOwnPayments?.results || []}
                />
            </Box >
            {clientOwnPayments &&
                clientOwnPayments?.count > 10 &&
                !isGettingOwnPayments &&
                <Pagination
                    defaultPage={clientQueryParams?.page || 1}
                    count={Math.ceil(clientOwnPayments?.count / 10)}
                    variant="outlined"
                    shape="rounded"
                    onChange={(e: any, page) => handlePagination(page)}
                />
            }
        </Box >
    )
}
