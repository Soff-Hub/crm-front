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
import { Autocomplete, Box, Chip, FormHelperText, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { fetchSmsList, fetchSmsListQuery } from 'src/store/apps/settings'
import Link from 'next/link'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { MetaTypes } from 'src/types/apps/groupsTypes'

export default function OnlineLessonModal() {
  const [isLoading, setLoading] = useState(false)
  const { openEdit, students, meet_link, onlineLessonLoading } = useAppSelector(state => state.groupDetails)
  const { smschild_list, sms_list } = useAppSelector(state => state.settings)
  const [isSentSms, setIsSentSms] = useState(false)
  const dispatch = useAppDispatch()
  const [groups, setGroups] = useState<any>()
  const [successText, setIsSuccessText] = useState('')
  const { t } = useTranslation()
  const [parent_id, setParentId] = useState<number | null>(null)
  const router = useRouter()
  const [openModal, setOpenModal] = useState<any>(null)
  const [groupId, setGroupId] = useState<number | null>(null)

  // Extract access_token from URL
  useEffect(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    const accessToken = params.get('access_token')
    setOpenModal(accessToken)
    if (accessToken) {
      handleCreateMeetLink(accessToken)
    }
  }, [])

  async function getGroups() {
    await api
      .get('common/group-check-list/')
      .then(res => setGroups(res.data))
      .catch(error => console.log(error))
  }

  // Function to send access_token to backend
  const sendAccessTokenToBackend = async (token: string) => {
    try {
      const response = await api.post('path/to/endpoint', { token })
      console.log('Access token sent successfully:', response.data)
    } catch (error) {
      console.error('Error sending access token:', error)
    }
  }

  const handleCopy = () => {
    if (meet_link) {
      navigator.clipboard.writeText(meet_link)
      toast.success('Link copied to clipboard!')
    }
  }

  async function handleCreateMeetLink(access_token: string) {
    dispatch(setOnlineLessonLoading(true))
    api
      .get(`meets/google/create/?access_token=${access_token}`)
      .then(res => {
        dispatch(setMeetLink(res.data.meet_link))
      })
      .catch(err => {
        toast.error(err.response.data.msg)
        console.log(err)
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
          group_id: groupId,
          users: [],
          message: values.message
        })
        toast.success(`SMS muvaffaqiyatli jo'natildi!`, {
          position: 'top-center'
        })
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
    if (openModal) {
      dispatch(fetchSmsList())
      getGroups()
    }
  }, [])

  useEffect(() => {
    if (parent_id) {
      dispatch(fetchSmsListQuery(parent_id))
    }
  }, [parent_id])

  const groupOptions = groups?.map((item: MetaTypes) => ({
    label: item?.name,
    value: item?.id
  }))

  function handleCancel() {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    // Remove 'modal' and 'access_token' parameters
    params.delete('modal')
    params.delete('access_token')

    // Update the URL without reloading the page
    history.replaceState(null, '', `${url.pathname}?${params.toString()}`)
  }

  return (
    <Dialog
      open={openModal}
      onClose={() => {
        setOpenModal(null)
        handleCancel()
        dispatch(handleEditClickOpen(null))
        setIsSuccessText('')
        setIsSentSms(false)
      }}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t('Online darsni boshlash')}
      </DialogTitle>
      <DialogContent>
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
              {meet_link?.slice(0, 40)}...
            </Typography>
          </Tooltip>
        )}
        <Box sx={{ width: '100%', marginTop: 5 }}>
          <Autocomplete
            disablePortal
            options={groupOptions}
            onChange={(e: any, v: any) => setGroupId(v.value)}
            size='small'
            renderInput={params => <TextField {...params} label={t('Guruh')} />}
          />
        </Box>
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
            {!isSentSms ? (
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
            <Link href={meet_link ? String(meet_link) : '#'}>
              <LoadingButton
                loading={onlineLessonLoading}
                variant='contained'
                type='button'
                onClick={() => {
                  dispatch(handleEditClickOpen(null))
                  formik.resetForm()
                }}
              >
                {t('Boshlash')}
              </LoadingButton>
            </Link>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
