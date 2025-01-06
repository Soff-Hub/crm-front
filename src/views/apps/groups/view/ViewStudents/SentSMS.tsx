import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
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
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchSmsList, fetchSmsListQuery } from 'src/store/apps/settings'

export default function SentSMS({
  id,
  modalRef,
  setModalRef,
  smsTemps
}: {
  id: string
  modalRef: string | null
  setModalRef: any
  smsTemps: null | any[]
}) {
  const [isLoading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { smschild_list, sms_list } = useAppSelector(state => state.settings)
  const [parent_id, setParentId] = useState<number | null>(null)
  const dispatch = useAppDispatch()
  const formik: any = useFormik({
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

  //  useEffect(() => {
  //     dispatch(fetchSmsList())
  //   }, [])
    useEffect(() => {
      if (parent_id) {
        dispatch(fetchSmsListQuery(parent_id))
      }
    }, [parent_id])

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
        <FormControl fullWidth sx={{ marginBottom: 5 }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kategorya')}
            </InputLabel>
            <Select
              size='small'
              label='Kategorya'
              defaultValue=''
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              onChange={(e: any) => {
                setParentId(e.target.value)
              }}
            >
              {sms_list.map((el: any) => (
                <MenuItem value={el.id} sx={{ wordBreak: 'break-word' }}>
                  <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>{el.description}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {parent_id && (
            <FormControl fullWidth sx={{marginBottom:5}}>
              <InputLabel size='small' id='demo-simple-select-outlined-label'>
                {t('Shablonlar')}
              </InputLabel>
              <Select
                size='small'
                label='Shablonlar'
                defaultValue=''
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                onChange={e => {
                  //   setSMS(true)
                  formik.setFieldValue('message', e.target.value)
                }}
              >
                {smschild_list.map((el: any) => (
                  <MenuItem value={el.description} sx={{ wordBreak: 'break-word' }}>
                    <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>
                      {el.description}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
