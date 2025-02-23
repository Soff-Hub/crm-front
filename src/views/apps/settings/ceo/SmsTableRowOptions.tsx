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
import { fetchSmsList, fetchSmsListQuery, setOpenEditSms } from 'src/store/apps/settings'
import { disablePage } from 'src/store/apps/page'


type Props = {
    id: number
    parent_id?:number
}

export default function SmsTableRowOptions({ id,parent_id }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()

    const { openEditSms, sms_list,smschild_list } = useAppSelector(state => state.settings)
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
        setLoading(true)
        dispatch(disablePage(true))
        try {
            await api.delete(`common/sms-form/delete/${id}`)
            toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
            {
                parent_id ? dispatch(fetchSmsListQuery(parent_id)) :
                dispatch(fetchSmsList())
            }
        } catch (error: any) {
            toast.error('Xatolik yuz berdi!', { position: 'top-center' })
        }
        setLoading(false)
        dispatch(disablePage(false))
    }

    // Get functions


    async function handleEdit(id: number) {
        
        handleRowOptionsClose()
        const find = smschild_list.find(el => el.id === id) || sms_list.find(el => el.id === id)
        
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
                loading={loading}
                handleOk={() => handleDeletePosts(id)}
                open={suspendDialogOpen}
                setOpen={setSuspendDialogOpen}
            />
        </>
    )
}