import React, { useEffect } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { createDepartmentStudent, fetchDepartmentList, setAddSource } from 'src/store/apps/leads';
import IconifyIcon from 'src/@core/components/icon';


type Props = {}

export default function CreateAnonimUserForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { loading, leadData, openLid, addSource, sourceData } = useAppSelector((state) => state.leads)

    const validationSchema = Yup.object({
        department: Yup.string().required("Bo'lim tanlang"),
        source_name: Yup.string().required("Manbani kiritiing"),
        first_name: Yup.string().required("Ism kiriting"),
        phone: Yup.string()
            .matches(/^\+998\d{9}$/, "Telefon raqam noto'g'ri formatda. +998 XX XXX XX XX")
            .required("Telefon raqam kiriting"),
        body: Yup.string()
    });

    const initialValues: {
        department: string
        source_name: string | number
        first_name: string
        phone: string
        body?: string
    } = {
        department: '',
        source_name: '',
        first_name: '',
        phone: '',
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const resp = await dispatch(createDepartmentStudent(values))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
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
        <form onSubmit={formik.handleSubmit} style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FormControl fullWidth>
                <InputLabel error={!!errors.department && touched.department} size='small' id='user-view-language-label'>{t('Bo\'lim')}</InputLabel>
                <Select
                    size='small'
                    label={t('Bo\'lim')}
                    id='user-view-language'
                    labelId='user-view-language-label'
                    name='department'
                    sx={{ mb: 1 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.department}
                    error={!!errors.department && touched.department}
                >
                    {
                        leadData.some((el: any) => el.id === openLid) ? leadData?.find((el: any) => el.id === openLid)?.children?.map((lead: any) => <MenuItem key={lead.id} value={Number(lead.id)}>{lead.name}</MenuItem>) : <></>
                    }
                </Select>
                {!!errors.department && touched.department && <FormHelperText error={true}>{formik.errors.department}</FormHelperText>}
            </FormControl>

            {!addSource ? (
                <FormControl fullWidth>
                    <InputLabel size='small' id='fsdgsdgsgsdfsd-label'>{t('Manba')}</InputLabel>
                    <Select
                        size='small'
                        label={t('Manba')}
                        labelId='fsdgsdgsgsdfsd-label'
                        name='source_name'
                        sx={{ mb: 1 }}
                        onChange={(e: any) => {
                            handleChange(e)
                            dispatch(setAddSource(e?.target?.value === 0))
                        }}
                        error={!!errors.source_name && touched.source_name}
                        onBlur={handleBlur}
                        value={values.source_name}
                    >
                        {
                            sourceData.map((lead: any) => <MenuItem key={lead.id} value={lead.name}>{lead.name}</MenuItem>)
                        }
                        <MenuItem value={0} sx={{ fontWeight: '600' }}><IconifyIcon icon={'ic:baseline-add'} /> {t("Yangi qo'shish")}</MenuItem>
                    </Select>
                    {!!errors.source_name && touched.source_name && <FormHelperText error>{formik.errors.source_name}</FormHelperText>}
                </FormControl>
            ) : ''}

            {addSource ? (
                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        size='small'
                        label={t('Manba')}
                        name='source_name'
                        error={!!errors.source_name && touched.source_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.source_name}
                    />
                    {!!errors.source_name && touched.source_name && <FormHelperText error>{formik.errors.source_name}</FormHelperText>}
                </FormControl>
            ) : ''}

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
                <TextField
                    fullWidth
                    autoComplete='off'
                    size='small'
                    label={t('phone')}
                    name='phone'
                    defaultValue="+998"
                    error={!!errors.phone && touched.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                />
                {!!errors.phone && touched.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    size='small'
                    label={t('Izoh')}
                    name='body'
                    onChange={handleChange}
                    value={values.body}
                />
                <FormHelperText error={!!errors.body}>{formik.errors.body}</FormHelperText>
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yaratish")}</LoadingButton>
        </form>
    )
}