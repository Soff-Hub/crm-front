
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenActionModal } from 'src/store/apps/leads'
import EditDepartmentForm from './edit-form'



type Props = {
    id: number
    name: string
}

export default function EditDepartmentDialog(props: Props) {

    const { openActionModal, actionId } = useAppSelector((state) => state.leads)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const handleClose = () => dispatch(setOpenActionModal(null))

    return (
        <div>
            <Dialog onClose={handleClose} open={openActionModal === 'edit' && actionId === props.id}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component='span'>
                        {t("Bo'limni tahrirlash")}
                    </Typography>
                    <IconButton
                        aria-label='close'
                        onClick={handleClose}
                    >
                        <IconifyIcon icon='mdi:close' />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <EditDepartmentForm {...props} />
                </DialogContent>
            </Dialog >
        </div>
    )
}