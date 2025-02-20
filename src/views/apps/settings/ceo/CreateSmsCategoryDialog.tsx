import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchSmsList, setOpenCreateSmsCategory } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { LoadingButton } from '@mui/lab'

const CreateSmsCategoryDialog = () => {
  const { openCreateSmsCategory } = useAppSelector(state => state.settings)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const handleClose = () => {
    dispatch(setOpenCreateSmsCategory(false))
    formik.resetForm()
  }

  const validationSchema = Yup.object({
    category: Yup.string().required('Kategoriya nomini kiriting')
  })

  const formik = useFormik({
    initialValues: {
      category: ''
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      await api
        .post('common/sms-form/create/', { description: values.category })
        .then(res => {
          if (res.status == 201) {
            toast.success('Kategoriya muvaffaqiyatli yaratildi')
            dispatch(fetchSmsList())
            handleClose()
          }
        })
        .catch(err => {
          console.log(err)
          toast.error(err.response.data.msg || 'Serverda muammo bor')
        })
      setLoading(false)
    }
  })

  return (
    <Dialog
      open={openCreateSmsCategory}
      onClose={handleClose}
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450 } }}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography>{t('Sms kategoriya yaratish')}</Typography>
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ marginTop: 2 }} fullWidth>
            <TextField
              id='category'
              name='category'
              label={t('Kategoriya nomi')}
              placeholder={t('Nomini kiriting')}
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
              fullWidth
            />
          </FormControl>
          
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='error' onClick={handleClose}>
            {t('Bekor qilish')}
          </Button>
          <LoadingButton loading={loading} disabled={!formik.isValid} variant='contained' type='submit'>
            {t('Saqlash')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateSmsCategoryDialog
