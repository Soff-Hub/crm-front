import React, { useEffect } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, InputLabel, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { updateDepartmentStudent } from 'src/store/apps/leads';
import { reversePhone } from 'src/@core/components/phone-input/format-phone-number';
import PhoneInput from 'src/@core/components/phone-input';


type Props = {
    item: any
    reRender: any
}

export default function EditAnonimUserForm({ item, reRender }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.leads)

    const validationSchema = Yup.object({
        first_name: Yup.string().required("Ism kiriting"),
        phone: Yup.string().required("Telefon raqam kiriting"),
    });

    const initialValues: {
        first_name: string
        phone: string
    } = {
        first_name: item.title,
        phone: item.phone,
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const resp = await dispatch(updateDepartmentStudent({ id: item.id, ...values, phone: reversePhone(values.phone) }))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                await reRender()
                formik.resetForm()
            }
        }
    });

    const { values, errors, touched, handleBlur, handleChange } = formik

    useEffect(() => {

        return () => {
            formik.resetForm()
        }
    }, [])


    return (
        <form onSubmit={formik.handleSubmit} style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            <FormControl fullWidth>
                <TextField
                    fullWidth
                    size='small'
                    label={t('first_name')}
                    name='first_name'
                    error={!!errors.first_name && touched.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                />
                {!!errors.first_name && touched.first_name && <FormHelperText error>{formik.errors.first_name}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel error={!!errors.phone && touched.phone} htmlFor="login-input">{t('phone')}</InputLabel>
                <PhoneInput
                    fullWidth
                    label={t('phone')}
                    id='login-input'
                    error={!!errors.phone && touched.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                />
                {!!errors.phone && touched.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yaratish")}</LoadingButton>
        </form>
    )
}