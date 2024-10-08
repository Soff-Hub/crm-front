import { IconButton, Menu, MenuItem } from '@mui/material'
import React, { MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import useEmployee from 'src/hooks/useEmployee'
import { useAppDispatch } from 'src/store'
import { setEmployeeData } from 'src/store/apps/settings'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'

type Props = {
    id: number
}

export default function EmployeesRowOptions({ id }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const { t } = useTranslation()
    const { getEmployeeById } = useEmployee()

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

    const getUserById = async () => {

        const resp = await getEmployeeById(id)
        dispatch(setEmployeeData(resp))
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
                <MenuItem onClick={getUserById} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                    {t('Tahrirlash')}
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                    {t("O'chirish")}
                </MenuItem>
            </Menu>
            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </>
    )
}