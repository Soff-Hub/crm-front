import { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchDepartmentList } from 'src/store/apps/leads';
import api from 'src/@core/utils/api';
import { setOpenLeadModal } from 'src/store/apps/groupDetails';
import { toast } from 'react-hot-toast';

export default function MergeToDepartment({ studentId }: { studentId: string }) {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { leadData } = useAppSelector((state) => state.leads)
    const [department, setDepartment] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const validationSchema = Yup.object({
        department: Yup.number().required(t("Bo'limni tanlang") as string)
    });

    const initialValues: {
        department: number | null
    } = {
        department: null
    }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const response = await api.post(`leads/back-to-lead/`, { ...values, group_student: studentId });
                if (response.status) {
                    dispatch(setOpenLeadModal(false)),
                        toast.success(t("Amaliyot bajarildi") as string)
                }
                formik.resetForm()
            } catch (err: any) {
                formik.setErrors(err.response.data)
            }
            setLoading(false)
        }
    });

    const { values, errors, touched, handleBlur, handleChange } = formik

    useEffect(() => {
        dispatch(fetchDepartmentList())
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
                    {leadData.find((item: any) => item.id === department)?.children?.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)}
                </Select>
                {!!errors.department && touched.department && <FormHelperText error>{errors.department}</FormHelperText>}
            </FormControl>}

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Ko'chirish")}</LoadingButton>
        </form>
    )
}