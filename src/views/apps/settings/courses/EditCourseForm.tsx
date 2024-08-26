// @ts-nocheck

import LoadingButton from '@mui/lab/LoadingButton';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { CourseFormValues } from './CreateCourseDialog';
import { useAppSelector } from 'src/store';

type Props = { formik: FormikProps<CourseFormValues>, loading: boolean }

export default function EditCourseForm({ formik, loading }: Props) {
    const { t } = useTranslation()
    const { course_list } = useAppSelector(state => state.settings)
    const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik

    useEffect(() => {
        return () => {
            formik.resetForm()
        }
    }, [])

    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
        const arr = Array.from({ length: Number(e.target.value) }, (_, index) => ({ order: index + 1, price: "" }));
        formik.setFieldValue("course_costs", arr)
        formik.setFieldValue("month_duration", e.target.value)

    }
    return (
        <form
            onSubmit={() => handleSubmit()}
            style={{
                padding: '0px 20px 10px 20px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginTop: '15px'
            }}
        >
            <FormControl fullWidth>
                <TextField
                    label={t('Kurs nomi')}
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
                <TextField
                    type='number'
                    label={t('Kurs davomiyligi (oy)')}
                    size='small'
                    name='month_duration'
                    error={!!errors.month_duration && touched.month_duration}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleDurationChange(e)}
                    onBlur={handleBlur}
                    value={values.month_duration}
                />
                {errors.month_duration && touched.month_duration && <FormHelperText error>{errors.month_duration}</FormHelperText>}
            </FormControl>
            {course_list?.is_lesson_count && <FormControl fullWidth>
                <TextField
                    type='number'
                    label={t("Oylik to'lov uchun darslar soni")}
                    size='small'
                    name='lessons_count'
                    error={!!errors.lessons_count && touched.lessons_count}
                    onChange={formik.handleChange}
                    onBlur={handleBlur}
                    value={values.lessons_count}
                />
                {errors.lessons_count && touched.lessons_count && <FormHelperText error>{errors.lessons_count}</FormHelperText>}
            </FormControl>}

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
            <LoadingButton onClick={() => formik.handleSubmit()} loading={loading} variant='contained' fullWidth>
                {' '}
                {t("Yangilash")}
            </LoadingButton>
        </form>
    )
}