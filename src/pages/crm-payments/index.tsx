import { Box, Button, Chip, IconButton, Pagination, Stack, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import DataTable, { customTableDataProps } from 'src/@core/components/table';
import { formatCurrency } from 'src/@core/utils/format-currency';
import UserIcon from 'src/layouts/components/UserIcon';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchClientSideTariffs, fetchCRMPayments, handleOpenClientModal, updateClientParams } from 'src/store/apps/c-panel';
import CreatePayment from 'src/views/apps/crm-payments/CreatePayment';
import EditPaymentClientModal from 'src/views/apps/crm-payments/EditPaymentClientModal';
import RowOptions from 'src/views/apps/crm-payments/RowOptions';
import authConfig from 'src/configs/auth';


export default function PaymentsList() {
    const { t } = useTranslation()
    const { clientOwnPayments, isGettingOwnPayments, clientQueryParams } = useAppSelector(state => state.cPanelSlice)
    const dispatch = useAppDispatch()
    const router = useRouter()

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
                <span style={{ color: "#22d3ee", marginRight: "5px" }}>{item.month_count} {t("oylik")}</span>
                <span style={{ color: "#f59e0b", marginRight: "5px" }}>({formatCurrency(item.amount)} so'm)</span>
                <span style={{ color: "#84cc16" }}>({item.min_count}-{item.max_count} {t("ta o'quvchi")})</span>
            </div>)
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
            title: t("Holati"),
            dataIndex: 'status',
            render: (status) => status == "moderation" ? <Chip label={t("Tasdiqlanmagan")} size="small" />
                : status == "approved" ? <Chip color="success" label={t("Qabul qilindi")} size="small" />
                    : <Chip color="error" label={t("Bekor qilindi")} size="small" />
        },
        {
            xs: 0.1,
            title: "",
            dataIndex: 'id',
            render: (id) => {
                const found = clientOwnPayments?.results.find(item => item.id == Number(id))
                if (found?.status == "moderation") {
                    return <RowOptions id={id} />
                }
            }
        },
    ]

    useEffect(() => {
        (async function () {
            await Promise.all([
                dispatch(fetchCRMPayments()),
                dispatch(fetchClientSideTariffs())
            ])
        })()
    }, [])

    const handlePagination = async (page: number) => {
        const queryString = new URLSearchParams({ ...clientQueryParams, page: String(page) }).toString();
        dispatch(updateClientParams({ page: page }))
        await dispatch(fetchCRMPayments(queryString))
    }


    const handleLogout = () => {
        const userData = JSON.parse(localStorage.getItem("userData") as string)
        if (userData.payment_page) {
            window.localStorage.removeItem('userData')
            window.localStorage.removeItem(authConfig.storageTokenKeyName)
            router.push('/login')
        } else router.back()
    }


    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" alignItems={"center"} spacing={4}>
                        <IconButton color='primary'>
                            <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={() => handleLogout()} />
                        </IconButton>
                        <Typography variant='h6'>{t("O'quv markaz to'lovlari")}</Typography>
                        <Chip size='medium' sx={{ borderRadius: "5px" }} icon={
                            <Tooltip arrow title="Platforma uchun to'lovni o'ng tomondagi To'lov qilish tugmasini bosish orqali markazga mos tushuvchi tariflardan birini tanlab ushbu karta raqamga qilingan to'lov chekini yuboring (Axmadaliyeva Roxatoy)">
                                <IconButton size='small'>
                                    <UserIcon fontSize={20} icon={"bitcoin-icons:question-circle-filled"} />
                                </IconButton>
                            </Tooltip>} label="5614 6816 0913 8700" color="primary" variant="outlined" />
                        <Chip size='medium' sx={{ borderRadius: "5px" }} label={clientOwnPayments?.is_demo ? `Demo tugash vaqti : ${clientOwnPayments?.expiration_date}` : `Keyingi to'lov vaqti : ${clientOwnPayments?.expiration_date}`} color="warning" variant="outlined" />
                    </Stack>
                    <Button onClick={() => dispatch(handleOpenClientModal(true))} color='primary' variant="contained">{t("To'lov qilish")}</Button>
                </Box>
                <DataTable
                    loading={isGettingOwnPayments}
                    columns={column}
                    data={clientOwnPayments?.results || []}
                />
                {clientOwnPayments &&
                    clientOwnPayments?.count > 10 &&
                    !isGettingOwnPayments &&
                    <Pagination
                        defaultPage={clientQueryParams?.page || 1}
                        count={Math.ceil(clientOwnPayments?.count / 10)}
                        variant="outlined"
                        shape="rounded"
                        onChange={(e: any, page) => handlePagination(page)}
                    />}
            </Box>
            <CreatePayment />
            <EditPaymentClientModal />
        </Box >
    )
}
