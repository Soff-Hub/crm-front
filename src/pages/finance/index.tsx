// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CardStatisticsLiveVisitors from 'src/views/ui/cards/statistics/CardStatisticsLiveVisitors'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import GroupFinanceTable from 'src/views/apps/finance/GroupTable'
import IconifyIcon from 'src/@core/components/icon'
import 'react-datepicker/dist/react-datepicker.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { customTableDataProps } from 'src/@core/components/lid-table'
import DataTable from 'src/@core/components/table'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'
import Link from 'next/link'
import FinanceCategories from 'src/views/apps/finance/FinanceCategories'
import { formatCurrency } from 'src/@core/utils/format-currency'
import EmptyContent from 'src/@core/components/empty-content'
import { getMonthFullName } from 'src/@core/utils/gwt-month-name'
import Router from 'next/router'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import StatsPaymentMethods from 'src/views/apps/finance/StatsPaymentMethods'
import FinanceAllNumber from 'src/views/apps/finance/FinanceAllNumber'


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


    const [loading, setLoading] = useState<boolean>(false);
    const [categryData, setCategryData] = useState<any>([]);

    const [groupPays, setGropPays] = useState<any>(null);

    const [deleteCategory, setDeleteCategory] = useState<any>(null)
    const [salaries, setSalaries] = useState<any>([])

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
            render: (date) => getMonthFullName(+date.split('-')[1])
        },
        {
            xs: 0.16,
            title: t("Jami xodimlar"),
            dataIndex: "employee_count",
            render: (employee_count) => `${employee_count} ta`
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
            title: t("Jami foiz (%)"),
            dataIndex: 'kpi_salaries',
            render: (kpi_salaries) => `${formatCurrency(kpi_salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("Jami oyliklar"),
            dataIndex: 'salaries',
            render: (salaries) => `${formatCurrency(salaries)} so'm`
        },
        // {
        //     xs: 0.15,
        //     title: t("Avanslar"),
        //     dataIndex: 'index',
        //     render: () => "5 400 000"
        // },
        {
            xs: 0.2,
            title: t("Kassir"),
            dataIndex: 'casher',
        },
        {
            xs: 0.2,
            title: t("Tasdiqlangan sana"),
            dataIndex: 'date',
            render: (date) => date.split('-').reverse().join('/')
        },
    ]

    const getExpenseCategroy = async () => {
        const resp = await api.get(`common/finance/expense-category/list/`)
        setCategryData(resp.data)
    }

    const createExpenseCategroy = async () => {
        setLoading(true)
        try {
            await api.post(`common/finance/expense-category/create/`, { name: nameVal })
            setOpen(null)
            getExpenseCategroy()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const getGroupPays = async (date: string) => {
        setLoading(true)
        const resp = await api.get(`/common/finance/group-payments/?date=${date}-01`)
        setGropPays({ ...resp.data, date })
        setLoading(false)
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
            getExpenseCategroy()
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
            getExpenseCategroy(),
            getSalaries(),
            getGroupPays(`${new Date().getFullYear()}-${Number(new Date().getMonth()) + 1 < 10 ? "0" + (1 + new Date().getMonth()) : new Date().getMonth() + 1}`)
        ])
    }, [])

    return (
        <ApexChartWrapper>
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
                        <Typography sx={{ fontSize: '20px' }}>{t("Guruh to'lovlari")}</Typography>
                    </Grid>

                    <Grid item xs={12} md={12} mb={10}>
                        {loading ? <SubLoader /> : groupPays ? <GroupFinanceTable data={groupPays} updateData={getGroupPays} /> : <EmptyContent />}
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Chiqimlar hisoboti')}</Typography>
                            <Button variant='contained' onClick={() => setOpen('create')}>+ {t("Bo'lim")}</Button>
                        </Box>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        {categryData?.length ? <FinanceCategories deleteCategory={deleteCategory} categryData={categryData} confirmDeleteCategory={confirmDeleteCategory} loading={loading} setDeleteCategory={setDeleteCategory} /> : <EmptyContent />}
                    </Grid>

                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Oyliklar hisoboti')}</Typography>
                            <Link href='/finance/salary-confirm' >
                                <Button variant='contained'>{t("Oylik ishlash")}</Button>
                            </Link>
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
        </ApexChartWrapper>
    )
}


export default CardStatistics
