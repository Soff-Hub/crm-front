//@ts-nocheck
import {
    IconButton, Menu, Typography
} from '@mui/material'
import { MouseEvent, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
    deleteTeacher,
    fetchTeacherdetail,
    fetchTeachersList,
    setOpenEdit,
    updateParams,
    
} from 'src/store/apps/mentors'
import { disablePage } from 'src/store/apps/page'
import { editEmployeeStatus } from 'src/store/apps/settings'

const RowOptions = ({ id, status }: { id: number | string, status: string }) => {
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const { queryParams } = useAppSelector(state => state.mentors)
    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState<boolean>(false)
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

    const handleDeleteTeacher = async (id: string | number) => {
        setLoading(true)
        dispatch(disablePage(true))
        const resp = await dispatch(deleteTeacher(id))
        if (resp.meta.requestStatus === 'rejected') {
            toast.error(`${resp.payload?.msg}`, { position: 'top-center' })
        } else {
            const queryString = new URLSearchParams({ ...queryParams,status: 'active' }).toString()
            await dispatch(fetchTeachersList(queryString))
            toast.success(`${t("O'qituvchilar ro'yxatidan o'chirildi")}`, { position: 'top-center' })
        }
        setLoading(false)
        dispatch(disablePage(false))
    }
    const handleChange = async (id: string | number) => {
        setLoading(true)
        const resp = await dispatch(editEmployeeStatus({
            data: { status: "active" },
            id: id
        }))

        if (resp.meta.requestStatus === 'rejected') {
            toast.error("Tiklab bo'lmadi")
        } else {
            dispatch(updateParams({ page: "1", status: "active" }))
            const queryString = new URLSearchParams({ ...queryParams, page: "1", status: "active" }).toString()
            await dispatch(fetchTeachersList(queryString))
            toast.success("O'qituvchi qaytarildi")
        }
        setLoading(false)
        dispatch(disablePage(false))
    }

    const handleEdit = async (id: any) => {
        dispatch(setOpenEdit('edit'))
        handleRowOptionsClose()
        await dispatch(fetchTeacherdetail(id))
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
                {status == "archive" ?
                    <MenuItem disabled={loading} onClick={() => handleChange(id)} sx={{ '& svg': { mr: 2 } }}>
                        {loading ? <Typography>Tiklanmoqda...</Typography> :
                            <>
                                <IconifyIcon icon='icon-park-outline:return' fontSize={20} />
                                {t("Tiklash")}
                            </>}
                    </MenuItem> :
                    <>
                        <MenuItem
                            component={Link}
                            sx={{ '& svg': { mr: 2 } }}
                            onClick={handleRowOptionsClose}
                            href={`/mentors/view/security?id=${id}`}
                        >
                            <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
                            {t("Ko'rish")}
                        </MenuItem>
                        <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                            {t("Tahrirlash")}
                        </MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                            {t("O'chirish")}
                        </MenuItem>
                    </>

                }
            </Menu>
            <UserSuspendDialog loading={loading} handleOk={() => handleDeleteTeacher(id)} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </>
    )
}

export default RowOptions