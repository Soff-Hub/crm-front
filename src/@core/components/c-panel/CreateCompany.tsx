import { Box, FormControl, FormHelperText, FormLabel, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Form from '../form'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconifyIcon from '../icon';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import Router from 'next/router';
import showResponseError from 'src/@core/utils/show-response-error';
import LoadingButton from '@mui/lab/LoadingButton';

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
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    padding: '0px 30px'
                }}
            >
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
                        alignItems: 'center'
                    }}
                >

                    <Box sx={{
                        display: 'flex',
                        gap: '20px',
                        maxWidth: '600px',
                        width: '100%',
                        flexDirection: 'column'
                    }} >
                        <Typography sx={{ fontSize: '20px', borderBottom: '1px solid white', marginBottom: '20px' }}>{t("Yangi o'quv markaz yaratish uchun quyidagi ma'lumotlarni to'ldiring")}</Typography>

                        <FormControl fullWidth>
                            <TextField error={error?.name} size='small' label={t("Nomi")} name='name' />
                            <FormHelperText error={error?.name}>{error?.name}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField error={error?.reference_name} size='small' label={t("Masul shaxs ismi")} name='reference_name' />
                            <FormHelperText error={error?.reference_name}>{error?.reference_name}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField error={error?.reference_phone} size='small' label={t("Masul shaxs raqami")} name='reference_phone' defaultValue={'+998'} />
                            <FormHelperText error={error?.reference_phone}>{error?.reference_phone}</FormHelperText>
                        </FormControl>

                        <Box style={{ display: 'flex', gap: '8px' }}>
                            <FormControl fullWidth>
                                <Input error={error?.domain} placeholder='example' autoComplete='off' size='small' name='domain' style={{ width: '100%' }} endAdornment=".soffcrm.uz" />
                                <FormHelperText error={error?.domain}>{error?.domain}</FormHelperText>
                            </FormControl>
                        </Box>

                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            startIcon={<IconifyIcon icon={'lets-icons:upload'} />}
                        >
                            {t('Logo yuklash')}
                            <VisuallyHiddenInput accept='.png, .jpg, .jpeg, .webp' name='logo' type="file" />
                        </Button>

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
        </Box>
    )
}