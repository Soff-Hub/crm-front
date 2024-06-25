
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenItem } from 'src/store/apps/leads'

import CreateDepartmentItemForm from './Form'



type Props = {}

export default function CreateDepartmentItemDialog({ }: Props) {

    const { openItem } = useAppSelector((state) => state.leads)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()


    return (
        <div>
            <Dialog onClose={() => dispatch(setOpenItem(null))} open={openItem !== null}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component='span'>
                        {t("Yangi bo'lim biriktirish")}
                    </Typography>
                    <IconButton
                        aria-label='close'
                        onClick={() => dispatch(setOpenItem(null))}
                    >
                        <IconifyIcon icon='mdi:close' />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <CreateDepartmentItemForm />
                </DialogContent>
            </Dialog >
        </div>
    )
}