import { Box, FormControl, FormHelperText, FormLabel, Input, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Form from '../form'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconifyIcon from '../icon';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import Router from 'next/router';
import showResponseError from 'src/@core/utils/show-response-error';
import { CompanyType } from './CompanyList';
import Image from 'next/image'

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



export default function EditCompany({ slug }: Props) {

    const [error, setError] = useState<any>({})
    const { isMobile } = useResponsive()
    const { t } = useTranslation()
    const [data, setData] = useState<CompanyType | null>(null)

    async function handleSubmit(values: any) {
        try {
            await api.post(`/owner/create/client/`, values)
            Router.push('/c-panel')
        } catch (err: any) {
            showResponseError(err?.response?.data, setError)
        }
    }

    const getData = async () => {
        const resp = await api.get('/owner/list/client/')
        const element = resp.data.find((el: CompanyType) => el.id === Number(slug))
        setData(element)
    }

    console.log(data);


    useEffect(() => {
        getData()
    }, [])

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

                    {data && <Box sx={{
                        display: 'flex',
                        gap: '20px',
                        maxWidth: '600px',
                        width: '100%',
                        flexDirection: 'column'
                    }} >
                        <Typography sx={{ fontSize: '20px', borderBottom: '1px solid white', marginBottom: '20px' }}>{t("Yangi o'quv markaz yaratish uchun quyidagi ma'lumotlarni to'ldiring")}</Typography>

                        <FormControl fullWidth>
                            <TextField error={error?.name} defaultValue={data.name} size='small' label={t("Nomi")} name='name' />
                            <FormHelperText error={error?.name}>{error?.name}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField error={error?.reference_name} defaultValue={data.reference_name} size='small' label={t("Masul shaxs ismi")} name='reference_name' />
                            <FormHelperText error={error?.reference_name}>{error?.reference_name}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField error={error?.reference_phone} size='small' label={t("Masul shaxs raqami")} name='reference_phone' defaultValue={data?.reference_phone} />
                            <FormHelperText error={error?.reference_phone}>{error?.reference_phone}</FormHelperText>
                        </FormControl>

                        {/* <Box style={{ display: 'flex', gap: '8px' }}>
                            <FormControl fullWidth>
                                <TextField size='small' label={t("Login")} name='login' defaultValue={'+998'} style={{ width: '100%' }} />
                                <FormHelperText error={error?.login}>{error?.login}</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth>
                                <TextField size='small' label={t("Parol")} name='password' style={{ width: '100%' }} />
                                <FormHelperText error={error?.password}>{error?.password}</FormHelperText>
                            </FormControl>
                        </Box> */}

                        <Box style={{ display: 'flex', gap: '8px' }}>
                            {/* <FormControl sx={{ width: '100%' }}>
                                <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Status')}</InputLabel>
                                <Select
                                    size='small'
                                    label={t('Status')}
                                    id='demo-simple-select-outlined'
                                    labelId='demo-simple-select-outlined-label'
                                    defaultValue={'active'}
                                >
                                    <MenuItem value={'active'}>{'Aktiv'}</MenuItem>
                                    <MenuItem value={'no-active'}>{'no aktiv'}</MenuItem>
                                </Select>
                            </FormControl> */}


                            <FormControl fullWidth>
                                <Input error={error?.domain} placeholder='example' autoComplete='off' size='small' name='domain' style={{ width: '100%' }} endAdornment=".soffcrm.uz" />
                                <FormHelperText error={error?.domain}>{error?.domain}</FormHelperText>
                            </FormControl>
                        </Box>

                        <Box>
                            <Image src={data.logo} width={200} height={200} alt='logo' style={{ width: '200px', height: '200px' }} />
                        </Box>

                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            startIcon={<IconifyIcon icon={'lets-icons:upload'} />}
                        >
                            {t('Logo yuklash')}
                            <VisuallyHiddenInput onChange={(e: any) => {
                                setData(c => c ? ({ ...c, logo: window.URL.createObjectURL(e.target?.files?.[0]) }) : null)
                            }} accept='.png, .jpg, .jpeg, .webp' name='logo' type="file" />
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<IconifyIcon icon={'fluent:save-16-regular'} />}
                            type='submit'
                        >
                            {t('Saqlash')}
                        </Button>
                    </Box>}
                </Form>
            </Box>
        </Box>
    )
}