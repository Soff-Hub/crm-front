import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import toast from 'react-hot-toast';


type Props = {
    smsTemps: any[]
    users: number[]
    setLoading: any
    loading: boolean
    setOpenDialog: any
}

export default function DepartmentSendSmsForm({
    smsTemps,
    loading,
    setLoading,
    users,
    setOpenDialog
}: Props) {

    const { t } = useTranslation()
    const [sms, setSMS] = useState<any>("")

    const validationSchema = Yup.object({
        message: Yup.string().required("Sms matni kiriting"),
    });

    const initialValues: { message: string } = { message: '' }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await api.post(`common/send-message-user/`, {
                    users,
                    message: values.message,
                    for_lead: true
                })
                toast.success(`${t("SMS muvaffaqiyatli jo'natildi!")}`, {
                    position: 'top-center'
                })
                setLoading(false)
                setOpenDialog(null)
                formik.resetForm()
            } catch {
                setLoading(false)
            }
        }
    });


    useEffect(() => {

        return () => {
            formik.resetForm()
        }
    }, [])


    return (
        <form onSubmit={formik.handleSubmit} style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FormControl>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Shablonlar")}</InputLabel>
                <Select
                    size='small'
                    label="Shablonlar"
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    onChange={(e) => {
                        setSMS(true)
                        formik.setFieldValue('message', e.target.value)
                    }}
                >
                    {
                        smsTemps.map((el: any) => (
                            <MenuItem value={el.description} sx={{ wordBreak: 'break-word' }}>
                                <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>
                                    {el.description}
                                </span>
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <FormControl fullWidth>
                {sms ? (
                    <TextField
                        label={t("SMS matni")}
                        multiline rows={4}
                        size='small'
                        name='message'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.message}
                        error={!!formik.errors.message && formik.touched.message}
                    />
                ) : (
                    <TextField
                        label={t("SMS matni")}
                        multiline rows={4}
                        size='small'
                        name='message'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.message}
                        error={!!formik.errors.message && formik.touched.message}
                    />
                )}
                {formik.errors.message && formik.touched.message && <FormHelperText error={true}>{formik.errors.message}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yuborish")}</LoadingButton>

        </form>
    )
}