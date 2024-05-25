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
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
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
import { today } from 'src/@core/components/card-statistics/kanban-item'


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
    const [open, setOpen] = useState<'create' | 'add-salary' | 'edit-salary' | 'delete-salary' | null>(null);
    const [editId, setEditId] = useState<any>(null);
    const [label, setLabel] = useState<AllNumbersType>({
        last_month_benefit: '0',
        last_year_benefit: '0',
        last_month_expense: '0',
        last_year_expense: '0'
    }
    );
    const [salaryAmount, setSalaryAmount] = useState<any>('');
    const [salaryUser, setSalaryUser] = useState<any>('');
    const [salaryDate, setSalaryDate] = useState<any>(today);


    const [graphData, setGraphData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categryData, setCategryData] = useState<any>([]);

    const [groupPays, setGropPays] = useState<any>(null);
    const [employeeSalary, setEmployeeSalary] = useState<any>([]);
    const [employeePays, setEmployeePays] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([])



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


    const employeePaycol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index"
        },
        {
            xs: 0.4,
            title: t("first_name"),
            dataIndex: "employee_name"
        },
        {
            xs: 0.4,
            title: t("Maoshi"),
            dataIndex: "amount",
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.1,
            title: t("Tahrir"),
            dataIndex: "id",
            render: (id) => <IconifyIcon onClick={() => {
                const find = employeeSalary.find((el: any) => el.id === id)
                getEmployees()
                setEditId(find)
                setOpen('edit-salary')
            }} icon={'basil:edit-outline'} />
        },
        {
            xs: 0.1,
            title: t("O'chir"),
            dataIndex: "id",
            render: (id) => <IconifyIcon onClick={() => {
                const find = employeeSalary.find((el: any) => el.id === id)
                setEditId(find)
                setOpen('delete-salary')
            }} icon={'fluent:delete-20-regular'} />
        },
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

    const getGroupPays = async (date: string) => {
        const resp = await api.get(`/common/finance/group-payments/?date=${date}-01`)
        setGropPays(resp.data)
    }


    const getEmployeSalary = async () => {
        const resp = await api.get(`/common/employee-salary/list/`)
        setEmployeeSalary(resp.data.results)
    }

    const getEmployePays = async () => {
        const resp = await api.get(`/common/finance/employee-salary/list/`)
        setEmployeePays(resp.data.results)
    }


    const getEmployees = async () => {
        const resp = await api.get(`common/employees/`)
        setEmployees(resp.data);
    }

    const mergeSalary = async () => {
        setLoading(true)
        try {
            await api.post(`/common/employee-salary/create/`, {
                employee: salaryUser,
                date: salaryDate,
                amount: salaryAmount
            })
            setOpen(null)
            getEmployeSalary()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const updateSalary = async () => {
        setLoading(true)
        try {
            await api.patch(`/common/employee-salary/update/${editId.id}/`, {
                date: salaryDate,
                amount: salaryAmount
            })
            setOpen(null)
            getEmployeSalary()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const deleteSalary = async () => {
        setLoading(true)
        try {
            await api.delete(`/common/employee-salary/destroy/${editId.id}/`)
            setOpen(null)
            setEditId(null)
            getEmployeSalary()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const salaryCol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index"
        },
        {
            xs: 0.4,
            title: t("first_name"),
            dataIndex: "employee_name"
        },
        {
            xs: 0.4,
            title: t("Maoshi"),
            dataIndex: "amount",
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.1,
            title: t("Tahrir"),
            dataIndex: "id",
            render: (id) => <IconifyIcon onClick={() => {
                const find = employeeSalary.find((el: any) => el.id === id)
                getEmployees()
                setEditId(find)
                setOpen('edit-salary')
            }} icon={'basil:edit-outline'} />
        },
        {
            xs: 0.1,
            title: t("O'chir"),
            dataIndex: "id",
            render: (id) => <IconifyIcon onClick={() => {
                const find = employeeSalary.find((el: any) => el.id === id)
                setEditId(find)
                setOpen('delete-salary')
            }} icon={'fluent:delete-20-regular'} />
        },
    ]

    const handleRow = (id: string) => {
        push(`/finance/salaries/${id}`)
    }

    useEffect(() => {
        getAllNumbers()
        getExpenseCategroy()
        getGroupPays(`${new Date().getFullYear()}-${Number(new Date().getMonth()) + 1 < 10 ? "0" + (1 + new Date().getMonth()) : new Date().getMonth() + 1}`)
        getEmployeSalary()
        getEmployePays()
    }, [])


    return (
        <ApexChartWrapper>
            <KeenSliderWrapper>
                <Grid container spacing={2} columnSpacing={10}>
                    <Grid item xs={12}>
                        <Typography>Umumiy raqamlar</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <CardStatisticsHorizontal data={apiData.statsHorizontal} />
                    </Grid>

                    <Grid item xs={12} md={12} mb={10}>
                        <CardStatisticsLiveVisitors data={graphData} />
                    </Grid>

                    <div id='tushumlar'></div>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '20px' }}>Guruh to'lovlari</Typography>
                    </Grid>

                    <Grid item xs={12} md={12} mb={10}>
                        {groupPays && <GroupFinanceTable data={groupPays} updateData={getGroupPays} />}
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>Chiqimlar hisoboti</Typography>
                            <Button variant='contained' onClick={() => setOpen('create')}>+ {t("Bo'lim")}</Button>
                        </Box>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <Grid container spacing={6} mb={10}>
                            {
                                categryData.map((_: any, index: any) => (
                                    <Grid item xs={12} sm={6} lg={2} key={index} onClick={() => push(`/finance/costs/${_.id}`)} sx={{ cursor: 'pointer' }}>
                                        <CardFinanceCategory title={_.name} stats={_.total_expense} icon={<IconifyIcon fontSize={"3rem"} icon={''} />} color={'warning'} />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>

                    {/* <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                                <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>Xodimlar maoshi</Typography>
                                <Button variant='contained' onClick={() => setOpen('create')}>+</Button>
                            </Box>
                            <Box>
                                <TextField size='small' type='month' onChange={(e) => console.log(e.target.value)} />
                            </Box>
                        </Box>
                    </Grid> */}
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={6} >
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                                <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>Xodimlar doimiy maoshi</Typography>
                                <Button variant='contained' onClick={() => (getEmployees(), setOpen('add-salary'))}>+</Button>
                            </Box>
                        </Box>
                        <DataTable maxWidth='100%' minWidth='0' columns={salaryCol} rowClick={handleRow} data={employeeSalary} />
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>Oxirgi oydagi to'lovlar</Typography>
                        </Box>
                        <DataTable maxWidth='100%' minWidth='0' columns={employeePaycol} rowClick={handleRow} data={employeePays} />
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


            <Dialog open={open === 'add-salary'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>Xodimga oylik maosh kiritish</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <FormControl fullWidth sx={{ mt: '10px' }}>
                        <InputLabel size='small' id='user-view-language-label'>Xodim</InputLabel>
                        <Select
                            required
                            size='small'
                            label="Xodim"
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            onChange={(e) => setSalaryUser(e.target.value)}
                        >
                            {
                                employees.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.first_name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <TextField required autoComplete='off' size='small' placeholder={t("Summa")} type='number' fullWidth onChange={(e) => setSalaryAmount(e.target.value)} />
                    <TextField required autoComplete='off' size='small' defaultValue={today} placeholder={t("Sana")} type='date' fullWidth onChange={(e) => setSalaryDate(e.target.value)} />
                    <LoadingButton loading={loading} onClick={() => mergeSalary()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>
            </Dialog>

            <Dialog open={open === 'edit-salary'} onClose={() => (setOpen(null), setEditId(null))}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>Xodimga oylik maosh tahrirlash</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => (setOpen(null), setEditId(null))} />
                </DialogTitle>
                {editId && <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField defaultValue={editId.amount} required autoComplete='off' size='small' placeholder={t("Summa")} type='number' fullWidth onChange={(e) => setSalaryAmount(e.target.value)} />
                    <TextField defaultValue={editId.date} required autoComplete='off' size='small' placeholder={t("Sana")} type='date' fullWidth onChange={(e) => setSalaryDate(e.target.value)} />
                    <LoadingButton loading={loading} onClick={() => updateSalary()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'delete-salary'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography></Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                {<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>Xodimni maoshini olib tashlamoqchimisiz?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 10 }}>
                        <LoadingButton onClick={() => (setOpen(null), setEditId(null))} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                        <LoadingButton loading={loading} onClick={() => deleteSalary()} color='error' variant='contained'>{t("O'chirish")}</LoadingButton>
                    </Box>
                </DialogContent>}
            </Dialog>
        </ApexChartWrapper>
    )
}


export default CardStatistics
