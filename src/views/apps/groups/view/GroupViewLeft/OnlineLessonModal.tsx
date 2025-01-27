import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import api from 'src/@core/utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { handleEditClickOpen, setMeetLink, setOnlineLessonLoading } from 'src/store/apps/groupDetails'

// ** MUI Imports
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, Chip, FormHelperText, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { fetchSmsList, fetchSmsListQuery } from 'src/store/apps/settings'
import Link from 'next/link'
import IconifyIcon from 'src/@core/components/icon'

export default function OnlineLessonModal() {
  const [isLoading, setLoading] = useState(false)
  const { openEdit, students, meet_link, onlineLessonLoading } = useAppSelector(state => state.groupDetails)
  const { smschild_list, sms_list } = useAppSelector(state => state.settings)
  const [isSentSms, setIsSentSms] = useState(false)
  const dispatch = useAppDispatch()
  const [successText, setIsSuccessText] = useState('')
  const { t } = useTranslation()
  const [parent_id, setParentId] = useState<number | null>(null)

  const handleCopy = () => {
    if (meet_link) {
      navigator.clipboard.writeText(meet_link)
      toast.success('Link copied to clipboard!')
    }
  }

  // const emailFormik = useFormik({
  //   initialValues: {
  //     email: ''
  //   },
  //   validationSchema: () =>
  //     Yup.object({
  //       email: Yup.string().required('Xabar kiriting')
  //     }),
  //   onSubmit: async values => {
  //     dispatch(setOnlineLessonLoading(true))
  //     try {
  //       await api
  //         .post(`meets/create/`, {
  //           email: values.email
  //         })
  //         .then(res => {
  //           dispatch(setMeetLink(res.data.meet_link))
  //         })
  //       // toast.success(`SMS muvaffaqiyatli jo'natildi!`, {
  //       //   position: 'top-center'
  //       // })
  //       // dispatch(handleEditClickOpen(null))
  //       emailFormik.resetForm()
  //       setIsSentSms(false)
  //     } catch {
  //       setLoading(false)
  //     }
  //     dispatch(setOnlineLessonLoading(false))
  //   }
  // })

  async function handleGetMeetLink() {
    dispatch(setOnlineLessonLoading(true))
    await api.get('meets/google/login/').then((res) => {
      console.log(res);
      
    })
    dispatch(setOnlineLessonLoading(false))
  }

  const formik = useFormik({
    initialValues: {
      message: ''
    },
    validationSchema: () =>
      Yup.object({
        message: Yup.string().required('Xabar kiriting')
      }),
    onSubmit: async values => {
      setLoading(true)
      try {
        await api.post(`common/send-message-user/`, {
          users: students?.map((el: any) => Number(el.student.id)),
          message: values.message
        })
        toast.success(`SMS muvaffaqiyatli jo'natildi!`, {
          position: 'top-center'
        })
        // dispatch(handleEditClickOpen(null))
        setLoading(false)
        setIsSuccessText("O'quvchilarga sms yuborildi")
        formik.resetForm()
        setIsSentSms(false)
      } catch {
        setLoading(false)
      }
    }
  })
  useEffect(() => {
    dispatch(fetchSmsList())
  }, [])
  useEffect(() => {
    if (parent_id) {
      dispatch(fetchSmsListQuery(parent_id))
    }
  }, [parent_id])

  return (
    <Dialog
      open={openEdit == 'online-lesson'}
      onClose={() => {
        dispatch(handleEditClickOpen(null)), setIsSuccessText(''), setIsSentSms(false)
      }}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t('Online darsni boshlash')}
      </DialogTitle>
      <DialogContent>
        {/* {!meet_link && 
        <form style={{marginTop:10}} onSubmit={emailFormik.handleSubmit}>
        <FormControl fullWidth>
              <TextField
                name='email'
                label={t('Email kiriting')}
                size='small'
                value={emailFormik.values.email}
                onChange={emailFormik.handleChange}
                onBlur={emailFormik.handleBlur}
                error={!!emailFormik.errors.email && emailFormik.touched.email}
              />
              <FormHelperText error>
                {emailFormik.errors.email && emailFormik.touched.email && emailFormik.errors.email}
              </FormHelperText>
          </FormControl>
          <LoadingButton loading={onlineLessonLoading} variant='contained' sx={{marginTop:5}} fullWidth type='submit'>
            Boshlash
          </LoadingButton>
        </form>
        } */}
        <>
          {onlineLessonLoading ? (
            <Typography textAlign='center'>Yuklanmoqda...</Typography>
          ) : (
            <Tooltip title='Linkni nusxalang' arrow>
              <Typography
                textAlign='center'
                onClick={handleCopy}
                sx={{
                  cursor: 'pointer'
                }}
              >
                {meet_link}
              </Typography>
            </Tooltip>
          )}

          <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit}>
            {isSentSms && (
              <FormControl fullWidth>
                <TextField
                  name='message'
                  multiline
                  rows={4}
                  label={t('SMS matni')}
                  size='small'
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.errors.message && formik.touched.message}
                />
                <FormHelperText error>
                  {formik.errors.message && formik.touched.message && formik.errors.message}
                </FormHelperText>
              </FormControl>
            )}
            <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
              {successText && (
                <Chip
                  icon={<IconifyIcon icon='mdi:check-circle-outline' />}
                  variant='outlined'
                  sx={{ fontSize: 15, padding: 5 }}
                  label={successText}
                  color='success'
                />
              )}
            </Box>

            <DialogActions sx={{ justifyContent: 'center' }}>
              {!isSentSms || !successText ? (
                <LoadingButton
                  type='button'
                  color='warning'
                  onClick={() => {
                    setIsSentSms(true)
                    setIsSuccessText('')
                  }}
                  variant='contained'
                  sx={{ mr: 1 }}
                >
                  {t('Sms yuborish')}
                </LoadingButton>
              ) : (
                <LoadingButton color='warning' loading={isLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
                  {t('Sms jonatish')}
                </LoadingButton>
              )}
              <Link target='_blank' href={String(meet_link)}>
                <LoadingButton
                  loading={onlineLessonLoading}
                  variant='contained'
                  type='button'
                  onClick={() => {
                    dispatch(handleEditClickOpen(null)), formik.resetForm()
                  }}
                >
                  {t('Boshlash')}
                </LoadingButton>
              </Link>
            </DialogActions>
          </form>
        </>
      </DialogContent>
    </Dialog>
  )
}
