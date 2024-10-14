import React, { useContext } from 'react'
import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { createBotNotification, fetBotOwners, setOpenCreate } from 'src/store/apps/logs'
import toast from 'react-hot-toast'
import Link from 'next/link'
import i18n from 'src/configs/i18n'

export default function CreateBotNotificationModal() {
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)

  const dispatch = useAppDispatch()
  const { openCreate } = useAppSelector(state => state.logs)

  const handleClose = () => {
    dispatch(setOpenCreate(false))
  }

  let alerts: any = {
    uz: (
      <Alert severity='warning' className='mb-3'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Xodim o'z mahsus idsini{' '}
        <Link
          href={'https://t.me/soffcrm_support_bot'}
          target='_blank'
          style={{ color: 'green', textDecoration: 'none' }}
        >
          @soffcrm_support_bot
        </Link>{' '}
        <br />
        dan olishi kerak
      </Alert>
    ),
    en: (
      <Alert severity='warning' className='mb-3'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        The employee should <br /> get their unique id from{' '}
        <Link
          href={'https://t.me/soffcrm_support_bot'}
          target='_blank'
          style={{ color: 'green', textDecoration: 'none' }}
        >
          @soffcrm_support_bot
        </Link>{' '}
      </Alert>
    ),
    ru: (
      <Alert severity='warning' className='mb-3'>
        <AlertTitle>{t('Eslatma')}</AlertTitle>
        Сотрудник должен получить свой <br /> уникальный идентификатор от{' '}
        <Link
          href={'https://t.me/soffcrm_support_bot'}
          target='_blank'
          style={{ color: 'green', textDecoration: 'none' }}
        >
          @soffcrm_support_bot
        </Link>{' '}
        .
      </Alert>
    )
  }

  const formik = useFormik({
    initialValues: {
      full_name: '',
      chat_id: null,
      branches: []
    },

    validationSchema: Yup.object({
      full_name: Yup.string().required('Ism kiritish majburiy'),
      chat_id: Yup.number().required('Mahsus ID kiritish majburiy').nullable(),
      branches: Yup.array().of(Yup.number().required()).required('Filial tanlash majburiy').nullable()
    }),

    onSubmit: async values => {
      const errorCallback = (err: any) => {
        formik.setErrors(err)
      }
      const resp = await dispatch(createBotNotification(values))
      if (resp.meta.requestStatus === 'rejected') {
        return errorCallback(resp.payload)
      }

      await dispatch(fetBotOwners())
      toast.success(`${values.full_name} ${t('bot_success_msg')}`)
      handleClose()
      formik.resetForm()
    }
  })

  return (
    <Dialog open={openCreate} onClose={handleClose}>
      <DialogContent>
        <div style={{ minWidth: '300px' }}>
          {alerts[i18n.language]}

          <form onSubmit={formik.handleSubmit}>
            <div className='mb-3'>
              <TextField
                fullWidth
                size='small'
                name='full_name'
                autoComplete='full_name'
                label={t('first_name')}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.full_name}
                error={!!formik.errors.full_name}
              />
              {!!formik.errors.full_name && (
                <FormHelperText error={!!formik.errors.full_name}>{formik.errors.full_name}</FormHelperText>
              )}
            </div>

            <div className='mb-3'>
              <TextField
                fullWidth
                size='small'
                name='chat_id'
                autoComplete='chat_id'
                label={t('Mahsus ID')}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.chat_id}
                error={!!formik.errors.chat_id}
              />
              {!!formik.errors.chat_id && (
                <FormHelperText error={!!formik.errors.chat_id}>{formik.errors.chat_id}</FormHelperText>
              )}
            </div>

            <FormControl error={!!formik.errors.branches} fullWidth className='mb-3'>
              <InputLabel size='small' id='demo-simple-select-outlined-label'>
                {t('Filiallar')}
              </InputLabel>
              <Select
                multiple
                size='small'
                label={t('Filiallar')}
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                onChange={e => formik.setFieldValue('branches', e.target.value)}
                value={formik.values.branches}
                error={!!formik.errors.branches}
              >
                {user?.branches?.map(el => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button type='submit' variant='contained' fullWidth>
              {t('Yaratish')}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
