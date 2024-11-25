import { useEffect } from 'react';
import { CreatesDepartmentState } from 'src/types/apps/leadsTypes';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { createDepartmentItem, fetchDepartmentList } from 'src/store/apps/leads';


type Props = {}

export default function CreateDepartmentItemForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { loading, leadData, openItem } = useAppSelector((state) => state.leads)

    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
    });

    const initialValues: CreatesDepartmentState = { name: '', order: leadData.length + 1 }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {

            const newValues = { ...values, parent: openItem }
            const resp = await dispatch(createDepartmentItem(newValues))

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

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yaratish")}</LoadingButton>
        </form>
    )
}