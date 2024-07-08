import {
    IconButton, Menu
} from '@mui/material'
import { MouseEvent, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/store'
import { deleteTeacher, fetchTeacherdetail, fetchTeachersList, setOpenEdit } from 'src/store/apps/mentors'

const RowOptions = ({ id }: { id: number | string }) => {
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const { } = useAppSelector(state => state.mentors)
    const dispatch = useAppDispatch()

    const [loading, setLoaading] = useState<boolean>(false)
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
        setLoaading(true)
        const resp = await dispatch(deleteTeacher(id))
        if (resp.meta.requestStatus === 'rejected') {
            toast.error(`${resp.payload?.msg}`, { position: 'top-center' })
        } else {
            await dispatch(fetchTeachersList(""))
            toast.success(`${t("O'qituvchilar ro'yxatidan o'chirildi")}`, { position: 'top-center' })
        }
        setLoaading(false)
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
            </Menu>
            <UserSuspendDialog loading={loading} handleOk={() => handleDeleteTeacher(id)} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </>
    )
}

export default RowOptions