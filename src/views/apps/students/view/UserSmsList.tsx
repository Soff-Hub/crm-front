// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'

// ** Types

// ** Demo Component Imports
import { UserViewStudentsItem } from './UserViewStudentsList'
import IconifyIcon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import useSMS from 'src/hooks/useSMS'
import EmptyContent from 'src/@core/components/empty-content'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { fetchSmsList, fetchSmsListQuery } from 'src/store/apps/settings'
import { useAppDispatch, useAppSelector } from 'src/store'

const UserSmsList = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<null | []>(null)
  const { t } = useTranslation()
  const { query } = useRouter()
  const { smsTemps, getSMSTemps } = useSMS()
  const [loading, setLoading] = useState(false)
  const { smschild_list, sms_list } = useAppSelector(state => state.settings)
  const [parent_id, setParentId] = useState<number | null>(null)

  const dispatch = useAppDispatch()

  const formik: any = useFormik({
    initialValues: {
      message: ''
    },
    validationSchema: Yup.object({
      message: Yup.string().required(t('Xabar matnini kiriting') as string)
    }),
    onSubmit: async values => {
      await handleAddNote(values)
    }
  })

  const getSmsList = async () => {
    setLoading(true)
    try {
      const resp = await api.get(`auth/sms-history/?user=${query.student}`)
      setData(resp.data?.results)
      setLoading(false)
        setOpen(false)
        formik.resetForm()
    } catch (err: any) {
      if (err?.response?.data) {
        formik.setErrors(err?.response?.data)
      }
      setLoading(false)
    }
  }

  const handleAddNote = async (value: any) => {
    setLoading(true)
    try {
      await api.post('common/send-message-user/', { users: [Number(query.student)], ...value })
      getSmsList()
      setLoading(false)
      setOpen(false)
    } catch (err: any) {
      formik.setErrors(err?.response?.data)
      setLoading(false)
    }
  }

  useEffect(() => {
    dispatch(fetchSmsList())
  }, [])
  useEffect(() => {
    if (parent_id) {
      dispatch(fetchSmsListQuery(parent_id))
    }
  }, [parent_id])

  return (
    <Box>
      <Box sx={{ width: '100%', display: 'flex' }}>
        <Button
          startIcon={<IconifyIcon icon='ic:baseline-add' />}
          onClick={() => (setOpen(true), getSMSTemps())}
          sx={{ marginLeft: 'auto' }}
          variant='contained'
          size='small'
        >
          {t('SMS')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {data && data.length ? (
          data.map((el: any) => (
            <Card sx={{ maxWidth: '450px' }} key={el.id}>
              <CardContent>
                <UserViewStudentsItem setOpenEdit={setOpen} key={el.id} item={{ ...el, created_at: el.created_at }} />
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyContent />
        )}
      </Box>
      <Dialog
        open={open}
        onClose={() => (setOpen(false), formik.resetForm())}
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
                    <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>
                      {el.description}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {parent_id && (
              <FormControl fullWidth sx={{ marginBottom: 5 }}>
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
                size='small'
                name='message'
                multiline
                rows={4}
                label={t('SMS matni')}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                onChange={formik.handleChange}
                error={!!formik.errors?.message && formik.touched.message}
              />
              <FormHelperText error={!!formik.errors.message && formik.touched.message}>
                {formik.errors.message}
              </FormHelperText>
            </FormControl>

            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                variant='outlined'
                type='button'
                color='secondary'
                onClick={() => (setOpen(false), formik.resetForm())}
              >
                {t('Bekor qilish')}
              </Button>
              <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                {t('Yuborish')}
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default UserSmsList
