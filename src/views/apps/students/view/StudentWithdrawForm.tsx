import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useTranslation } from 'react-i18next'
import { FormHelperText } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { today } from 'src/@core/components/card-statistics/kanban-item'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import usePayment from 'src/hooks/usePayment'
import Router, { useRouter } from 'next/router'
import { fetchStudentDetail, fetchStudentPayment } from 'src/store/apps/students'
import AmountInput, { convertToNegative, revereAmount } from 'src/@core/components/amount-input'
import IconifyIcon from 'src/@core/components/icon'

type Props = {
  openEdit: any
  setOpenEdit: any
}

export default function StudentWithDrawForm({ openEdit, setOpenEdit }: Props) {
  const [loading, setLoading] = useState<boolean>(false)

  const { t } = useTranslation()
  const { studentData } = useAppSelector(state => state.students)
  const userData: any = { ...studentData }
  const { getPaymentMethod, paymentMethods, createPayment } = usePayment()
  const { query } = useRouter()
  const dispatch = useAppDispatch()

  const validationSchema = Yup.object({
    payment_type: Yup.string().required('Tanlash majburiy'),
    group: Yup.string().required('Tanlash majburiy'),
    amount: Yup.string().required('Tanlash majburiy'),
    description: Yup.string(),
    payment_date: Yup.string().required('Tanlash majburiy')
  })

  const initialValues = {
    payment_type: '',
    group: ``,
    amount: '',
    description: '',
    payment_date: today
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      const data = {
        ...values,
        student: query?.student,
        amount: convertToNegative(values.amount)
      }

      try {
        await createPayment(data)
        setLoading(false)
        setOpenEdit(null)
        formik.resetForm()
        await dispatch(fetchStudentDetail(userData.id))
        await dispatch(fetchStudentPayment(userData.id))
      } catch (err: any) {
        // showResponseError(err.response.data, setError)
        setLoading(false)
      }
    }
  })

  const { errors, values, handleSubmit, handleBlur, touched, handleChange } = formik

  const handleEditClose = () => {
    setOpenEdit(null)
    formik.resetForm()
  }

  useEffect(() => {
    formik.setFieldValue('group', studentData ? `${studentData.groups?.[0]?.group_data?.id}` : '')
  }, [studentData])

  useEffect(() => {
    if (openEdit === 'withdraw') {
      getPaymentMethod()
    }
  }, [openEdit])

  return (
    <div>
      <Dialog
        open={openEdit === 'withdraw'}
        onClose={handleEditClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t('Pulni yechib olish')}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}
            id='edifsdt-employee-pay'
          >
            <FormControl fullWidth>
              <InputLabel
                size='small'
                id='user-view-language-label'
                error={!!errors.payment_type && touched.payment_type}
              >
                {t("To'lov usulini tanlang")}
              </InputLabel>
              <Select
                size='small'
                label={t("To'lov usulini tanlang")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='payment_type'
                value={values.payment_type}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {paymentMethods.map((branch: any) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
                <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/settings/ceo/all-settings')}>
                  {t('Yangi yaratish')}
                  <IconifyIcon icon={'ion:add-sharp'} />
                </MenuItem>
              </Select>
              {!!errors.payment_type && touched.payment_type && (
                <FormHelperText error>{errors.payment_type}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label' error={!!errors.group && !!touched.group}>
                {t('Qaysi guruh uchun?')}
              </InputLabel>
              <Select
                size='small'
                label={t('Qaysi guruh uchun?')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='group'
                error={!!errors.group && !!touched.group}
                value={values.group}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {userData?.groups.map((branch: any) => (
                  <MenuItem key={branch.id} value={branch.group_data.id}>
                    {branch.group_data.name}
                  </MenuItem>
                ))}
              </Select>
              {!!errors.group && touched.group && <FormHelperText error>{!!errors.group}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <AmountInput
                label={t('Summa')}
                size='small'
                name='amount'
                defaultValue={''}
                error={!!errors.amount && touched.amount}
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {!!errors.amount && touched.amount && <FormHelperText error>{errors.amount}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                rows={4}
                multiline
                label={t('Izoh')}
                name='description'
                defaultValue={''}
                error={!!errors.description && touched.description}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {!!errors.description && touched.description && (
                <FormHelperText error>{errors.description}</FormHelperText>
              )}
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <input
                type='date'
                style={{
                  borderRadius: '8px',
                  padding: '10px',
                  outline: 'none',
                  border: '1px solid gray',
                  marginTop: '10px'
                }}
                name='payment_date'
                value={values.payment_date}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {!!errors.payment_date && touched.payment_date && (
                <FormHelperText error>{errors.payment_date}</FormHelperText>
              )}
            </FormControl>

            <DialogActions sx={{ justifyContent: 'center' }}>
              <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                {t('Saqlash')}
              </LoadingButton>
              <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                {t('Bekor qilish')}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
