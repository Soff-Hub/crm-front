import { Dialog, DialogContent, FormControl, FormHelperText, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import { fetchSMSHistory } from 'src/store/apps/c-panel/companySlice';
import { useAppDispatch } from 'src/store';
import { toast } from 'react-hot-toast';
import { useFormik } from "formik";
import * as Yup from "yup";

type Props = {
    open: null | 'sms' | 'payment' | 'pack' | 'notification'
    setOpen: React.Dispatch<React.SetStateAction<null | 'sms' | 'payment' | 'pack' | 'notification'>>
}

export default function SendMessageModal({ open, setOpen }: Props) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const { query } = useRouter()

    const validationSchema = Yup.object({
        message: Yup.string().required("Xabar kiriting"),
    });

    const formik: any = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema,
        onSubmit: async (values: Partial<any>) => {
            await sendNotification(values)
        }
    });
    const handleClose = () => {
        formik.resetForm()
        setOpen(null)
        setLoading(false)
    }

    const sendNotification = async (values: any) => {
        setLoading(true)
        try {
            await api.post(`owner/send-message/`, { ...values, client: query?.slug })
            toast.success("Xabar yuborildi")
            query?.slug && dispatch(fetchSMSHistory(Number(query?.slug)))
            handleClose()
        } catch (err: any) {
            toast.error("Xabarni jo'natib bo'lmadi")
            formik.setErrors(err?.response?.data)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open === 'sms'} onClose={() => handleClose()}>
            <DialogContent >
                <form onSubmit={() => formik.handleSubmit()} style={{ minWidth: '300px', display: "flex", flexDirection: "column", gap: "20px" }}>
                    <Typography variant='h6' textAlign={"center"}>{t("SMS yuborish")}</Typography>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            name='message'
                            size='small'
                            label={t("Xabar")}
                            multiline
                            rows={4}
                            error={!!formik.errors?.message && !!formik.touched.message}
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <FormHelperText error={!!formik.errors?.message && !!formik.touched.message}>{!!formik.errors?.message && !!formik.touched.message && formik.errors?.message}</FormHelperText>
                    </FormControl>
                    <LoadingButton loading={loading} onClick={() => formik.handleSubmit()} variant='outlined' fullWidth>{t('Yuborish')}</LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}