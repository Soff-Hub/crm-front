import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { editCourse, fetchCoursesList, setOpenEditCourse } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useBranches from 'src/hooks/useBranch'

type Props = {}

export default function EditCourseForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { branches, getBranches } = useBranches()
    const { openEditCourse } = useAppSelector(state => state.settings)

    const [loading, setLoading] = useState<boolean>(false)

    const setOpenAddGroup = () => {
        dispatch(setOpenEditCourse(null))
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
        branch: Yup.string().required("Filial tanlang"),
        price: Yup.number().required("Kurs narxini kiriting"),
        lesson_duration_seconds: Yup.number().required("Dars davomiyligi"),
        month_duration: Yup.number().required("Nechi oy davom etadi?").max(12, "12 oydan ko'p bo'lmasligi kerak"),
        description: Yup.string(),
        color: Yup.string()
    });

    const formik = useFormik({
        initialValues: { ...openEditCourse, branch: `${openEditCourse?.branch[0].id}` },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            const resp = await dispatch(editCourse(values))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
                setLoading(false)
            } else {
                setLoading(false)
                await dispatch(fetchCoursesList())
                formik.resetForm()
                return setOpenAddGroup()
            }
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

            <FormControl fullWidth>
                <InputLabel error={!!errors.branch && touched.branch} size='small' id='demo-simple-select-outlined-label'>
                    {t('branch')}
                </InputLabel>
                <Select
                    size='small'
                    label={t('branch')}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    name='branch'
                    error={!!errors.branch && !!touched.branch}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.branch}
                >
                    {branches.length > 0 && branches.map((item: any) => <MenuItem key={item.id} value={`${item.id}`}>{item?.name}</MenuItem>)}
                </Select>

                {errors.branch && touched.branch && <FormHelperText error>{errors.branch}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    label={t('Kurs narxi')}
                    size='small'
                    name='price'
                    error={!!errors.price && touched.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                />
                {errors.branch && touched.branch && <FormHelperText error>{errors.branch}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel
                    size='small'
                    id='demo-simple-select-outlined-label'
                    error={!!errors.lesson_duration_seconds && touched.lesson_duration_seconds}
                >
                    {t('Dars davomiyligi')}
                </InputLabel>
                <Select
                    size='small'
                    label={t('Dars davomiyligi')}
                    id='demo-simple-select-outlined2'
                    labelId='demo-simple-select-outlined-label2'
                    name='lesson_duration_seconds'
                    error={!!errors.lesson_duration_seconds && touched.lesson_duration_seconds}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lesson_duration_seconds}
                >
                    <MenuItem value={5400}>{t('1 soat 30 daqiqa')}</MenuItem>
                    <MenuItem value={7200}>{t('2 soat')}</MenuItem>
                    <MenuItem value={9000}>{t('2 soat 30 daqiqa')}</MenuItem>
                    <MenuItem value={10800}>{t('3 soat')}</MenuItem>
                </Select>
                {errors.lesson_duration_seconds && touched.lesson_duration_seconds && <FormHelperText error>{errors.branch}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    // type='number'
                    label={t('Kurs davomiyligi')}
                    size='small'
                    name='month_duration'
                    error={!!errors.month_duration && touched.month_duration}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.month_duration}
                />
                {errors.month_duration && touched.month_duration && <FormHelperText error>{errors.month_duration}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    rows={4}
                    multiline
                    label={t('Izoh')}
                    name='description'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    label={t("Rangi")}
                    name='color'
                    type='color'
                    defaultValue={'#FFFFFF'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.color}
                />
            </FormControl>
            <LoadingButton loading={loading} type='submit' variant='contained' color='success' fullWidth>
                {' '}
                {t("Saqlash")}
            </LoadingButton>
        </form>
    )
}