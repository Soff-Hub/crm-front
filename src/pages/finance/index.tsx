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
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import GroupFinanceTable from 'src/views/apps/finance/GroupTable'
import { formatCurrency } from 'src/@core/utils/format-currency'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { forwardRef, useEffect, useRef, useState } from 'react'
import { addDays, format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { customTableDataProps } from 'src/@core/components/lid-table'
import DataTable from 'src/@core/components/table'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'
import CardFinanceCategory from 'src/@core/components/card-statistics/card-finance-category'


type DateType = Date

interface PickerProps {
    label?: string;
    end: Date | number;
    start: Date | number;
}

interface AllNumbersType {
    last_month_benefit: string,
    last_year_benefit: string,
    last_month_expense: string,
    last_year_expense: string
}

const CardStatistics = () => {

    const { push } = useRouter()
    const { t } = useTranslation()

    const [startDateRange, setStartDateRange] = useState<DateType>(new Date());
    const [endDateRange, setEndDateRange] = useState<DateType>(addDays(new Date(), 45));
    const [nameVal, setNameVal] = useState<string>('');
    const [open, setOpen] = useState<'create' | null>(null);
    const [label, setLabel] = useState<AllNumbersType>({
        last_month_benefit: '0',
        last_year_benefit: '0',
        last_month_expense: '0',
        last_year_expense: '0'
    }
    );
    const [graphData, setGraphData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categryData, setCategryData] = useState<any>([]);

    const handleOnChangeRange = (dates: any) => {
        const [start, end] = dates;
        setStartDateRange(start);
        setEndDateRange(end);
    };

    const CustomInput = forwardRef((props: PickerProps, ref) => {
        const startDate = format(props?.start || new Date(), 'MM/dd/yyyy')
        const endDate = props.end !== null ? format(props.end, 'MM/dd/yyyy') : '';

        const value = `${startDate}${endDate !== '' ? '-' + endDate : ''}`;

        return <TextField size='small' inputRef={ref} label={props.label || ''} {...props} value={value} />;
    });

    const CustomInputDate = forwardRef((props: PickerProps, ref) => {
        const startDate = format(props?.start || new Date(), 'MM/dd/yyyy')

        const value = `${startDate}`;

        return <TextField size='small' inputRef={ref} label={props.label || ''} {...props} value={value} />;
    });

    const apiData: CardStatsType = {
        statsHorizontal: [
            {
                color: 'success',
                stats: label.last_month_benefit,
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: 'Tushum (oxirgi oy)',
                id: '#tushumlar'
            },
            {
                stats: label.last_month_expense,
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: 'Chiqim (oxirgi oy)',
                id: '#chiqimlar'
            },
            {
                color: 'success',
                stats: label.last_year_benefit,
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: 'Tushum (oxirgi yil)',
                id: '#tushumlar'
            },
            {
                stats: label.last_year_expense,
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: 'Chiqim (oxirgi yil)',
                id: '#chiqimlar'
            }
        ],
        statsVertical: [
            {
                stats: formatCurrency(3000000),
                color: 'warning',
                icon: 'tdesign:money',
                title: 'Marketing',
            }
        ],
        statsCharacter: []
    }

    const [firstClickTime, setFirstClickTime] = useState<any>(null);
    const secondClickTimeRef = useRef(null);

    const handleEditable = () => {
        if (!firstClickTime) {
            setFirstClickTime(Date.now());
        } else {
            const secondClickTime = Date.now();
            const timeDifference = secondClickTime - firstClickTime;
            if (timeDifference < 300) {
                console.log('Biror matn chiqarish');
            }
            setFirstClickTime(null);
        }
    };


    const salaryCol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index"
        },
        {
            xs: 0.2,
            title: t("first_name"),
            dataIndex: "first_name"
        },
        {
            xs: 0.2,
            title: t("phone"),
            dataIndex: "phone"
        },
        {
            xs: 0.2,
            title: t("roles_list"),
            dataIndex: "roles_list",
            render: (roles_list: any) => roles_list.join(", ")
        }
    ]

    const data = [
        {
            id: "dasdasdasdasd",
            first_name: "John Doe",
            phone: "+998999999999",
            roles_list: ["Teacher", "Adminstrator"]
        }
    ]

    const getAllNumbers = async () => {
        const resp = await api.get(`common/finance/dashboard/`)
        setLabel(resp.data.label)
        const benefit = [
            {
                type: 'column',
                name: 'Tushumlar',
                data: Object.values(resp.data.benefit)
            }, {
                type: 'line',
                name: 'Tushumlar',
                data: Object.values(resp.data.benefit)
            }
        ]
        const expense = [
            {
                type: 'column',
                name: 'Chiqimlar',
                data: Object.values(resp.data.expense)
            }, {
                type: 'line',
                name: 'Chiqimlar',
                data: Object.values(resp.data.expense)
            }
        ]
        setGraphData({
            benefit,
            expense
        })
    }

    const getExpenseCategroy = async () => {
        const resp = await api.get(`common/finance/expense-category/list/`)
        setCategryData(resp.data?.results)
    }

    const createExpenseCategroy = async () => {
        setLoading(true)
        try {
            const resp = await api.post(`common/finance/expense-category/create/`, { name: nameVal })
            setOpen(null)
            getExpenseCategroy()
            console.log(resp.data)
        } catch (err) {
            console.log(err)
        } finally {
            console.log('finally');
            setLoading(false)
        }
    }

    const handleRow = (id: string) => {
        push(`/finance/salaries/${id}`)
    }

    useEffect(() => {
        getAllNumbers()
        getExpenseCategroy()
    }, [])


    return (
        <ApexChartWrapper>
            {/* <Box>
                <button onClick={handleEditable}>ffffffffffffffffffffffffffffffffffff</button>
            </Box> */}

            <KeenSliderWrapper>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography>Umumiy raqamlar</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <CardStatisticsHorizontal data={apiData.statsHorizontal} />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <CardStatisticsLiveVisitors data={graphData} />
                    </Grid>

                    <div id='tushumlar'></div>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '20px' }}>Guruh to'lovlari</Typography>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <GroupFinanceTable />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>Chiqimlar hisoboti</Typography>
                            <Button variant='contained' onClick={() => setOpen('create')}>+ {t("Bo'lim")}</Button>
                        </Box>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <Grid container spacing={6}>
                            {
                                categryData.map((_: any, index: any) => (
                                    <Grid item xs={12} sm={6} lg={2} key={index} onClick={() => push(`/finance/costs/${_.id}`)} sx={{ cursor: 'pointer' }}>
                                        <CardFinanceCategory title={_.name} stats={_.total_expense} icon={<IconifyIcon fontSize={"3rem"} icon={''} />} color={'warning'} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>Maoshlar hisoboti</Typography>
                            <Box>
                                <DatePicker
                                    monthsShown={1}
                                    startDate={startDateRange}
                                    shouldCloseOnSelect={false}
                                    id='date-range-picker-months'
                                    onChange={handleOnChangeRange}
                                    popperPlacement={'bottom-start'}
                                    customInput={
                                        <CustomInputDate
                                            label="Sana bo'yicha"
                                            end={endDateRange as Date | number}
                                            start={startDateRange as Date | number}
                                        />
                                    }
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <DataTable columns={salaryCol} rowClick={handleRow} data={data} />
                    </Grid>
                </Grid>
            </KeenSliderWrapper>




            <Dialog open={open === 'create'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>Xarajatlar bo'limini yaratish</Typography>
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
