// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CardStatsType } from 'src/@fake-db/types'

// ** Demo Components Imports
import CardStatisticsHorizontal from 'src/views/ui/cards/statistics/CardStatisticsHorizontal'
import CardStatisticsLiveVisitors from 'src/views/ui/cards/statistics/CardStatisticsLiveVisitors'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Box, Button, Dialog, DialogContent, DialogTitle, Skeleton, TextField, Typography } from '@mui/material'
import GroupFinanceTable from 'src/views/apps/finance/GroupTable'
import IconifyIcon from 'src/@core/components/icon'
import 'react-datepicker/dist/react-datepicker.css';
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
import { DateRangePicker, SelectPicker, Stack } from 'rsuite'
import StatsPaymentMethods from 'src/views/apps/finance/StatsPaymentMethods'
import { today } from 'src/@core/components/card-statistics/kanban-item'

const yearItems = [{ label: 2021, value: 2021 }, ...Array(new Date().getFullYear() - 2021).fill(1).map((item, index) => ({ label: 2021 + index + 1, value: 2021 + index + 1 }))]
const monthItems = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'].map((el, i) => ({ label: el, value: (i + 1) < 10 ? `0${i + 1}` : `${i + 1}` }))


export function formatDateString(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

interface AllNumbersType {
    benefit: string,
    expense: string,
    difference: string,
}

const CardStatistics = () => {

    const { t } = useTranslation()

    const [nameVal, setNameVal] = useState<string>('');
    const [open, setOpen] = useState<'create' | null>(null);
    const [label, setLabel] = useState<AllNumbersType>({
        benefit: '0',
        expense: '0',
        difference: '0',
    }
    );


    const [graphData, setGraphData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categryData, setCategryData] = useState<any>([]);

    const [groupPays, setGropPays] = useState<any>(null);

    const [deleteCategory, setDeleteCategory] = useState<any>(null)
    const [salaries, setSalaries] = useState<any>([])
    const [date, setDate] = useState<any>('')
    const [numbersLoad, setNumbersLoad] = useState<boolean>(false)
    const [paymentMenthods, setPaymentMethods] = useState<any[]>([])
    const [year, setYear] = useState<number | string>(new Date().getFullYear())
    const [month, setMonth] = useState<number | string>(today.split('-')[1])

    const apiData: CardStatsType = {
        statsHorizontal: [
            {
                color: 'warning',
                stats: label.benefit,
                trend: 'negative',
                icon: 'hugeicons:money-receive-flow-02',
                trendNumber: '12.6%',
                title: t('Tushumlar'),
                id: '#tushumlar'
            },
            {
                stats: label.expense,
                color: 'error',
                icon: 'hugeicons:money-send-flow-02',
                trendNumber: '22.5%',
                title: t('Chiqimlar'),
                id: '#chiqimlar'
            },
            {
                color: Number(label.difference) < 0 ? 'error' : 'success',
                stats: label.difference,
                trend: Number(label.difference) < 0 ? 'negative' : 'positive',
                icon: Number(label.difference) < 0 ? 'mdi:trending-down' : 'mdi:trending-up',
                trendNumber: '12.6%',
                title: t("Foyda"),
                id: '#tushumlar'
            }
        ],
        statsVertical: [],
        statsCharacter: []
    }

    const withdrawCol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index",
        },
        {
            xs: 0.1,
            title: t("Yil"),
            dataIndex: "date",
            render: (date) => `${date.split('-')[0]}`
        },
        {
            xs: 0.1,
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
            title: t("Jami oyliklar"),
            dataIndex: 'salaries',
            render: (salaries) => `${formatCurrency(salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("O'zgarmas oyliklar"),
            dataIndex: 'fixed_salaries',
            render: (fixed_salaries) => `${formatCurrency(fixed_salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("Jami foiz (%)"),
            dataIndex: 'kpi_salaries',
            render: (kpi_salaries) => `${formatCurrency(kpi_salaries)} so'm`
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

    const getAllNumbers = async (date?: string) => {
        setNumbersLoad(true)
        const resp = await api.get(`common/finance/dashboard/?${date ? date : ''}`)
        setLabel(resp.data.label)
        setGraphData({
            data: [
                {
                    name: 'Chiqimlar',
                    data: Object.values(resp.data.expense),
                }, {
                    name: 'Tushumlar',
                    data: Object.values(resp.data.benefit),
                }, {
                    name: 'Foyda',
                    data: Object.values(resp.data.difference),
                }
            ],
            year: resp.data.year
        })
        setPaymentMethods(resp.data?.payment_types?.map((el: any) => ({ ...el, data: el.amount })))
        setNumbersLoad(false)
    }

    const getExpenseCategroy = async () => {
        const resp = await api.get(`common/finance/expense-category/list/`)
        setCategryData(resp.data?.results)
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

    const handleChangeDate = async (e: any) => {
        setYear('')
        if (e) {
            await getAllNumbers(`start_date=${formatDateString(e[0])}&end_date=${formatDateString(e[1])}`)
            setMonth('')
        } else {
            setYear(new Date().getFullYear())
            await getAllNumbers(`date_year=${new Date().getFullYear()}-01-01`)

        }
        setDate(e)
    }

    const handleYearDate = async (value: any, t: 'm' | 'y') => {
        setDate('')
        if (!value) {
            if (t === 'm') {
                setMonth('')
                await getAllNumbers(`date_year=${year}-01-01`)
            } else {
                setYear(new Date().getFullYear())
                await getAllNumbers(`date_year=${new Date().getFullYear()}-01-01&date_month=${month}`)
            }
            return
        }
        if (Number(value) > 100) {
            setYear(value)
            await getAllNumbers(`date_year=${value}-01-01`)
        } else {
            setMonth(value)
            await getAllNumbers(`date_year=${year || new Date().getFullYear()}-01-01&date_month=${value}`)
        }
    }


    useEffect(() => {
        Promise.all([
            getAllNumbers(`date_year=${year}-01-01&date_month=${month}`),
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
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: 1 }}>
                            <Typography sx={{ flexGrow: 1 }} variant="h5">{t('Umumiy raqamlar')}</Typography>
                            <SelectPicker
                                onChange={(v) => handleYearDate(v, 'y')}
                                size='sm'
                                data={yearItems}
                                style={{ width: 224 }}
                                value={year}
                                searchable={false}
                                placeholder="Yilni tanlang"
                            />
                            <SelectPicker
                                onChange={(v) => handleYearDate(v, 'm')}
                                size='sm'
                                data={monthItems}
                                style={{ width: 224 }}
                                value={month}
                                searchable={false}
                                placeholder="Oyni tanlang"
                            />
                            <DateRangePicker showOneCalendar placement="bottomEnd" locale={{
                                last7Days: "Oxirgi hafta",
                                sunday: "Yak",
                                monday: "Du",
                                tuesday: "Se",
                                wednesday: "Cho",
                                thursday: "Pa",
                                friday: "Ju",
                                saturday: "Sha",
                                ok: "Ok",
                                today: "Bugun",
                                yesterday: "Ertaga",
                                hours: "Soat",
                                minutes: "Minut",
                                seconds: "Sekund",
                            }}
                                format="yyyy-MM-dd"
                                onChange={handleChangeDate}
                                translate={'yes'}
                                size="sm"
                                value={date}
                            />
                        </Box>
                        {
                            numbersLoad ? <Grid container spacing={7}>
                                {
                                    [1, 2, 3].map((_, index) => (
                                        <Grid item xs={12} md={4} key={index}>
                                            <Skeleton
                                                variant="rounded"
                                                width={'100%'}
                                                height={'80px'}
                                                style={{ borderRadius: '10px' }}
                                                animation="wave"
                                            />
                                        </Grid>
                                    ))
                                }
                            </Grid>
                                : <CardStatisticsHorizontal data={apiData.statsHorizontal} />
                        }
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                        <StatsPaymentMethods loading={numbersLoad} data={paymentMenthods} />
                    </Grid>

                    <Grid item xs={12} md={8} mb={10}>
                        <CardStatisticsLiveVisitors year={graphData?.year} loading={numbersLoad} data={graphData?.data} />
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
