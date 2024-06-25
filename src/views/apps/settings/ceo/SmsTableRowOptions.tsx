import {
    IconButton,
    Menu
} from '@mui/material'
import React, { MouseEvent, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import MenuItem from '@mui/material/MenuItem'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenEditSms } from 'src/store/apps/settings'


type Props = {
    id: number
}

export default function SmsTableRowOptions({ id }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const { t } = useTranslation()

    const { openEditSms, sms_list } = useAppSelector(state => state.settings)
    const dispatch = useAppDispatch()

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    async function handleDelete() {
        handleRowOptionsClose()
        setSuspendDialogOpen(true)
    }

    async function handleDeletePosts(id: number) {
        handleRowOptionsClose()
        try {
            await api.delete(`common/sms-form/delete/${id}`)
            toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
        } catch (error: any) {
            toast.error('Xatolik yuz berdi!', { position: 'top-center' })
        }
    }

    // Get functions


    async function handleEdit(id: number) {
        handleRowOptionsClose()
        const find = sms_list.find(el => el.id === id)
        dispatch(setOpenEditSms(find))
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
                <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                    {t('Tahrirlash')}
                </MenuItem>

                <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                    {t("O'chirish")}
                </MenuItem>
            </Menu>
            <UserSuspendDialog
                handleOk={() => handleDeletePosts(id)}
                open={suspendDialogOpen}
                setOpen={setSuspendDialogOpen}
            />
        </>
    )
}