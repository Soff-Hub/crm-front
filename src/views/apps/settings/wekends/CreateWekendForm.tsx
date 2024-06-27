import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'src/store'
import { createWekend, fetchWekends, setOpenCreateSms } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { today } from 'src/@core/components/card-statistics/kanban-item'

type Props = {}

export default function CreateWekendForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState<boolean>(false)

    const setOpenAddGroup = () => {
        dispatch(setOpenCreateSms(null))
    }

    const validationSchema = Yup.object({
        date: Yup.string().required("Nom kiriting"),
        description: Yup.string().required("Sabab yozing"),
    });

    const formik = useFormik({
        initialValues: {
            date: today,
            description: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            const resp = await dispatch(createWekend(values))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
                setLoading(false)
            } else {
                setLoading(false)
                await dispatch(fetchWekends())
                formik.resetForm()
                return setOpenAddGroup()
            }
        }
    })

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
                    label={t('Sana')}
                    size='small'
                    name='date'
                    type='date'
                    error={!!errors.date && touched.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.date}
                />
                {errors.date && touched.date && <FormHelperText error>{errors.date}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    label={t('Sabab')}
                    size='small'
                    multiline
                    rows={4}
                    name='description'
                    error={!!errors.description && touched.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                />
                {errors.description && touched.description && <FormHelperText error>{errors.description}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='contained' color='success' fullWidth>
                {' '}
                {t("Saqlash")}
            </LoadingButton>
        </form>
    )
}