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
import useBranches from 'src/hooks/useBranch'
import useTeachers from 'src/hooks/useTeachers'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenEdit } from 'src/store/apps/mentors'

const RowOptions = ({ id }: { id: number | string }) => {
    const { deleteTeacher, getTeacherById } = useTeachers()
    const { getBranches } = useBranches()
    const { t } = useTranslation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const { openEdit } = useAppSelector(state => state.mentors)
    const dispatch = useAppDispatch()

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
        try {
            await deleteTeacher(id)
            toast.success(`${t("O'qituvchilar ro'yxatidan o'chirildi")}`, { position: 'top-center' })
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleEdit = async (id: any) => {
        dispatch(setOpenEdit(true))
        await getBranches()
        await getTeacherById(id)
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
            <UserSuspendDialog handleOk={() => handleDeleteTeacher(id)} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </>
    )
}

export default RowOptions