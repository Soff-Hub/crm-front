import { LoadingButton } from '@mui/lab'
import { Box, FormControl, FormHelperText, IconButton, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import api from 'src/@core/utils/api'
import { CustomeDrawer } from 'src/pages/settings/office/courses'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchSchoolList, setOpenCreateSms, setOpenEditSchool } from 'src/store/apps/settings'
import * as Yup from 'yup'

type Props = {}

export default function EditSchoolDialog({}: Props) {
  const { t } = useTranslation()
  const { openCreateSms, schoolQueryParams, openEditSchool } = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  console.log(openEditSchool)

  const validationSchema = Yup.object({
    name: Yup.string().required('Maktab nomini kiriting')
  })

  const formik: any = useFormik({
    initialValues: {
      name: openEditSchool?.name
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      await api
        .patch(`common/school/update/${openEditSchool?.id}`, values)
        .then(res => {
          toast.success("Muvaffaqiyatli o'gartirildi")
          dispatch(fetchSchoolList({ page: schoolQueryParams.page }))
          formik.resetForm()
          dispatch(setOpenEditSchool(null))
        })
        .catch(err => {
          console.log(err)
          toast.error(err.response.data.msg || 'Xatolik')
        })
      setLoading(false)
    }
  })

  const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik

  useEffect(() => {
    formik.setFieldValue('name', openEditSchool?.name)
  }, [openEditSchool])

  return (
    <CustomeDrawer open={!!openEditSchool} hideBackdrop anchor='right' variant='persistent'>
      <Box
        className='customizer-header'
        sx={{
          position: 'relative',
          p: theme => theme.spacing(3.5, 5),
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {t("Yangi xona qo'shish")}
        </Typography>
        <IconButton
          onClick={() => {
            dispatch(setOpenEditSchool(null)), formik.resetForm()
          }}
          sx={{
            right: 20,
            top: '50%',
            position: 'absolute',
            color: 'text.secondary',
            transform: 'translateY(-50%)'
          }}
        >
          <IconifyIcon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Box>
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
            placeholder={t('Maktab nomi')}
            size='small'
            name='name'
            error={!!errors.name && touched.name}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          {errors.name && touched.name && <FormHelperText error>{errors.name}</FormHelperText>}
        </FormControl>

        <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
          {' '}
          {t('Saqlash')}
        </LoadingButton>
      </form>
    </CustomeDrawer>
  )
}
