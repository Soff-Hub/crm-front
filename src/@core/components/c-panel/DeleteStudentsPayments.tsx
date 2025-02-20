import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'

export function StudentsPaymentsModal({
  openModal,
  setOpenModal,
  id
}: {
  openModal: boolean
  setOpenModal: (status: boolean) => void
  id: number | string
}) {
  const { t } = useTranslation()
  const [branches, setBranches] = useState([])

  async function getBranches() {
    api.get(`/owner/tenant/branches/${id}/`).then(res => {
      setBranches(res.data)
    })
  }

  useEffect(() => {
    if (openModal) {
      getBranches()
    }
  }, [openModal])

  const validationSchema = Yup.object().shape({
    branches: Yup.array().min(1, t('Filialni tanlang') || 'Filialni tanlang'),
    is_payment: Yup.string().required(t('To‘lov turini tanlang') || 'To‘lov turini tanlang')
  })

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const formattedValues = {
      ...values,
      branches: values.branches.join(',')
    }
    await api
      .post(`/owner/tenant/student-payments/delete/${id}`, formattedValues)
      .then(res => {
        console.log(res)
        setOpenModal(false)
        toast.success("To'lov o'chirildi")
      })
      .catch((err: any) => {
        toast.error(err.response.data.msg)
        console.log(err)
      })

    setSubmitting(false)
  }
  return (
    <Dialog fullWidth onClose={() => setOpenModal(false)} open={openModal}>
      <DialogTitle>{t("O'quvchi to'lovlari")}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ branches: [], is_payment: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <FormControl sx={{ marginTop: 3 }} fullWidth error={touched.branches && !!errors.branches}>
                <InputLabel id='branch-label'>{t('branch')}</InputLabel>
                <Select
                  label={t('branch')}
                  labelId='branch-label'
                  multiple
                  name='branches'
                  value={values.branches}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {branches.map((branch: any, index) => (
                    <MenuItem key={index} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.branches && errors.branches && <FormHelperText>{errors.branches}</FormHelperText>}
              </FormControl>

              <FormControl sx={{ marginTop: 3 }} fullWidth error={touched.is_payment && !!errors.is_payment}>
                <InputLabel id='payment-label'>{t("To'lov turi")}</InputLabel>
                <Select
                  label="To'lov turi"
                  labelId='payment-label'
                  name='is_payment'
                  value={values.is_payment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value={'true'}>{t("To'lov")}</MenuItem>
                  <MenuItem value={'false'}>{t('Qarzdor')}</MenuItem>
                </Select>
                {touched.is_payment && errors.is_payment && <FormHelperText>{errors.is_payment}</FormHelperText>}
              </FormControl>

              <DialogActions sx={{ marginTop: 3 }}>
                <Button variant='contained' onClick={() => setOpenModal(false)}>
                  {t('Bekor qilish')}
                </Button>
                <Button type='submit' variant='contained' color='error' disabled={isSubmitting}>
                  {t("O'chirish")}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
