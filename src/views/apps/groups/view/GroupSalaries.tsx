// import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';

export default function GroupSalaries({ group }: any) {
    const [value, setValue] = useState<any>('')
    const [fine, setFine] = useState<any>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const { query } = useRouter()
    const [data, setData] = useState<any>(null)
    const { t } = useTranslation()

    function handleChange(text: any, set: any) {
        let sonlar = text.match(/[0-9-]+/g);

        if (sonlar) {
            set(sonlar.join())
        } else set('')
    }

    const getAmount = async () => {
        setLoading(true)
        try {
            const resp = await api.get(`common/teacher-per-students/list/${query?.id}/`)
            if (resp.data.length) {
                setValue(resp.data[0].allocated_amount)
                setFine(resp.data[0].fine_amount)
                setData(resp.data[0]);
            }

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const resp = await api.post('common/teacher-per-students/create/', {
                teacher: group?.teacher_data?.id,
                group: query?.id,
                allocated_amount: value,
                fine_amount: fine
            })
            toast.success("Muvaffaqiyatli yaratildi")
            getAmount()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async () => {
        setLoading(true)
        try {
            await api.patch(`common/teacher-per-students/update/${data?.id}/`, {
                teacher: group?.teacher_data?.id,
                group: query?.id,
                allocated_amount: value,
                fine_amount: fine
            })
            toast.success("Muvaffaqiyatli yangilandi")
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getAmount()
    }, [])



    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {
                data ? (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '5px' }}>
                            <Typography>
                                {t("Har bir o'quvchi uchun o'qituvchiga to'lanadigan oylik summa")}
                            </Typography>
                            <TextField size='small' onChange={(e) => handleChange(e.target.value, setValue)} value={value} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '5px' }}>
                            <Typography>
                                {t("Har bir jarima uchun o'qituvchidan olinadigan summa")}
                            </Typography>
                            <TextField size='small' onChange={(e) => handleChange(e.target.value, setFine)} value={fine} />
                        </Box>
                        <LoadingButton onClick={handleEdit} loading={loading} variant='contained'>{t('Saqlash')}</LoadingButton></>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '5px' }}>
                            <Typography>
                                {t("Har bir o'quvchi uchun o'qituvchiga to'lanadigan oylik summa")}
                            </Typography>
                            <TextField size='small' onChange={(e) => handleChange(e.target.value, setValue)} value={value} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '5px' }}>
                            <Typography>
                                {t("Har bir jarima uchun o'qituvchidan olinadigan summa")}
                            </Typography>
                            <TextField size='small' onChange={(e) => handleChange(e.target.value, setFine)} value={fine} />
                        </Box>
                        <LoadingButton onClick={handleSubmit} loading={loading} variant='contained'>Saqlash</LoadingButton></>
                )
            }
        </Box>
    )
}
