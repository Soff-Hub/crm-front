import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'src/store'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField
} from '@mui/material'
import { toast } from 'react-hot-toast'

export default function SentSMS({
  id,
  modalRef,
  setModalRef
}: {
  id: string
  modalRef: string | null
  setModalRef: any
}) {
  const [isLoading, setLoading] = useState(false)
  const { smsTemps } = useAppSelector(state => state.groupDetails)
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: () =>
      Yup.object({
        message: Yup.string().required(t("Maydonni to'ldiring") as string)
      }),
    onSubmit: async values => {
      setLoading(true)
      try {
        const response = await api.post('common/send-message-user/', { users: [id], ...values })
        toast.success("Xabar o'quvchiga yuborildi")
        setLoading(false)
        setModalRef(null)
        formik.resetForm()
      } catch (err: any) {
        formik.setErrors(err.response.data)
        setLoading(false)
      }
    }
  })

  return (
    <Dialog
      open={modalRef === 'sms'}
      onClose={() => setModalRef(null)}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t('Xabar yuborish (sms)')}
      </DialogTitle>
      <DialogContent>
        <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit}>
          <FormControl sx={{ maxWidth: '100%', mb: 3 }} fullWidth>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Shablonlar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Shablonlar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              onChange={e => formik.setFieldValue('message', e.target.value)}
            >
              {smsTemps?.map((el: any) => (
                <MenuItem value={el.description} sx={{ wordBreak: 'break-word' }}>
                  <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>{el.description}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              label={t('SMS matni')}
              error={!!formik.errors.message && formik.touched.message}
              multiline
              value={formik.values.message}
              rows={4}
              size='small'
              name='message'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormHelperText error>
              {!!formik.errors.message && formik.touched.message && formik.errors.message}
            </FormHelperText>
          </FormControl>

          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' type='button' color='secondary' onClick={() => setModalRef(null)}>
              {t('Bekor qilish')}
            </Button>
            <LoadingButton loading={isLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
              {t('Yuborish')}
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
