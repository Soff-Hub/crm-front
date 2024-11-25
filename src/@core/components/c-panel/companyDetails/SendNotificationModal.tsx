import {
    Dialog,
    DialogContent,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
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

export default function SendNotificationModal({ open, setOpen }: Props) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const { query } = useRouter()

    const validationSchema = Yup.object({
        body: Yup.string(),
        title: Yup.string().nullable().required("Xabar sarlavhasini kiriting"),
        role: Yup.string().nullable().required(t("Xodim lavozimin tanlang") as string),
    });

    const formik: any = useFormik({
        initialValues: {
            body: "",
            role: null,
            title: null,
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
            await api.post(`owner/send-notification/`, { ...values, tenant: query?.slug })
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
        <Dialog open={open === 'notification'} onClose={() => handleClose()}>
            <DialogContent >
                <form onSubmit={() => formik.handleSubmit()} style={{ minWidth: '300px', display: "flex", flexDirection: "column", gap: "20px" }}>
                    <Typography variant='h6' textAlign={"center"}>{t("Xabarnoma yuborish")}</Typography>
                    <FormControl fullWidth>
                        <InputLabel size='small' id='user-view-language-label'>{t("Xodim lavozimi")}</InputLabel>
                        <Select
                            size='small'
                            name='role'
                            label={t('Xodim lavozimi')}
                            id='user-view-language'
                            labelId='user-view-language-label'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.role || ""}
                            error={!!formik.errors?.role && !!formik.touched.role}
                        >
                            <MenuItem value={"admin"}>{t("Admin")}</MenuItem>
                            <MenuItem value={"ceo"}>{t("CEO")}</MenuItem>
                        </Select>
                        <FormHelperText error={!!formik.errors?.role && !!formik.touched.role}>{!!formik.errors?.role && !!formik.touched.role && formik.errors?.role}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            name='title'
                            size='small'
                            label={t("Sarlavha")}
                            multiline
                            error={!!formik.errors?.title && !!formik.touched.title}
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <FormHelperText error={!!formik.errors?.title && !!formik.touched.title}>{!!formik.errors?.title && !!formik.touched.title && formik.errors?.title}</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            name='body'
                            size='small'
                            label={t("Izoh")}
                            multiline
                            rows={4}
                            error={!!formik.errors?.body && !!formik.touched.body}
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <FormHelperText error={!!formik.errors?.body && !!formik.touched.body}>{!!formik.errors?.body && !!formik.touched.body && formik.errors?.body}</FormHelperText>
                    </FormControl>
                    <LoadingButton loading={loading} onClick={() => formik.handleSubmit()} variant='outlined' fullWidth>{t('Yuborish')}</LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}