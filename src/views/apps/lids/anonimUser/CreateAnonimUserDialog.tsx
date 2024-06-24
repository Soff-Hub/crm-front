
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setAddSource, setOpenLid } from 'src/store/apps/leads'
import CreateAnonimUserForm from './CreateAnonimUserForm'


type Props = {}

export default function CreateAnonimDialogDialog({ }: Props) {

    const { openLid } = useAppSelector((state) => state.leads)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const closeCreateLid = () => {
        dispatch(setOpenLid(null))
        dispatch(setAddSource(false))
    }



    return (
        <div>
            <Dialog onClose={closeCreateLid} open={openLid !== null}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component='span'>
                        {t("Yangi Lid")}
                    </Typography>
                    <IconButton
                        aria-label='close'
                        onClick={closeCreateLid}
                    >
                        <IconifyIcon icon='mdi:close' />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <CreateAnonimUserForm />
                </DialogContent>
            </Dialog >
        </div>
    )
}