import { useEffect } from 'react';
import { CreatesDepartmentState } from 'src/types/apps/leadsTypes';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { createDepartmentItem, fetchDepartmentList, setDragonLoading, setLeadItems } from 'src/store/apps/leads';
import { useRouter } from 'next/router';
import api from 'src/@core/utils/api';


type Props = {}

export default function CreateDepartmentItemForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { loading, leadData, openItem } = useAppSelector((state) => state.leads)
    const {query} = useRouter()
    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
    });

    const initialValues: CreatesDepartmentState = { name: '', order: leadData.length + 1 }

    async function handleGetLealdItems() {
        if (!query?.id) return
        dispatch(setDragonLoading(true))
    
        try {
          const res = await api.get(`leads/department/${query?.id}`)
          dispatch(setLeadItems(res.data))
        } catch (err) {
          console.error('Error fetching leads:', err)
        } finally {
          dispatch(setDragonLoading(false))
        }
      }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {

            const newValues = { ...values, parent: openItem }
            const resp = await dispatch(createDepartmentItem(newValues))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                if (query.id) {
                    await handleGetLealdItems()
                }
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