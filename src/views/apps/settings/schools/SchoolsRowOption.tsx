import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { MouseEvent, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import UserSuspendDialog from '../../mentors/view/UserSuspendDialog'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import toast from 'react-hot-toast'
import { fetchRoomList, fetchSchoolList, setOpenEditRoom, setOpenEditSchool } from 'src/store/apps/settings'
import { disablePage } from 'src/store/apps/page'

type Props = {
    id: number
}

export default function SchoolsRowOptions({ id }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const { schools, active_page,schoolQueryParams } = useAppSelector(state => state.settings)
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)

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
            await api.delete(`common/school/delete/${id}`)
            toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
            dispatch(fetchSchoolList({ page: schoolQueryParams.page }))
        } catch (error: any) {
            toast.error('Xatolik yuz berdi!', { position: 'top-center' })
        }
        dispatch(disablePage(false))
        setLoading(false)
    }


    async function handleEdit(id: number) {
        handleRowOptionsClose()
        const find = schools.find((el:any) => el.id === id)
        dispatch(setOpenEditSchool(find))
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
                    {t("Tahrirlash")}
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