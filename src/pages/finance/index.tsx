// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CardStatisticsLiveVisitors from 'src/views/ui/cards/statistics/CardStatisticsLiveVisitors'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import GroupFinanceTable from 'src/views/apps/finance/GroupTable'
import IconifyIcon from 'src/@core/components/icon'
import 'react-datepicker/dist/react-datepicker.css'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { customTableDataProps } from 'src/@core/components/lid-table'
import DataTable from 'src/@core/components/table'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'
import FinanceCategories from 'src/views/apps/finance/FinanceCategories'
import { formatCurrency } from 'src/@core/utils/format-currency'
import EmptyContent from 'src/@core/components/empty-content'
import { getMonthFullName } from 'src/@core/utils/gwt-month-name'
import Router from 'next/router'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import StatsPaymentMethods from 'src/views/apps/finance/StatsPaymentMethods'
import FinanceAllNumber from 'src/views/apps/finance/FinanceAllNumber'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import HeadingFilter from 'src/views/apps/finance/HeadingFilter'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getExpenseCategories } from 'src/store/apps/finance'
import getMonthName from 'src/@core/utils/getMonthName'
import { AuthContext } from 'src/context/AuthContext'
import useResponsive from 'src/@core/hooks/useResponsive'


export function formatDateString(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

const CardStatistics = () => {
    const { t } = useTranslation()
    const [nameVal, setNameVal] = useState<string>('');
    const [open, setOpen] = useState<'create' | null>(null);
    const { categoriesData, groupsFinance, allNumbersParams, isGettingGroupsFinance } = useAppSelector(state => state.finance)
    const { user } = useContext(AuthContext)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteCategory, setDeleteCategory] = useState<any>(null)
    const [salaries, setSalaries] = useState<any>([])
    const { isMobile } = useResponsive()

    const withdrawCol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index",
        },
        {
            xs: 0.07,
            title: t("Yil"),
            dataIndex: "date",
            render: (date) => `${date.split('-')[0]}`
        },
        {
            xs: 0.07,
            title: t("Oy"),
            dataIndex: "month",
            render: (date) => getMonthFullName(+date?.split('-')[1])
        },
        {
            xs: 0.16,
            title: t("Jami xodimlar"),
            dataIndex: "employee_count",
            render: (employee_count) => `${employee_count || 0} ta`
        },
        {
            xs: 0.2,
            title: t("O'zgarmas oyliklar"),
            dataIndex: 'fixed_salaries',
            render: (fixed_salaries) => `${formatCurrency(fixed_salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("Bonuslar"),
            dataIndex: 'bonus_amount',
            render: (kpi_salaries) => `${formatCurrency(kpi_salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("Jarimalar"),
            dataIndex: 'fine_amount',
            render: (kpi_salaries) => `${formatCurrency(kpi_salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("Avanslar"),
            dataIndex: 'prepayments',
            render: (kpi_salaries) => `${formatCurrency(kpi_salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("Jami foizda (%)"),
            dataIndex: 'kpi_salaries',
            render: (kpi_salaries) => `${formatCurrency(kpi_salaries)}  so'm`
        },
        {
            xs: 0.2,
            title: t("Jami oyliklar"),
            dataIndex: 'salaries',
            render: (salaries) => `${formatCurrency(salaries)} so'm`
        },
        {
            xs: 0.3,
            title: t("Holati"),
            dataIndex: 'status',
            render: (status) => status == "in_progress" ? <Chip color="info" label={t("Jarayonda")} size="small" />
                : status == "approved" ? <Chip color="success" label={t("Tasdiqlangan")} size="small" />
                    : status == "frozen" ? <Chip color="warning" label={t("Vaqtincha saqlangan")} size="small" /> :
                        <Chip color="error" label={t("Tasdiqlanmagan")} size="small" />
        },
        {
            xs: 0.2,
            title: t("Kassir"),
            dataIndex: 'casher',
        },
        {
            xs: 0.2,
            title: t("Tahrirlangan sana"),
            dataIndex: 'checked_date',
            render: (date) => date?.split('-').reverse().join('/')
        },
    ]

    const createExpenseCategroy = async () => {
        setLoading(true)
        try {
            await api.post(`common/finance/expense-category/create/`, { name: nameVal })
            setOpen(null)
            dispatch(getExpenseCategories(""))
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const getSalaries = async () => {
        const resp = await api.get(`common/finance/monthly-report/`)
        setSalaries(resp.data)
    }

    const confirmDeleteCategory = async () => {
        setLoading(true)
        try {
            await api.patch(`/common/finance/expense-category/update/${deleteCategory}/`, { is_active: false })
            setDeleteCategory(null)
            dispatch(getExpenseCategories(""))
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const clickSalaryDetail = (id: number) => {
        const date = salaries.find((el: any) => el.id === id)
        Router.push(`/finance/salary-detail/${date.date}`)
    }


    useEffect(() => {
        Promise.all([
            getSalaries()
        ])
    }, [])

    const groupsFilterTitle = user?.branches?.find(item => item.id == allNumbersParams.branch)

    return (
        <ApexChartWrapper>
            <Box sx={{ display: "flex", mb: 1, alignItems: "center", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row" }}>
                <HeadingFilter />
                <VideoHeader item={videoUrls.finance} />
            </Box>
            <KeenSliderWrapper>
                <Grid container spacing={4} columnSpacing={6}>
                    <Grid item xs={12}>
                        <FinanceAllNumber />
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                        <StatsPaymentMethods />
                    </Grid>
                    <Grid item xs={12} md={8} mb={10}>
                        <CardStatisticsLiveVisitors />
                    </Grid>

                    <div id='tushumlar'></div>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '20px' }}>
                            {t("Guruh to'lovlari")}{"  "}
                            {allNumbersParams.start_date ? (
                                (`(${allNumbersParams?.start_date}/${allNumbersParams.end_date}  ${groupsFilterTitle?.name || t("Barcha filiallar")})`)
                            ) : (
                                `(${allNumbersParams?.date_year.slice(0, 4)}-yil ${getMonthName(allNumbersParams?.date_month)} ${groupsFilterTitle?.name || t("Barcha filiallar")})`
                            )}
                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={12} mb={10} sx={{ position: "relative" }}>
                        {isGettingGroupsFinance && <Box sx={{ position: "absolute", borderRadius: "10px", bgcolor: "rgba(0,0,0,0.1)", top: "16px", left: "24px", right: 0, bottom: 0 }}><SubLoader /></Box>}
                        {groupsFinance ? <GroupFinanceTable data={groupsFinance} /> : <EmptyContent />}
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Chiqimlar hisoboti')}</Typography>
                            <Button variant='contained' onClick={() => setOpen('create')}>+ {t("Bo'lim")}</Button>
                        </Box>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        {categoriesData?.length ? <FinanceCategories deleteCategory={deleteCategory} categryData={categoriesData} confirmDeleteCategory={confirmDeleteCategory} loading={loading} setDeleteCategory={setDeleteCategory} /> : <EmptyContent />}
                    </Grid>

                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Oyliklar hisoboti')}</Typography>
                            {/* <Link href='/finance/salary-confirm' >
                                <Button variant='contained'>{t("Oylik ishlash")}</Button>
                            </Link> */}
                        </Box>
                        <DataTable maxWidth='100%' minWidth='800px' columns={withdrawCol} data={salaries} rowClick={clickSalaryDetail} />
                    </Grid>
                </Grid>
            </KeenSliderWrapper>




            <Dialog open={open === 'create'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>{t("Xarajatlar bo'limini yaratish")}</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField required autoComplete='off' size='small' placeholder={t("Bo'lim nomi")} fullWidth onChange={(e) => setNameVal(e.target.value)} />
                    <LoadingButton loading={loading} onClick={() => createExpenseCategroy()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>
            </Dialog>
        </ApexChartWrapper >
    )
}


export default CardStatistics
