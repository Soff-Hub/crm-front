"use client"
import { useContext, useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, DialogContent, DialogTitle, FormControl, FormHelperText, TextField, Typography, IconButton as IconButtonMui } from '@mui/material';
import api from 'src/@core/utils/api';
import { DateRangePicker, IconButton } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import Router, { useRouter } from 'next/router';
import format from 'date-fns/format';
import IconifyIcon from 'src/@core/components/icon';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import LoadingButton from '@mui/lab/LoadingButton';
import dynamic from 'next/dynamic';
import { AuthContext } from 'src/context/AuthContext';
import { toast } from 'react-hot-toast';
import SourceStatsVertical from 'src/@core/components/card-statistics/card-source-vertical';

// Dynamically import components
const CardStatsVertical = dynamic(() => import('src/@core/components/card-statistics/card-stats-vertical'));
const EmptyContent = dynamic(() => import('src/@core/components/empty-content'));
const CustomeDrawer = dynamic(() => import('../settings/office/courses').then(mod => mod.CustomeDrawer));

const Stats = () => {
    const [sources, setSources] = useState<{ id: number, name: string, students_count: number }[]>([])
    const [filter, setFilter] = useState<'a' | 1>('a')
    const [date, setDate] = useState<any>('')
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const router = useRouter()
    const { user } = useContext(AuthContext)

    const getSources = async () => {
        const start_date = date?.[0] ? format(date?.[0], 'yyyy-MM-dd') : ''
        const end_date = date?.[1] ? format(date?.[1], 'yyyy-MM-dd') : ''

        await api.get(`leads/statistic/`, { params: { start_date, end_date } }).then(resp => setSources(resp.data.result)).catch(err => console.log(err)).finally(() => console.log('finish'))
    }

    const handleFilter = (value: any) => {
        setFilter(value)
        if (value === 'a') {
            setSources(sources.sort((a, b) => a.name.localeCompare(b.name)))
        } else {
            setSources(sources.sort((a, b) => b.students_count - a.students_count))
        }
    }

    const handleChangeDate = (e: any) => {
        setDate(e)
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
    });

    const initialValues = { name: '' }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (valuess) => {
            setLoading(true)
            try {
                await api.post(`leads/source/`, valuess)
                await getSources()
                setOpen(false)
            } catch (err: any) {
                if (err?.response?.data) {
                    formik.setErrors(err?.response?.data)
                }
            }
            setLoading(false)
        }
    });


    useEffect(() => {
        if (!user?.role.includes('ceo') && !user?.role.includes('admin')) {
            router.push("/")
            toast.error('Sahifaga kirish huquqingiz yoq!')
        }
        getSources()
    }, [date])


    return (
        <div>
            <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center' }}>
                <IconButtonMui color='primary'>
                    <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={() => Router.back()} />
                </IconButtonMui>
                <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t("Manbalar hisoboti")}</Typography>
            </Box>
            <Box sx={{ alignItems: 'center', paddingBottom: '20px', flexWrap: 'nowrap', width: '100%', display: 'flex' }}>
                <DateRangePicker format="yyyy-MM-dd" onChange={handleChangeDate} translate={'yes'} size="sm" style={{ marginRight: 20 }} />
                <ButtonGroup size="small">
                    <Button variant={filter === 'a' ? 'contained' : 'outlined'} onClick={() => handleFilter('a')}>A {">"} Z</Button>
                    <Button variant={filter === 1 ? 'contained' : 'outlined'} onClick={() => handleFilter(1)}>1 {">"} 0</Button>
                </ButtonGroup>
                <Button onClick={() => setOpen(true)} variant='contained' sx={{ marginLeft: 'auto' }} size='small' startIcon={<IconifyIcon icon={'carbon:add'} />}>{t("Yangi Manba")}</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {
                    sources.length ? sources.map((el, i) => (
                        <Box key={i} className='' sx={{ cursor: 'pointer', minHeight: '100px', minWidth: '180px' }}>
                            <SourceStatsVertical title={el.name} stats={`${el.students_count}`} color={'success'} />
                        </Box>
                    )) : <EmptyContent />
                }
            </Box>


            <CustomeDrawer open={open} variant='temporary' anchor='right'>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component='span'>
                        {t("Yangi manba yaratish")}
                    </Typography>
                    <IconButton
                        aria-label='close'
                        onClick={() => setOpen(false)}
                        icon={<IconifyIcon icon={'mdi:close'} />}
                    >
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <form style={{ paddingTop: '10px' }} onSubmit={formik.handleSubmit}>
                        <FormControl sx={{ width: '100%', marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                size='small'
                                label={t("Manba nomi")}
                                name='name'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                                error={!!formik.errors.name && formik.touched.name}
                            />
                            {formik.errors.name && formik.touched.name && <FormHelperText error={true}>{formik.errors.name}</FormHelperText>}
                        </FormControl>
                        <LoadingButton type='submit' loading={loading} fullWidth variant='contained'>{t('Saqlash')}</LoadingButton>
                    </form>
                </DialogContent>
            </CustomeDrawer>
        </div>
    );
}

export default Stats;
