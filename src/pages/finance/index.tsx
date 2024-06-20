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
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react'
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

    const [nameVal, setNameVal] = useState<string>('');
    const [open, setOpen] = useState<'create' | 'add-salary' | 'update-salary' | 'remove-salary' | 'edit-salary' | 'delete-salary' | 'approve-salary' | 'update-cash' | 'delete-cash' | 'approve-cash' | null>(null);
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
    const [edit, setEdit] = useState<'amount' | 'status' | null>(null)
    const [students_count, setStudentCount] = useState<any>(0)


    const [graphData, setGraphData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categryData, setCategryData] = useState<any>([]);

    const [groupPays, setGropPays] = useState<any>(null);
    const [employeeSalary, setEmployeeSalary] = useState<any>([]);
    const [employeePays, setEmployeePays] = useState<any>([]);
    const [employees, setEmployees] = useState<any>([])
    const [withdraw, setWithdraw] = useState<any>([])

    const [isHover, setIsHover] = useState<null | string>(null)
    const [deleteCategory, setDeleteCategory] = useState<any>(null)

    const apiData: CardStatsType = {
        statsHorizontal: [
            {
                color: 'success',
                stats: label.last_month_benefit,
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: t('Tushum (oxirgi oy)'),
                id: '#tushumlar'
            },
            {
                stats: label.last_month_expense,
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: t('Chiqim (oxirgi oy)'),
                id: '#chiqimlar'
            },
            {
                color: 'success',
                stats: label.last_year_benefit,
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: t('Tushum (oxirgi yil)'),
                id: '#tushumlar'
            },
            {
                stats: label.last_year_expense,
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: t('Chiqim (oxirgi yil)'),
                id: '#chiqimlar'
            }
        ],
        statsVertical: [],
        statsCharacter: []
    }

    const employeePaycol: customTableDataProps[] = [
        {
            xs: 0.1,
            title: "#",
            dataIndex: "index"
        },
        {
            xs: 0.4,
            title: t("first_name"),
            dataIndex: "employee_name"
        },
        // {
        //     xs: 0.2,
        //     title: t("Sana"),
        //     dataIndex: "employee_name"
        // },
        {
            xs: 0.2,
            title: t("Maosh"),
            dataIndex: "amount",
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.2,
            title: t("Status"),
            dataIndex: "status",
            render: (status) => status === 'moderation' ? t("To'lanmagan") : t("To'langan")
        },
        {
            xs: 0.2,
            title: t("To'lash"),
            dataIndex: "id",
            render: (id) => {
                const find = employeePays.find((el: any) => el.id === id)
                if (find.status === 'moderation') {
                    <IconifyIcon onClick={() => {
                        setEditId(find)
                        setOpen('approve-cash')
                    }} icon={'mingcute:card-pay-line'} />
                } else {
                    return <span style={{ color: 'red' }}>{t('Imkonsiz')}</span>
                }
            }
        },
        {
            xs: 0.2,
            title: t("Tahrirlash"),
            dataIndex: "id",
            render: (id) => {
                const find = employeePays.find((el: any) => el.id === id)
                if (find.status === 'moderation') {
                    <IconifyIcon onClick={() => {
                        setEditId(find)
                        setOpen('update-cash')
                    }} icon={'mingcute:card-pay-line'} />
                } else {
                    return <span style={{ color: 'red' }}>{t('Imkonsiz')}</span>
                }
            }
        },
        {
            xs: 0.2,
            title: t("O'chirish"),
            dataIndex: "id",
            render: (id) => {
                const find = employeePays.find((el: any) => el.id === id)
                if (find.status === 'moderation') {
                    <IconifyIcon onClick={() => {
                        setEditId(find)
                        setOpen('delete-cash')
                    }} icon={'fluent:delete-20-regular'} />
                } else {
                    return <span style={{ color: 'red' }}>{t('Imkonsiz')}</span>
                }
            }
        },
    ]

    const withdrawCol: customTableDataProps[] = [
        {
            xs: 0.1,
            title: "#",
            dataIndex: "index"
        },
        {
            xs: 0.2,
            title: t("O'qituvchi"),
            dataIndex: "data",
            render: (data: any) => data.teacher_name
        },
        {
            xs: 0.2,
            title: t("Guruh"),
            dataIndex: "data",
            render: (data: any) => data.group_name
        },
        {
            xs: 0.2,
            title: t("O'quvchilar soni"),
            dataIndex: "students_count",
        },
        {
            xs: 0.2,
            title: t("Jarimalar soni"),
            dataIndex: 'fines_count'
        },
        {
            xs: 0.2,
            title: t("Status"),
            dataIndex: 'status',
            render: (status) => status === 'moderation' ? "Tekshirilmoqda" : status === 'frozen' ? "Muzlatilgan" : "Tasdiqlangan"
        },
        {
            xs: 0.2,
            title: t("Tasdiqlash"),
            dataIndex: "id",
            render: (id) => {
                const finded = withdraw.find((el: any) => el.id === id)
                if (finded?.status === 'moderation') {
                    return (
                        <Box onClick={() => {
                            const find = withdraw.find((el: any) => el.id === id)
                            setEditId(find)
                            setStudentCount(find.students_count)
                            setOpen('approve-salary')
                        }} sx={{ display: 'flex', gap: '10px' }}>
                            <span>{t('Tasdiqlash')}</span>
                            <IconifyIcon icon={'mingcute:edit-line'} />
                        </Box>
                    )
                }
                else {
                    return (
                        <Box sx={{ display: 'flex', gap: '10px', color: 'red' }}>
                            {t('Imkonsiz')}
                        </Box>
                    )
                }
            }
        },
        {
            xs: 0.2,
            title: t("Amallar"),
            dataIndex: "id",
            render: (id) => {
                const finded = withdraw.find((el: any) => el.id === id)
                if (finded?.status === 'moderation') {
                    return (
                        <Box sx={{ display: 'flex', gap: '10px' }}>

                            <IconifyIcon onClick={() => {
                                const find = withdraw.find((el: any) => el.id === id)
                                setEditId(find)
                                setStudentCount(find.students_count)
                                setSalaryAmount(find.fines_count)
                                setOpen('edit-salary')
                            }} icon={'mingcute:edit-line'} />

                            <IconifyIcon onClick={() => {
                                const find = withdraw.find((el: any) => el.id === id)
                                setEditId(find)
                                setOpen('delete-salary')
                            }} icon={'fluent:delete-20-regular'} />

                        </Box>
                    )
                } else if (finded.status === 'approved') {
                    return (
                        <Box sx={{ display: 'flex', gap: '10px', color: 'red' }}>
                            {t('Imkonsiz')}
                        </Box>
                    )
                }
                else {
                    return (
                        <Box sx={{ display: 'flex', gap: '10px', color: 'red' }}>
                            {t('Imkonsiz')}
                        </Box>
                    )
                }
            }
        },
    ]


    const employeeSalaryCol: customTableDataProps[] = [
        {
            xs: 0.1,
            title: "#",
            dataIndex: "index"
        },
        {
            xs: 0.8,
            title: t("first_name"),
            dataIndex: "employee_name"
        },
        {
            xs: 0.2,
            title: t("Maosh"),
            dataIndex: "amount",
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.2,
            title: t("Tahrirlash"),
            dataIndex: "id",
            render: (id) => <IconifyIcon onClick={() => {
                const find = employeeSalary.find((el: any) => el.id === id)
                setEditId(find)
                setOpen('update-salary')
            }} icon={'mingcute:edit-line'} />
        },
        {
            xs: 0.2,
            title: t("O'chirish"),
            dataIndex: "id",
            render: (id) => <IconifyIcon onClick={() => {
                const find = employeeSalary.find((el: any) => el.id === id)
                setEditId(find)
                setOpen('remove-salary')
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

    const getWithdrawSalary = async () => {
        const resp = await api.get(`common/withdraw-salary/list/`)
        setWithdraw(resp.data)
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
            await api.patch(`/common/withdraw-salary/${editId.id}/`, {
                students_count,
                fines_count: salaryAmount
            })
            setOpen(null)
            getWithdrawSalary()
            getEmployeSalary()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const approveSalary = async () => {
        setLoading(true)
        try {
            await api.post(`/common/withdraw-salary/confirmation/`, {
                withdraw: editId.id
            })
            setOpen(null)
            getWithdrawSalary()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const deleteSalary = async () => {
        setLoading(true)
        try {
            await api.delete(`/common/withdraw-salary/${editId.id}/`)
            setOpen(null)
            setEditId(null)
            getWithdrawSalary()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const updateMonthly = async () => {
        setLoading(true)
        try {
            await api.patch(`/common/employee-salary/update/${editId.id}/`, {
                amount: salaryAmount
            })
            setEdit(null)
            getEmployePays()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const approveMonthly = async () => {
        setLoading(true)
        try {
            await api.post(`/common/withdraw-salary/confirmation/`, {
                withdraw: editId.id
            })
            setEdit(null)
            getEmployePays()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const updateCash = async () => {
        setLoading(true)
        try {
            await api.patch(`/common/employee-salary/update/${editId.id}/`, {
                amount: salaryAmount
            })
            setOpen(null)
            getEmployePays()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const updateSalaryConst = async () => {
        setLoading(true)
        try {
            await api.patch(`/common/employee-salary/update/${editId.id}/`, {
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

    const deleteCashConst = async () => {
        setLoading(true)
        try {
            await api.delete(`/common/employee-salary/destroy/${editId.id}/`)
            setOpen(null)
            getEmployeSalary()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const approveCash = async () => {
        setLoading(true)
        try {
            await api.post(`/common/employee-salary/confirmation/`, {
                employee_salary: editId.id,
                expense_category: salaryUser
            })
            setOpen(null)
            getEmployePays()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const deleteCash = async () => {
        setLoading(true)
        try {
            await api.delete(`/common/employee-salary/destroy/${editId.id}/`)
            setOpen(null)
            getEmployePays()
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
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



    const handleRow = (id: string) => {
        push(`/finance/salaries/${id}`)
    }

    useEffect(() => {
        getAllNumbers()
        getExpenseCategroy()
        getGroupPays(`${new Date().getFullYear()}-${Number(new Date().getMonth()) + 1 < 10 ? "0" + (1 + new Date().getMonth()) : new Date().getMonth() + 1}`)
        getEmployeSalary()
        getEmployePays()
        getWithdrawSalary()
    }, [])


    return (
        <ApexChartWrapper>
            <KeenSliderWrapper>
                <Grid container spacing={2} columnSpacing={10}>
                    <Grid item xs={12}>
                        <Typography>{t('Umumiy raqamlar')}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <CardStatisticsHorizontal data={apiData.statsHorizontal} />
                    </Grid>

                    <Grid item xs={12} md={12} mb={10}>
                        <CardStatisticsLiveVisitors data={graphData} />
                    </Grid>

                    <div id='tushumlar'></div>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '20px' }}>{t("Guruh to'lovlari")}</Typography>
                    </Grid>

                    <Grid item xs={12} md={12} mb={10}>
                        {groupPays && <GroupFinanceTable data={groupPays} updateData={getGroupPays} />}
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Chiqimlar hisoboti')}</Typography>
                            <Button variant='contained' onClick={() => setOpen('create')}>+ {t("Bo'lim")}</Button>
                        </Box>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <Grid container spacing={6} mb={10}>
                            {
                                categryData.map((_: any, index: any) => (
                                    <Grid item xs={12} sm={6} lg={2} key={index} onMouseEnter={() => setIsHover(_.id)} onMouseLeave={() => setIsHover(null)} sx={{ position: 'relative' }}>
                                        <Box onClick={() => push(`/finance/costs/${_.id}`)} sx={{ cursor: 'pointer' }}>
                                            <CardFinanceCategory title={_.name} stats={_.total_expense} icon={<IconifyIcon fontSize={"3rem"} icon={''} />} color={'warning'} />
                                        </Box>
                                        {isHover === _.id && <IconifyIcon onClick={() => setDeleteCategory(_.id)} style={{ position: 'absolute', zIndex: 999, bottom: '2px', right: 0 }} icon={'fluent:delete-20-regular'} />}
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>

                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Tekshirish uchun maoshlar')}</Typography>
                        </Box>
                        <DataTable maxWidth='100%' minWidth='800px' columns={withdrawCol} rowClick={handleRow} data={withdraw} />
                    </Grid>
                    <Box sx={{ margin: '15px' }}></Box>
                    <Grid item xs={12} md={12} >
                        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t("Oxirgi oydagi to'lovlar")}</Typography>
                        </Box>
                        <DataTable maxWidth='100%' minWidth='800px' columns={employeePaycol} data={employeePays} />
                    </Grid>

                    <Box sx={{ margin: '15px' }}></Box>
                    <Grid item xs={12} md={12} >
                        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1 }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Doimiy maosh oluvchilar')}</Typography>
                            <Button variant='contained' onClick={() => (setOpen('add-salary'), getEmployees())}>+ {t("Yaratish")}</Button>
                        </Box>
                        <DataTable maxWidth='100%' minWidth='800px' columns={employeeSalaryCol} data={employeeSalary} />
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


            <Dialog open={open === 'add-salary'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>{t('Xodimga oylik maosh kiritish')}</Typography>
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
                    <Typography>{t('Xodimga oylik maosh tahrirlash')}</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => (setOpen(null), setEditId(null))} />
                </DialogTitle>
                {editId && <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField label="Jarimalar soni" defaultValue={editId.fines_count} required autoComplete='off' size='small' fullWidth onChange={(e) => setSalaryAmount(e.target.value)} style={{ margin: '15px 0' }} />
                    <TextField label="Talabalar soni" defaultValue={editId.students_count} required autoComplete='off' size='small' fullWidth onChange={(e) => setStudentCount(e.target.value)} />
                    <LoadingButton loading={loading} onClick={() => updateSalary()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'update-cash'} onClose={() => (setOpen(null), setEditId(null))}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>{t('Xodim oylik maosh tahrirlash')}</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => (setOpen(null), setEditId(null))} />
                </DialogTitle>
                {editId && <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField label="Summa" defaultValue={editId.amount} required autoComplete='off' size='small' fullWidth onChange={(e) => setSalaryAmount(e.target.value)} style={{ margin: '15px 0' }} />
                    <LoadingButton loading={loading} onClick={() => updateCash()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'update-salary'} onClose={() => (setOpen(null), setEditId(null))}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>{t('Xodim oylik maosh tahrirlash')}</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => (setOpen(null), setEditId(null))} />
                </DialogTitle>
                {editId && <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField label="Summa" defaultValue={editId.amount} required autoComplete='off' size='small' fullWidth onChange={(e) => setSalaryAmount(e.target.value)} style={{ margin: '15px 0' }} />
                    <LoadingButton loading={loading} onClick={() => updateSalaryConst()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'remove-salary'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography></Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                {<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>{t("Xodimni maoshini olib tashlamoqchimisiz?")}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 10 }}>
                        <LoadingButton onClick={() => (setOpen(null), setEditId(null))} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                        <LoadingButton loading={loading} onClick={() => deleteCashConst()} color='error' variant='contained'>{t("O'chirish")}</LoadingButton>
                    </Box>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'delete-cash'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography></Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                {<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>{t("Xodimni maoshini olib tashlamoqchimisiz?")}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 10 }}>
                        <LoadingButton onClick={() => (setOpen(null), setEditId(null))} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                        <LoadingButton loading={loading} onClick={() => deleteCash()} color='error' variant='contained'>{t("O'chirish")}</LoadingButton>
                    </Box>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'approve-cash'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography></Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                {<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>{t("Xodimni maoshini olib to'lash")}</Typography>
                    <FormControl fullWidth sx={{ mt: '10px' }}>
                        <InputLabel size='small' id='user-view-language-label'>{t("Chiqim yozib qo'yish")}</InputLabel>
                        <Select
                            required
                            size='small'
                            label={t("Chiqim yozib qo'yish")}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            onChange={(e) => setSalaryUser(e.target.value)}
                        >
                            {
                                categryData.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 5 }}>
                        <LoadingButton onClick={() => (setOpen(null), setEditId(null))} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                        <LoadingButton loading={loading} onClick={() => approveCash()} color='success' variant='contained'>{t("Tadiqlash")}</LoadingButton>
                    </Box>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'approve-salary'} onClose={() => (setOpen(null), setEditId(null))}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'flex-end' }}>
                    <IconifyIcon icon={'mdi:close'} onClick={() => (setOpen(null), setEditId(null))} />
                </DialogTitle>
                {editId && <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography marginBottom={'40px'} fontSize={'20px'}>{t('Xodim maoshini tasdiqlamoqchimiz?')}</Typography>
                    <LoadingButton loading={loading} onClick={() => approveSalary()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>}
            </Dialog>

            <Dialog open={open === 'delete-salary'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography></Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                {<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>{t('Xodimni maoshini olib tashlamoqchimisiz?')}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 10 }}>
                        <LoadingButton onClick={() => (setOpen(null), setEditId(null))} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                        <LoadingButton loading={loading} onClick={() => deleteSalary()} color='error' variant='contained'>{t("O'chirish")}</LoadingButton>
                    </Box>
                </DialogContent>}
            </Dialog>

            <Dialog open={edit === 'amount'} onClose={() => (setEdit(null), setEditId(null))}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>{t('Xodimga oylik maosh tahrirlash')}</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => (setEdit(null), setEditId(null))} />
                </DialogTitle>
                {editId && <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField label="Summa" defaultValue={editId.amount} required autoComplete='off' size='small' fullWidth onChange={(e) => setSalaryAmount(e.target.value)} style={{ margin: '15px 0' }} />
                    <LoadingButton loading={loading} onClick={() => updateMonthly()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>}
            </Dialog>

            <Dialog open={edit === 'status'} onClose={() => (setEdit(null), setEditId(null))}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'flex-end' }}>
                    <IconifyIcon icon={'mdi:close'} onClick={() => (setEdit(null), setEditId(null))} />
                </DialogTitle>
                {editId && <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography marginBottom={'40px'} fontSize={'20px'}>{t('Xodim maoshini tasdiqlamoqchimiz?')}</Typography>
                    <LoadingButton loading={loading} onClick={() => approveMonthly()} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>}
            </Dialog>

            <Dialog open={deleteCategory} onClose={() => setDeleteCategory(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography></Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setDeleteCategory(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>{t("Chiqimlar bo'limini o'chirmoqchimisiz?")}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 10 }}>
                        <LoadingButton onClick={() => (setDeleteCategory(null))} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                        <LoadingButton loading={loading} onClick={() => confirmDeleteCategory()} color='error' variant='contained'>{t("O'chirish")}</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>

        </ApexChartWrapper>
    )
}


export default CardStatistics
