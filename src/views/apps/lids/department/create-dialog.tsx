
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpen } from 'src/store/apps/leads'
import CreateDepartmentForm from './create-form'



type Props = {}

export default function CreateDepartmentDialog({ }: Props) {

    const { open } = useAppSelector((state) => state.leads)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const handleClose = () => dispatch(setOpen(null))

    return (
        <div>
            <Dialog onClose={handleClose} open={open === "add-department"}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component='span'>
                        {t("Yangi bo'lim qo'shish")}
                    </Typography>
                    <IconButton
                        aria-label='close'
                        onClick={handleClose}
                    >
                        <IconifyIcon icon='mdi:close' />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <CreateDepartmentForm />
                </DialogContent>
            </Dialog >
        </div>
    )
}