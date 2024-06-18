import { Box, Button, Dialog, DialogContent, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { today } from '../card-statistics/kanban-item'
import api from 'src/@core/utils/api'
import { useRouter } from 'next/router'
import LoadingButton from '@mui/lab/LoadingButton'

type Props = {}

export default function CompanyCardActions({ }: Props) {

    const { t } = useTranslation()
    const [open, setOpen] = useState<null | 'sms' | 'payment' | 'pack'>(null)
    const [message, setMessage] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { query } = useRouter()


    const sendSms = async () => {
        setLoading(true)
        try {
            await api.post(`owner/send-message/`, { client: query?.slug, message })
            setOpen(null)
        } catch (err) {
            console.log(err);
        }
        setLoading(false)
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                <Button
                    variant='outlined'
                    size='small'
                    color='warning'
                    onClick={() => setOpen('sms')}
                >
                    {t('SMS yuborish')}
                </Button>

                <Button
                    variant='outlined'
                    size='small'
                    onClick={() => setOpen('pack')}
                >
                    {t("SMS paket")}
                </Button>

                <Button
                    variant='outlined'
                    size='small'
                    color='secondary'
                    onClick={() => setOpen('payment')}
                >
                    {t("To'lov")}
                </Button>

            </Box>

            {/* SMS yuborish */}
            <Dialog open={open === 'sms'} onClose={() => setOpen(null)}>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <TextField
                        multiline
                        fullWidth
                        rows={4}
                        label={t("yozing...")}
                        sx={{ marginBottom: '10px' }}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <LoadingButton loading={loading} onClick={sendSms} variant='outlined' fullWidth>{t('Yuborish')}</LoadingButton>
                </DialogContent>
            </Dialog>

            {/* SMS pack */}
            <Dialog open={open === 'pack'} onClose={() => setOpen(null)}>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <TextField
                        fullWidth
                        label={t("SMS soni")}
                        sx={{ marginBottom: '10px' }}
                        type='number'
                    />
                    <Button variant='outlined' fullWidth>{t('Saqlash')}</Button>
                </DialogContent>
            </Dialog>

            {/* Payment */}
            <Dialog open={open === 'payment'} onClose={() => setOpen(null)}>
                <DialogContent sx={{ minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        fullWidth
                        label={t("Summa")}
                        sx={{ marginBottom: '10px' }}
                        type='number'
                    />
                    <TextField
                        fullWidth
                        label={t("Sana")}
                        sx={{ marginBottom: '10px' }}
                        type='date'
                        defaultValue={today}
                    />
                    <Button variant='outlined' fullWidth>{t('Saqlash')}</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}