import React, { useEffect } from 'react'
import { CreatesDepartmentState } from 'src/types/apps/leadsTypes'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'src/store';
import { fetchDepartmentList } from 'src/store/apps/leads';
import api from 'src/@core/utils/api';


type Props = {
    setLoading: any
    loading: boolean
    setOpenDialog: any
    id: number
    defaultName: string
}

export default function EditDepartmentItemForm({ setLoading, setOpenDialog, loading, id, defaultName }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
    });

    const initialValues: CreatesDepartmentState = { name: defaultName }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await api.patch(`leads/department-update/${id}`, values)
                setLoading(false)
                setOpenDialog(null)
                await dispatch(fetchDepartmentList())
                formik.resetForm()
            } catch {
                setLoading(false)
                // formik.setErrors(resp.payload)
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
            <FormControl fullWidth>
                <TextField
                    fullWidth
                    size='small'
                    label={t("Bo'lim nomi")}
                    name='name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    error={!!formik.errors.name && formik.touched.name}
                />
                {formik.errors.name && formik.touched.name && <FormHelperText error={true}>{formik.errors.name}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Saqlash")}</LoadingButton>
        </form>
    )
}