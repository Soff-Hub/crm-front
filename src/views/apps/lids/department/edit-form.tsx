import React, { useEffect } from 'react'
import { CreatesDepartmentState } from 'src/types/apps/leadsTypes'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { editDepartment, fetchDepartmentList } from 'src/store/apps/leads';


type Props = {
    id: number
    name: string
}


export default function EditDepartmentForm({ id, name }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector((state) => state.leads)

    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
    });

    const initialValues: CreatesDepartmentState = { name }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (valuess) => {

            const resp = await dispatch(editDepartment({ name: valuess.name, id }))

            
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                await dispatch(fetchDepartmentList())
                formik.resetForm()
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

            <FormControl sx={{ width: '100%' }}>
                <TextField
                    fullWidth
                    size='small'
                    label={t("Bo'lim nomi")}
                    name='name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    error={!!formik.errors.name}
                />
                {formik.errors.name && <FormHelperText error={true}>{formik.errors.name}</FormHelperText>}
            </FormControl>
            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Saqlash")}</LoadingButton>

        </form>
    )
}