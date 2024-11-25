import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { createGroup, editRoom, fetchCoursesList, fetchRoomList, setOpenEditRoom } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useBranches from 'src/hooks/useBranch'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'

type Props = {}

export default function EditRoomForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { branches, getBranches } = useBranches()
    const { openEditRoom, active_page } = useAppSelector(state => state.settings)

    const [loading, setLoading] = useState<boolean>(false)

    const setOpenAddGroup = () => {
        dispatch(setOpenEditRoom(null))
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
    });

    const formik: any = useFormik({
        initialValues: {
            name: openEditRoom?.name,
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            dispatch(disablePage(true))
            const resp = await dispatch(editRoom({ ...values, id: openEditRoom?.id }))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
                setLoading(false)
            } else {
                setLoading(false)
                toast.success("O'zgarishlar muvaffaqiyatli saqlandi")
                await dispatch(fetchRoomList({ page: active_page }))
                formik.resetForm()
                setOpenAddGroup()
            }
            dispatch(disablePage(false))
        }
    })

    const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik


    useEffect(() => {
        getBranches()

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
                    label={t('Nomi')}
                    size='small'
                    name='name'
                    error={!!errors.name && touched.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                />
                {errors.name && touched.name && <FormHelperText error>{errors.name}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
                {' '}
                {t("Saqlash")}
            </LoadingButton>
        </form>
    )
}