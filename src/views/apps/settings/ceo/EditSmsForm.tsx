import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { editSms, fetchSmsList, fetchSmsListQuery, setOpenEditSms } from 'src/store/apps/settings'
import { useAppDispatch, useAppSelector } from 'src/store'
import LoadingButton from '@mui/lab/LoadingButton'
import { SmsItemType } from 'src/types/apps/settings'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'

type Props = {
  initialValues: SmsItemType
}

export default function EditSmsform({ initialValues }: Props) {
  const { sms_list } = useAppSelector(state => state.settings)

  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const setOpenAddGroup = () => {
    dispatch(setOpenEditSms(null))
    formik.resetForm()
  }

  const validationSchema = initialValues.parent
    ? Yup.object({
        parent: Yup.string().required('Kategoriyani tanlang'),

        description: Yup.string().required('Xabarni kiriting')
      })
    : Yup.object({
        description: Yup.string().required('Xabarni kiriting')
      })
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      dispatch(disablePage(true))
      await dispatch(editSms(values))
      dispatch(disablePage(false))
      toast.success("O'zgarishlar muvaffaqiyatli saqlandi")
      await dispatch(fetchSmsListQuery(formik.values.parent))
      await dispatch(fetchSmsList())
      setOpenAddGroup()
      setLoading(false)
    }
  })

  const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik

  useEffect(() => {
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
      {initialValues.parent && (
        <FormControl sx={{ width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Kategoriya')}
          </InputLabel>
          <Select
            size='small'
            label={t('Kategoriya')}
            name='parent'
            error={!!errors.parent && touched.parent}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values?.parent}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
          >
            {sms_list.map(item => (
              <MenuItem value={item.id}>{item.description}</MenuItem>
            ))}
          </Select>
          {!!errors.parent && touched.parent && <FormHelperText error>{errors.parent}</FormHelperText>}
        </FormControl>
      )}
      <FormControl fullWidth>
        <TextField
          multiline
          rows={10}
          label={t('SMS Matni')}
          size='small'
          name='description'
          error={!!errors.description && !!touched.description}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.description}
        />
        {!!errors.description && touched.description && <FormHelperText error>{!!errors.description}</FormHelperText>}
      </FormControl>

      <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
        {' '}
        {t('Saqlash')}
      </LoadingButton>
    </form>
  )
}
