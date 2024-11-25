import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { MouseEvent, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import UserSuspendDialog from '../../mentors/view/UserSuspendDialog'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useTranslation } from 'react-i18next'
import { fetchCoursesList, setOpenEditCourse } from 'src/store/apps/settings'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import toast from 'react-hot-toast'
import { disablePage } from 'src/store/apps/page'

type Props = {
    id: number
}

export default function CourseListRowOptions({ id }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const { course_list } = useAppSelector(state => state.settings)
    const { t } = useTranslation()

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
        // setDataRowEdit(null)
    }
    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    // Delete functions

    async function handleDelete() {
        handleRowOptionsClose()
        setSuspendDialogOpen(true)
    }

    async function handleDeletePosts(id: number) {
        handleRowOptionsClose()
        setLoading(true)
        dispatch(disablePage(true))
        try {
            await api.delete(`${ceoConfigs.courses_delete}/${id}`)
            setSuspendDialogOpen(false)
            toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
            dispatch(fetchCoursesList(''))
        } catch (error: any) {
            toast.error('Xatolik yuz berdi!', { position: 'top-center' })
        }
        dispatch(disablePage(false))
        setLoading(false)
    }

    // Get functions

    async function handleEdit(id: number) {
        handleRowOptionsClose()
        const find = course_list?.results?.find(el => el.id === id)
        dispatch(setOpenEditCourse(find))
        // try {
        //     setOpenAddGroupEdit(true)
        //     const resp = await api.get(`${ceoConfigs.courses_detail}/${id}`)
        //     setDataRowEdit(resp.data)
        //     getUsers()
        // } catch (error: any) {
        //     toast.error('Xatolik yuz berdi!', { position: 'top-center' })
        // }
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
                {course_list?.results?.some((item: any) => item?.id == id && item?.is_delete) ? (
                    <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                        <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                        {t("O'chirish")}
                    </MenuItem>
                ) : (
                    <></>
                )}
            </Menu>
            <UserSuspendDialog
                handleOk={() => handleDeletePosts(id)}
                loading={loading}
                open={suspendDialogOpen}
                setOpen={setSuspendDialogOpen}
            />
        </>
    )
}