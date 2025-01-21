import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { createGroup, fetchCoursesList, setOpenCreateSms } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useBranches from 'src/hooks/useBranch'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import AmountInput, { revereAmount } from 'src/@core/components/amount-input'
import Router from 'next/router'
import IconifyIcon from 'src/@core/components/icon'

type Props = {}

export default function CreateCourseForm({}: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { getBranches } = useBranches()
  const { course_list } = useAppSelector(state => state.settings)

  const [loading, setLoading] = useState<boolean>(false)

  const setOpenAddGroup = () => {
    dispatch(setOpenCreateSms(null))
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Nom kiriting'),
    price: Yup.number().required('Kurs narxini kiriting'),
    month_duration: Yup.number().required('Nechi oy davom etadi?').max(12, "12 oydan ko'p bo'lmasligi kerak"),
    description: Yup.string(),
    color: Yup.string(),
    text_color: Yup.string().nullable()
  })

  const formik: any = useFormik({
    initialValues: {
      name: '',
      price: '',
      month_duration: '',
      description: '',
      color: '#ffffff',
      text_color: null,
      lesson_count: 0
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      dispatch(disablePage(true))
      const resp = await dispatch(
        createGroup({ ...values, price: revereAmount(values.price), color: `${values.color},${values.text_color}`,text_color:`${values.text_color}` })
      )
      if (resp.meta.requestStatus === 'rejected') {
        formik.setErrors(resp.payload)
        setLoading(false)
      } else {
        toast.success('Kurs muvaffaqiyatli yaratildi')
        await dispatch(fetchCoursesList(''))
        formik.resetForm()
        setLoading(false)
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

      <FormControl fullWidth>
        <AmountInput
          label={t('Kurs narxi')}
          size='small'
          name='price'
          error={!!errors.price && touched.price}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.price}
        />
        {errors.price && touched.price && <FormHelperText error>{errors.price}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth>
        <TextField
          type='number'
          label={t('Kurs davomiyligi (oy)')}
          size='small'
          name='month_duration'
          error={!!errors.month_duration && touched.month_duration}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.month_duration}
        />
        {errors.month_duration && touched.month_duration && (
          <FormHelperText error>{errors.month_duration}</FormHelperText>
        )}
      </FormControl>

      {course_list.is_lesson_count ? (
        <FormControl fullWidth>
          <TextField
            type='number'
            label={t("To'lov uchun darslar soni")}
            size='small'
            name='lesson_count'
            error={!!errors.lesson_count && touched.lesson_count}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.lesson_count}
          />
          {errors.lesson_count && touched.lesson_count && <FormHelperText error>{errors.lesson_count}</FormHelperText>}
        </FormControl>
      ) : (
        ''
      )}

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
          label={t('Rangi')}
          name='color'
          type='color'
          defaultValue={'#FFFFFF'}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.color}
        />
      </FormControl>
      <FormControl>
        <TextField
          name='text_color'
          label={t('Matn rangi')}
          type='color'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.text_color}
          defaultValue={'#FFFFFF'}
        />
      </FormControl>
      <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
        {' '}
        {t('Saqlash')}
      </LoadingButton>
    </form>
  )
}
