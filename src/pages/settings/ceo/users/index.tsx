import {
    Box,
    Button,
    IconButton,
    Menu,
    Typography
} from '@mui/material'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import useEmployee from 'src/hooks/useEmployee'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/router'
import EmployeeCreateDialog from 'src/views/apps/settings/employees/TeacherCreateDialog'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchEmployees, setEmployeeData, setOpenCreateSms } from 'src/store/apps/settings'
import EditEmployeeModal from 'src/views/apps/settings/employees/TeacherEditDialog'
import api from 'src/@core/utils/api'

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
    const { push } = useRouter()
    const { employees, is_pending } = useAppSelector(state => state.settings)
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
            await api.delete(`auth/delete/employee/${id}`)
            dispatch(fetchEmployees())
            setSmallLoading(false)
        }

        const getUserById = async () => {
            setSmallLoading(true)
            const resp = await getEmployeeById(id)
            console.log(resp);
            
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
                        component={Link}
                        sx={{ '& svg': { mr: 2 } }}
                        onClick={handleRowOptionsClose}
                        href={`users/view/security?id=${id}`}
                    >
                        <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
                        {t("Ko'rish")}
                    </MenuItem>
                    <MenuItem
                        component={LoadingButton}
                        loading={smallLoading}
                        onClick={getUserById}
                        sx={{ '& svg': { mr: 2 } }}
                    >
                        <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                        {t('Tahrirlash')}
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
            xs: 0.5,
            title: t("first_name"),
            dataIndex: 'first_name'
        },
        {
            xs: 0.6,
            title: t("Telefon raqam"),
            dataIndex: 'phone'
        },
        {
            xs: 0.6,
            title: t("Kasbi"),
            dataIndex: 'roles_list',
            render: (roles_list: any) => roles_list.join(', ')
        },
        // {
        //     xs: 0.6,
        //     title: t("Maosh"),
        //     dataIndex: 'phone',
        //     render: () => 0
        // },
        {
            xs: 0.5,
            dataIndex: 'id',
            title: t("Harakatlar"),
            render: actions => <RowOptions id={actions} />
        }
    ]

    const rowClick = (id: any) => {
        push(`users/view/security?id=${id}`)
    }


    useEffect(() => {
        dispatch(fetchEmployees())
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
            <DataTable loading={is_pending} columns={columns} data={employees} rowClick={rowClick} />

            <EmployeeCreateDialog />

            <EditEmployeeModal />
        </div>
    )
}
