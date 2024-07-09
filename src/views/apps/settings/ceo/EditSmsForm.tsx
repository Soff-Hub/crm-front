import { FormControl, FormHelperText, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { editSms, setOpenEditSms } from 'src/store/apps/settings'
import { useAppDispatch } from 'src/store'
import LoadingButton from '@mui/lab/LoadingButton'
import { SmsItemType } from 'src/types/apps/settings'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'

type Props = {
    initialValues: SmsItemType
}

export default function EditSmsform({ initialValues }: Props) {

    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const setOpenAddGroup = () => {
        dispatch(setOpenEditSms(null))
        formik.resetForm()
    }

    const validationSchema = Yup.object({
        description: Yup.string().required("Xabarni kiriting")
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            dispatch(disablePage(true))
            await dispatch(editSms(values))
            dispatch(disablePage(false))
            toast.success("O'zgarishlar muvaffaqiyatli saqlandi")
            setOpenAddGroup()
            setLoading(false)
        }
    });

    const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik

    useEffect(() => {

        return () => {
            formik.resetForm()
        }
    }, [])


    return (
        <form
            onSubmit={handleSubmit}
            id='posts-courses-id'
            style={{
                padding: '10px 20px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginTop: '15px'
            }}
        >
            <FormControl fullWidth>
                <TextField
                    multiline
                    rows={10}
                    label={t("SMS Matni")}
                    size='small'
                    name='description'
                    error={!!errors.description && !!touched.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.description}
                />
                {!!errors.description && touched.description && <FormHelperText error>{!!errors.description}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
                {' '}
                {t('Saqlash')}
            </LoadingButton>
        </form>
    )
}