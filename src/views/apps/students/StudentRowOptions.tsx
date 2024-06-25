import { IconButton, Menu, MenuItem } from '@mui/material'
import Link from 'next/link'
import React, { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { deleteStudent, fetchStudentDetail, fetchStudentsList, setOpenEdit } from 'src/store/apps/students'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog';


type Props = {
    id: number
}

export default function StudentRowOptions({ id }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const [recoveModal, setRecoveModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
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

    const handleEdit = async () => {
        dispatch(setOpenEdit('edit'))
        await dispatch(fetchStudentDetail(id))
        setAnchorEl(null)
    }

    async function submitDelete() {
        setLoading(true)
        await dispatch(deleteStudent(id))
        await dispatch(fetchStudentsList({ status: 'active' }))
        setLoading(false)
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
                    href={`/students/view/security?student=${id}`}
                >
                    <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
                    {t("Ko'rish")}
                </MenuItem>
                <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleEdit}>
                    <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                    {t("Tahrirlash")}
                </MenuItem>
                {
                    false ? (
                        <MenuItem onClick={() => setRecoveModal(true)} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='bytesize:reload' fontSize={20} />
                            {t("Tiklash")}
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                            {t("O'chirish")}
                        </MenuItem>
                    )
                }
            </Menu>
            <UserSuspendDialog loading={loading} handleOk={submitDelete} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSuspendDialog handleOk={() => null} open={recoveModal} setOpen={setRecoveModal} okText='Tiklash' />
        </>
    )
}