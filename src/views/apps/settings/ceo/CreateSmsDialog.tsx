import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import * as Yup from 'yup'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { createSms, fetchSmsList, fetchSmsListQuery, setOpenCreateSms } from 'src/store/apps/settings'
import { useAppDispatch, useAppSelector } from 'src/store'
import LoadingButton from '@mui/lab/LoadingButton'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

type Props = {}

export default function CreateSmsDialog({}: Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { openCreateSms, sms_list } = useAppSelector(state => state.settings)

  const setOpenAddGroup = (value: boolean) => {
    dispatch(setOpenCreateSms(value))
  }

  const validationSchema = Yup.object({
    description: Yup.string().required('Xabarni kiriting'),
    parent: Yup.string().required('Kategorya tanlanishi shart')
  })

  const initialValues = {
    description: '',
    parent: null
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      dispatch(disablePage(true))
      const resp = await dispatch(createSms(values))
      if (resp.meta.requestStatus === 'rejected') {
        formik.setErrors(resp.payload)
      } else {
        dispatch(disablePage(false))
        dispatch(fetchSmsListQuery(formik.values.parent))
        formik.resetForm()
        toast.success('SMS shablon yaratildi')
        setOpenAddGroup(false)
      }
      setLoading(false)
    }
  })

  useEffect(() => {
    dispatch(fetchSmsList())
  }, [])

  const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik

  return (
    <Drawer open={openCreateSms} hideBackdrop anchor='right' variant='persistent'>
      <Box
        className='customizer-header'
        sx={{
          position: 'relative',
          p: theme => theme.spacing(3.5, 5),
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {t("SMS shablon qo'shish")}
        </Typography>
        <IconButton
          onClick={() => {
            setOpenAddGroup(false)
            formik.resetForm()
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
      <p style={{ fontSize: 12 }} className='mb-3 mt-2 px-3'>
        <p>
          Xabar matniga talaba ismini qo'shish uchun{' '}
          <span style={{ backgroundColor: '#E0F7FA', color: 'blue', fontWeight: 'bold' }}>{'${first_name}'}</span> kalit
          so'zi qoldiring.
        </p>
      </p>
      <form
        onSubmit={handleSubmit}
        id='posts-courses-id'
        style={{
          padding: '10px 20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginTop: '5px'
        }}
      >
        <FormControl sx={{ width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Kategoriya')}
          </InputLabel>
          <Select
            size='small'
            label={t('Kategoriya')}
            name='parent'
            error={!!errors.parent && touched.parent}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.parent}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
          >
            {sms_list.map(item => (
              <MenuItem value={item.id}>{item.description}</MenuItem>
            ))}
          </Select>
          {!!errors.parent && touched.parent && <FormHelperText error>{errors.parent}</FormHelperText>}

        </FormControl>
        <FormControl fullWidth>
          <TextField
            multiline
            rows={10}
            label={t('SMS Matni')}
            size='small'
            name='description'
            error={!!errors.description && touched.description}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.description}
          />
          {!!errors.description && touched.description && <FormHelperText error>{errors.description}</FormHelperText>}
        </FormControl>
        <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
          {' '}
          {t('Saqlash')}
        </LoadingButton>
      </form>
    </Drawer>
  )
}
