import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Menu,
    Pagination,
    Typography
} from '@mui/material'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import MenuItem from '@mui/material/MenuItem'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import useEmployee from 'src/hooks/useEmployee'
import LoadingButton from '@mui/lab/LoadingButton'
import EmployeeCreateDialog from 'src/views/apps/settings/employees/TeacherCreateDialog'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchEmployees, setEmployeeData, setOpenCreateSms, updateQueryParams } from 'src/store/apps/settings'
import EditEmployeeModal from 'src/views/apps/settings/employees/TeacherEditDialog'
import api from 'src/@core/utils/api'
import ButtonGroup from '@mui/material/ButtonGroup';
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import { formatCurrency } from 'src/@core/utils/format-currency'

export interface customTableProps {
    xs: number
    title: string
    dataIndex?: string | ReactNode
    render?: (source: string) => any | undefined
}


export default function GroupsPage() {
    // Hooks
    const { t } = useTranslation()
    const { getEmployeeById } = useEmployee()
    const { employees, is_pending, employees_count, queryParams, roles } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()


    const RowOptions = ({ id }: { id: number | string }) => {
        // ** State
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
        const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
        const [smallLoading, setSmallLoading] = useState<boolean>(false)

        const rowOptionsOpen = Boolean(anchorEl)

        const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget)
        }
        const handleRowOptionsClose = () => {
            setAnchorEl(null)
        }

        const handleDelete = () => {
            handleRowOptionsClose()
            setSuspendDialogOpen(true)
        }

        const handleDeleteSubmit = async () => {
            setSmallLoading(true)
            dispatch(disablePage(true))
            await api.delete(`auth/delete/employee/${id}/`)
            toast.success("Hodim muvaffaqiyatli o'chirildi")
            dispatch(disablePage(false))
            dispatch(fetchEmployees(queryParams))
            setSmallLoading(false)
        }

        const getUserById = async () => {
            setSmallLoading(true)
            const resp = await getEmployeeById(id)
            dispatch(setEmployeeData(resp))
            setSmallLoading(false)
        }

        return (
            <>
                <IconButton size='small' onClick={handleRowOptionsClick}>
                    <IconifyIcon icon='mdi:dots-vertical' />
                </IconButton>
                <Menu
                    keepMounted
                    anchorEl={anchorEl}
                    open={rowOptionsOpen}
                    onClose={handleRowOptionsClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    PaperProps={{ style: { minWidth: '8rem' } }}
                >
                    <MenuItem
                        onClick={getUserById}
                    >
                        {
                            smallLoading ?
                                <CircularProgress sx={{ mx: 'auto' }} size={28} /> :
                                <>
                                    <IconifyIcon icon='mdi:pencil-outline' fontSize={20} style={{ marginRight: '4px' }} />
                                    {t('Tahrirlash')}
                                </>
                        }
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                        <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                        {t("O'chirish")}
                    </MenuItem>
                </Menu>
                <UserSuspendDialog loading={smallLoading} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} handleOk={handleDeleteSubmit} />
            </>
        )
    }

    const columns: customTableProps[] = [
        {
            xs: 0.1,
            title: t("#"),
            dataIndex: 'index'
        },
        {
            xs: 1,
            title: t("first_name"),
            dataIndex: 'first_name'
        },
        {
            xs: 1,
            title: t("Telefon raqam"),
            dataIndex: 'phone'
        },
        {
            xs: 1,
            title: "Doimiy oylik",
            dataIndex: 'amount',
            render: (amount) => formatCurrency(amount)
        },
        {
            xs: 1,
            title: "Foiz ulush (%)",
            dataIndex: 'percentage'
        },
        {
            xs: 0.6,
            title: t("Kasbi"),
            dataIndex: 'roles_list',
            render: (roles_list: any) => roles_list.join(', ')
        },
        {
            xs: 0.5,
            dataIndex: 'id',
            title: t("Harakatlar"),
            render: actions => <RowOptions id={actions} />
        }
    ]

    const handleFilter = async (value: number | string) => {
        dispatch(updateQueryParams({ role: value }))
        await dispatch(fetchEmployees({ ...queryParams, role: value }))
    }

    const buttons = [
        <Button
            key={''}
            onClick={() => handleFilter('')}
            variant={queryParams.role === '' ? 'contained' : 'outlined'}
        >
            {t("Barchasi")} - {roles.reduce((accumulator, role) => accumulator + role.count, 0)}
        </Button>,
        ...roles.map(el => (
            <Button
                key={el.id}
                onClick={() => handleFilter(el.id)}
                variant={queryParams.role === el.id ? 'contained' : 'outlined'}
            >
                {t(el.name)} - {el.count}
            </Button>
        ))
    ]

    const handlePagination = (page: string) => {
        dispatch(updateQueryParams({ page }))
        dispatch(fetchEmployees({ ...queryParams, page: +page }))
    }

    useEffect(() => {
        dispatch(fetchEmployees(queryParams))
    }, [])

    return (
        <div>
            <Box
                className='groups-page-header'
                sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
                py={2}
            >
                <Typography variant='h5'>{t("Xodimlar")}</Typography>
                <Button
                    onClick={() => dispatch(setOpenCreateSms(true))}
                    variant='contained'
                    size='small'
                    startIcon={<IconifyIcon icon='ic:baseline-plus' />}
                >
                    {t("Yangi qo'shish")}
                </Button>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    '& > *': {
                        m: 1,
                    },
                }}
            >
                <ButtonGroup size="small" aria-label="Small button group">
                    {buttons}
                </ButtonGroup>
            </Box>

            <DataTable loading={is_pending} columns={columns} data={employees} />
            {Math.ceil(employees_count / 10) > 1 && !is_pending && <Pagination defaultPage={queryParams.page ? Number(queryParams.page) : 1} count={Math.ceil(employees_count / 10)} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(e.target.value + page)} />}

            <EmployeeCreateDialog />

            <EditEmployeeModal />
        </div>
    )
}
