import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchDepartmentList, updateDepartmentStudent } from 'src/store/apps/leads';


type Props = {
    item: any
    reRender: any
}

export default function MergeToDepartment({ item, reRender }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { loading, leadData } = useAppSelector((state) => state.leads)
    const [department, setDepartment] = useState<any>(null)

    const validationSchema = Yup.object({
        department: Yup.number().required("Bo'limni tanlang")
    });

    const initialValues: {
        department: number | null
    } = {
        department: null
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const resp = await dispatch(updateDepartmentStudent({ id: item.id, ...values }))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                // await reRender()
                await dispatch(fetchDepartmentList())
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
        <form onSubmit={formik.handleSubmit} style={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }}>

            <FormControl fullWidth>
                <InputLabel>{t("Bo'lim")}</InputLabel>
                <Select
                    label={t("Bo'lim")}
                    defaultValue={''}
                    onChange={(e) => setDepartment(e.target.value)} >
                    {
                        leadData.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                    }
                </Select>
            </FormControl>

            {department && <FormControl fullWidth>
                <InputLabel error={!!errors.department && touched.department}>{t("Bo'lim")}</InputLabel>
                <Select
                    label={t("Bo'lim")}
                    name='department'
                    error={!!errors.department && touched.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.department}
                >
                    {
                        leadData.find((item: any) => item.id === department)?.children?.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                    }
                </Select>
                {!!errors.department && touched.department && <FormHelperText error>{errors.department}</FormHelperText>}
            </FormControl>}

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Ko'chirish")}</LoadingButton>
        </form>
    )
}