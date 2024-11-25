import { Box, FormControl, FormHelperText, InputLabel, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import IconifyIcon from '../../icon';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useAppDispatch, useAppSelector } from 'src/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from '../../phone-input';
import { fetchCompanyDetails, updateClient } from 'src/store/apps/c-panel/companySlice';
import { toast } from 'react-hot-toast';
import { reversePhone } from '../../phone-input/format-phone-number';

export default function EditDetails() {
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const { isMobile } = useResponsive()
    const { details } = useAppSelector(state => state.companyDetails)
    const dispatch = useAppDispatch()
    const { query } = useRouter()

    const validationSchema = Yup.object({
        name: Yup.string().required(t("Markaz nomi kiritilishi kerak") as string),
        reference_name: Yup.string().required(t("Masul shaxs ismini kiritish kerak") as string),
        reference_phone: Yup.string().required(t("Masul shaxs raqami kiritilishi kerak") as string),
    });

    const formik: any = useFormik({
        initialValues: {
            name: details?.name,
            reference_name: details?.reference_name,
            reference_phone: details?.reference_phone,
        },
        validationSchema,
        onSubmit: async (values: Partial<any>) => {
            setLoading(true)
            const response = await dispatch(updateClient({ id: Number(query?.slug), formData: values }))
            if (response.meta.requestStatus == "rejected") {
                if (typeof response.payload !== "string") {
                    formik.setErrors(response.payload)
                } else toast.error(t("Markaz ma'lumotlarni tahrirlab bo'lmadi") as string)
            } else {
                toast.success(t("Ma'lumot yangilandi") as string)
                await dispatch(fetchCompanyDetails(Number(query?.slug)))
            }
            setLoading(false)
        }
    });

    useEffect(() => {
        formik.setFieldValue("name", details?.name)
        formik.setFieldValue("reference_phone", details?.reference_phone)
        formik.setFieldValue("reference_name", details?.reference_name)
    }, [details])

    return (
        <form
            onSubmit={formik.handleSubmit}
            style={{
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
                    <TextField
                        name='name'
                        size='medium'
                        label={t("Markaz nomi")}
                        error={!!formik.errors.name && !!formik.touched.name}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error={!!formik.errors.name && !!formik.touched.name}>{!!formik.errors.name && !!formik.touched.name && formik.errors.name}</FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        name='reference_name'
                        size='medium'
                        label={t("Masul shaxs ismi")}
                        error={!!formik.errors.reference_name && !!formik.touched.reference_name}
                        value={formik.values.reference_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error={!!formik.errors.reference_name && !!formik.touched.reference_name}>{!!formik.errors.reference_name && !!formik.touched.reference_name && formik.errors.reference_name}</FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel error={!!formik.errors.reference_phone && !!formik.touched.reference_phone} htmlFor="login-input">{t('Masul shaxs raqami')}</InputLabel>
                    <PhoneInput
                        name="reference_phone"
                        label={t('Masul shaxs raqami')}
                        onChange={(e) => formik.setFieldValue("reference_phone", reversePhone(e.target.value))}
                        onBlur={formik.handleBlur}
                        value={formik.values.reference_phone}
                        error={!!formik.errors.reference_phone && !!formik.touched.reference_phone}
                        size='medium'
                    />
                    <FormHelperText error={!!formik.errors.reference_phone && !!formik.touched.reference_phone}>{!!formik.errors.reference_phone && !!formik.touched.reference_phone && formik.errors.reference_phone}</FormHelperText>
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
        </form>
    )
}
