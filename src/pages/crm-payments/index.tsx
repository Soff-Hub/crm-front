import { Box, Button, Chip, IconButton, Pagination, Stack, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import DataTable, { customTableDataProps } from 'src/@core/components/table';
import { formatCurrency } from 'src/@core/utils/format-currency';
import UserIcon from 'src/layouts/components/UserIcon';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchClientSideTariffs, fetchCRMPayments, fetchSMSTariffs, handleOpenClientModal, handleOpenClientSMSModal, updateClientParams } from 'src/store/apps/c-panel';
import CreatePayment from 'src/views/apps/crm-payments/CreatePayment';
import EditPaymentClientModal from 'src/views/apps/crm-payments/EditPaymentClientModal';
import RowOptions from 'src/views/apps/crm-payments/RowOptions';
import authConfig from 'src/configs/auth';
import CreateSMSPayment from 'src/views/apps/crm-payments/CreateSMSPayment';
import EditSMSPaymentClientModal from 'src/views/apps/crm-payments/EditSMSPayment';
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header';
import useResponsive from 'src/@core/hooks/useResponsive';
import { AuthContext } from 'src/context/AuthContext';
import { toast } from 'react-hot-toast';


export default function PaymentsList() {
    const { t } = useTranslation()
    const { clientOwnPayments, isGettingOwnPayments, clientQueryParams } = useAppSelector(state => state.cPanelSlice)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { user } = useContext(AuthContext)
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
            dataIndex: 'id',
            render: (item: any) => {
                const found = clientOwnPayments?.results.find(payment => payment.id == item)
                if (found?.tariff) {
                    return (
                        <div>
                            <span style={{ color: "#22d3ee", marginRight: "5px" }}>{found?.tariff_data?.month_count} {t("oylik")}</span>
                            <span style={{ color: "#f59e0b", marginRight: "5px" }}>({formatCurrency(found?.tariff_data?.amount)} so'm)</span>
                            <span style={{ color: "#84cc16" }}>({found?.tariff_data?.min_count}-{found?.tariff_data?.max_count} {t("ta o'quvchi")})</span>
                        </div>)
                } else {
                    return (
                        <div>
                            <span style={{ color: "#84cc16" }}>({found?.sms_data?.sms_count} {t("SMS")})</span>{" "}
                            <span style={{ color: "#f59e0b", marginRight: "5px" }}>({formatCurrency(found?.sms_data?.amount)} so'm)</span>
                        </div>)
                }
            }
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
            render: (status) => status == "moderation" ? <Chip label={t("Tekshirilmoqda")} size="small" />
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
        if (!user?.role.includes('ceo') && !user?.role.includes('admin') && !user?.role.includes('casher')) {
            router.push("/")
            toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
        }
        (async function () {
            await Promise.all([
                dispatch(fetchCRMPayments()),
                dispatch(fetchClientSideTariffs()),
                dispatch(fetchSMSTariffs())
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
                <VideoHeader item={videoUrls.crm_setting} />
                <Box sx={{ display: isMobile ? "grid" : 'flex', gridTemplateColumns: "1fr", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
                    <Stack direction="row" alignItems={"center"} spacing={isMobile ? 2 : 4}>
                        <IconButton color='primary'>
                            <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={() => handleLogout()} />
                        </IconButton>
                        <Typography variant='h6'>{t("O'quv markaz to'lovlari")}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconifyIcon color='orange' icon={'fa-solid:sms'} style={{ cursor: 'pointer' }} />
                            {clientOwnPayments?.sms_data}
                        </Box>
                    </Stack>
                    <Stack display={isMobile ? "grid" : "flex"} direction={"row"} alignItems={"center"} gap="15px">
                        <Chip sx={{ borderRadius: "8px", height: "30px" }} size='small' label={clientOwnPayments?.is_demo ? `${t("Demo tugash vaqti")} : ${clientOwnPayments?.expiration_date}` : `${t("Keyingi to'lov vaqti")} : ${clientOwnPayments?.expiration_date}`} color="error" variant="outlined" />
                        <Chip size='small' sx={{ borderRadius: "8px", height: "30px" }} icon={
                            <Tooltip arrow title="Platforma uchun to'lov hamda qo'shimcha SMS paket olish  uchun to'lovlarni o'ng tomonda joylashgan To'lov qilish yoki SMS paket olish tugmasini bosish orqali markazga mos tushuvchi tariflardan birini tanlab ushbu karta raqamga qilingan to'lov chekini yuboring (Axmadaliyeva Roxatoy)">
                                <IconButton size='small'>
                                    <UserIcon fontSize={20} icon={"bitcoin-icons:question-circle-filled"} />
                                </IconButton>
                            </Tooltip>} label="5614 6816 0913 8700" color="warning" variant="outlined" />
                        <Button size="small" onClick={() => dispatch(handleOpenClientSMSModal(true))} color='primary' variant="outlined">{t("SMS paket uchun to'lov")}</Button>
                        <Button size="small" onClick={() => dispatch(handleOpenClientModal(true))} color='primary' variant="contained">{t("Tarif uchun to'lov")}</Button>
                    </Stack>
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
            <CreateSMSPayment />
            <EditPaymentClientModal />
            <EditSMSPaymentClientModal />
        </Box >
    )
}
