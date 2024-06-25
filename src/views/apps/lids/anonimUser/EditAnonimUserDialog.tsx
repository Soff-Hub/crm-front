
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import EditAnonimUserForm from './EditAnonimUserForm'


type Props = {
    open: any
    setOpen: any
    item: any
    reRender: any
}

export default function EditAnonimDialogDialog({ open, setOpen, item, reRender }: Props) {

    const { t } = useTranslation()

    const closeCreateLid = () => {
        setOpen(null)
    }



    return (
        <div>
            <Dialog onClose={closeCreateLid} open={open === 'edit'}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component='span'>
                        {t("Lidni tahrirlash")}
                    </Typography>
                    <IconButton
                        aria-label='close'
                        onClick={closeCreateLid}
                    >
                        <IconifyIcon icon='mdi:close' />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <EditAnonimUserForm item={item} reRender={reRender} />
                </DialogContent>
            </Dialog >
        </div>
    )
}