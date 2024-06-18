import { Box, Card, CardContent, FormControl, FormHelperText, FormLabel, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Form from '../form'
import { styled } from '@mui/material/styles';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import Router from 'next/router';
import showResponseError from 'src/@core/utils/show-response-error';
import { formatCurrency } from 'src/@core/utils/format-currency';
import CompanyCardActions from './CompanyCardActions';
import CompanyPaymentList from './CompanyPaymentList';
import CompanySmsHistory from './CompanySmsHistory';
import LoadingButton from '@mui/lab/LoadingButton';
import IconifyIcon from '../icon';

type Props = {
    slug?: number | undefined
}


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



export default function CreateCompany({ slug }: Props) {

    const [error, setError] = useState<any>({})
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)

    async function handleSubmit(values: any) {
        setLoading(true)
        try {
            await api.post(`/owner/create/client/`, values)
            Router.push('/c-panel')
        } catch (err: any) {
            showResponseError(err?.response?.data, setError)
            console.log(err?.response?.data);

        } finally {
            setLoading(false)
        }
    }

    const statsFields = {
        student_count: {
            name: "O'quvchilar soni",
            value: "435"
        },
        sms_service: {
            name: "SMS xizmati",
            value: "721"
        },
        last_payment: {
            name: "Oxirgi to'lov",
            value: "28.05.2024"
        },
        next_payment: {
            name: "Keyingi to'lov",
            value: "28.06.2024"
        },
        last_amount: {
            name: "Oylik to'lov",
            value: "500000"
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    padding: '0px',
                    display: 'flex',
                    gap: '20px',
                    flexDirection: isMobile ? 'column' : 'row'
                }}
            >
                <Card sx={{ maxWidth: '400px', minWidth: isMobile ? '300px' : '400px', marginTop: '18px' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography>
                                {t(statsFields.student_count.name)} -
                            </Typography>
                            <Typography color={'green'}>
                                {statsFields.student_count.value}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography>
                                {t(statsFields.sms_service.name)}
                            </Typography>
                            <Typography color={'green'}>
                                {statsFields.sms_service.value}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography>
                                {t(statsFields.last_payment.name)}
                            </Typography>
                            <Typography color={'green'}>
                                {statsFields.last_payment.value}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography>
                                {t(statsFields.next_payment.name)}
                            </Typography>
                            <Typography color={'green'}>
                                {statsFields.next_payment.value}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography>
                                {t(statsFields.last_amount.name)}
                            </Typography>
                            <Typography color={'green'}>
                                {formatCurrency(statsFields.last_amount.value)} so'm
                            </Typography>
                        </Box>
                        <CompanyCardActions />
                    </CardContent>
                </Card>
                <CompanySmsHistory />
                <CompanyPaymentList />
            </Box>
            <Form
                valueTypes='form-data'
                id='create-company'
                onSubmit={handleSubmit}
                setError={setError}
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: '20px',
                    flexDirection: !isMobile ? 'column' : 'row',
                    marginTop: '20px'
                }}
            >

                <Box sx={{
                    display: 'flex',
                    gap: '20px',
                    maxWidth: '400px',
                    width: '100%',
                    flexDirection: 'column'
                }} >
                    <Typography sx={{ fontSize: '20px' }}>{t("O'quv markaz tahrirlash uchun quyidagi ma'lumotlarni to'ldiring")}</Typography>

                    <FormControl fullWidth>
                        <TextField error={error?.name?.error} size='small' label={t("Nomi")} name='name' />
                        <FormHelperText error={error?.name?.error}>{error?.name?.message}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField error={error?.reference_name?.error} size='small' label={t("Masul shaxs ismi")} name='reference_name' />
                        <FormHelperText error={error?.reference_name?.error}>{error?.reference_name?.message}</FormHelperText>
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField error={error?.reference_phone?.error} size='small' label={t("Masul shaxs raqami")} name='reference_phone' defaultValue={'+998'} />
                        <FormHelperText error={error?.reference_phone?.error}>{error?.reference_phone?.message}</FormHelperText>
                    </FormControl>

                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        startIcon={<IconifyIcon icon={'fluent:save-16-regular'} />}
                        type='submit'
                    >
                        {t('Saqlash')}
                    </LoadingButton>
                </Box>
            </Form>
        </Box>
    )
}