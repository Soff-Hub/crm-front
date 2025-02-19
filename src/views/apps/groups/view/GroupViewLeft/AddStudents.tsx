import { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  addStudentToGroup,
  getAttendance,
  getDays,
  getStudents,
  handleEditClickOpen,
  setGettingAttendance
} from 'src/store/apps/groupDetails'

// ** MUI Imports
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, FormHelperText } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import AutoComplete from './AutoComplate'
import toast from 'react-hot-toast'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function AddStudents() {
  const [isLoading, setLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<number | null>(null)
  const router = useRouter()
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const { openEdit, groupData, queryParams } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const formik: any = useFormik({
    initialValues: {
      body: '',
      start_date: '',
      student: '',
      discount_amount: ''
    },
    validationSchema: () =>
      Yup.object({
        discount_amount: Yup.string()
          .nullable()
          .matches(/^(?!0\d).*$/, 'Son 0 bilan boshlanmasligi kerak!'),
        body: Yup.string(),
        start_date: Yup.string().required("Guruhga qo'shilish sanasi")
      }),
    onSubmit: async values => {
      setLoading(true)
      try {
        const data = {
          ...values,
          is_discount: isDiscount,
          discount_amount: values?.discount_amount || 0,
          student: selectedStudents,
          groups: [groupData?.id]
        }

        const response = await dispatch(addStudentToGroup(data))

        if (response.meta.requestStatus === 'rejected') {
          formik.setErrors(response.payload)
          if (response.payload?.group?.[0]) {
            toast.error(response.payload.group[0])
          }
        } else {
          toast.success("O'quvchi guruhga qo'shildi")
          setIsDiscount(false)
          setSelectedStudents(null)
          dispatch(setGettingAttendance(true))
          dispatch(handleEditClickOpen(null))

          const queryString = new URLSearchParams(queryParams).toString()
          await dispatch(getStudents({ id: router?.query?.id, queryString }))

          if (router?.query.month && groupData?.id) {
            const year = router?.query?.year || new Date().getFullYear()
            const month = getMontNumber(router?.query.month)
            await dispatch(getAttendance({ date: `${year}-${month}`, group: groupData?.id, queryString }))
            await dispatch(getDays({ date: `${year}-${month}`, group: groupData?.id }))
          }

          dispatch(setGettingAttendance(false))
          formik.resetForm()
          setSelectedStudents(null)
        }
      } catch (error) {
        console.error('Error while submitting:', error)
        toast.error("Xatolik yuz berdi, iltimos qayta urinib ko'ring.")
      } finally {
        setLoading(false)
      }
    }
  })


  return (
    <Dialog
      open={openEdit === 'add-student'}
      onClose={() => (dispatch(handleEditClickOpen(null)), formik.resetForm(), setSelectedStudents(null))}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 2] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t("Guruhga o'quvchi qo'shish")}
      </DialogTitle>

      <DialogContent>
        <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit}>
          <AutoComplete formik={formik} setSelectedStudents={setSelectedStudents} />

          {selectedStudents && (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <FormControl sx={{ width: '100%', margin: '10px 0' }}>
                  <DatePicker
                    value={formik.values.start_date ? dayjs(formik.values.start_date) : null}
                    onChange={newValue => {
                      formik.setFieldValue('start_date', newValue ? dayjs(newValue).format('YYYY-MM-DD') : '')
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        onBlur: () => formik.setFieldTouched('start_date', true),
                        error: !!formik.errors.start_date && formik.touched.start_date,
                        helperText:
                          !!formik.errors.start_date && formik.touched.start_date ? formik.errors.start_date : ''
                      }
                    }}
                  />
                </FormControl>
              </LocalizationProvider>
              <>
                {isDiscount && (
                  <FormControl sx={{ width: '100%', margin: '0' }}>
                    <TextField
                      size='small'
                      label={t('Alohida narx')}
                      name='discount_amount'
                      type='number'
                      error={!!formik.errors.discount_amount && formik.touched.discount_amount}
                      value={formik.values.discount_amount}
                      onChange={e => {
                        const value = e.target.value
                        if (/^\d*$/.test(value) || value === '') {
                          formik.setFieldValue('discount_amount', value)
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault()
                        }
                      }}
                      onBlur={formik.handleBlur}
                      fullWidth
                    />
                    <FormHelperText className='mb-2' error={true}>
                      {formik.touched.discount_amount && formik.errors.discount_amount}
                    </FormHelperText>
                  </FormControl>
                )}

                <Button
                  sx={{ margin: '10px 0px' }}
                  onClick={() => setIsDiscount(!isDiscount)}
                  type='button'
                  variant='outlined'
                  size='small'
                  color='warning'
                  fullWidth
                >
                  {isDiscount ? "Alohida narxni o'chirish" : 'Alohida narx kiritish'}
                </Button>
              </>
            </>
          )}

          {selectedStudents && (
            <FormControl fullWidth>
              <TextField
                rows={4}
                multiline
                label='Izoh'
                name='body'
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.errors.body && formik.touched.body}
              />
              <FormHelperText error={!!formik.errors.body && formik.touched.body}>
                {!!formik.errors.body && formik.touched.body && formik.errors.body}
              </FormHelperText>
            </FormControl>
          )}
          <DialogActions sx={{ justifyContent: 'center' }}>
            <LoadingButton loading={isLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
              {t('Saqlash')}
            </LoadingButton>
            <Button
              variant='outlined'
              type='button'
              color='secondary'
              onClick={() => (
                dispatch(handleEditClickOpen(null)),
                setSelectedStudents(null),
                formik.resetForm(),
                setLoading(false),
                setIsDiscount(false)
              )}
            >
              {t('Bekor Qilish')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
