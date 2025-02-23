import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import Form from '../form'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import IconifyIcon from '../icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import Router from 'next/router'
import showResponseError from 'src/@core/utils/show-response-error'
import LoadingButton from '@mui/lab/LoadingButton'
import { today } from '../card-statistics/kanban-item'

type Props = {
  slug?: number | undefined
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default function CreateCompany({ slug }: Props) {
  const [error, setError] = useState<any>({})
  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [selectVal, setSelectVal] = useState<any>(null)

  async function handleSubmit(values: any) {
    setLoading(true)
    try {
      await api.post(`/owner/create/client/`, values)
      Router.push('/c-panel')
    } catch (err: any) {
      showResponseError(err?.response?.data, setError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          padding: '0px 30px'
        }}
      >
        <Form
          valueTypes='form-data'
          id='create-company'
          onSubmit={handleSubmit}
          setError={setError}
          sx={{
            width: '100%',
            display: 'flex',
            gap: '20px',
            flexDirection: !isMobile ? 'column' : 'row',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              maxWidth: '600px',
              width: '100%',
              flexDirection: 'column'
            }}
          >
            <Typography sx={{ fontSize: '20px', borderBottom: '1px solid white', marginBottom: '20px' }}>
              {t("Yangi o'quv markaz yaratish uchun quyidagi ma'lumotlarni to'ldiring")}
            </Typography>

            <FormControl fullWidth>
              <TextField error={error?.name?.error} size='small' label={t('Nomi')} name='name' />
              <FormHelperText error={error?.name?.error}>{error?.name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.reference_name?.error}
                size='small'
                label={t('Masul shaxs ismi')}
                name='reference_name'
              />
              <FormHelperText error={error?.reference_name?.error}>{error?.reference_name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.reference_phone?.error}
                size='small'
                label={t('Masul shaxs raqami')}
                name='reference_phone'
                defaultValue={'+998'}
              />
              <FormHelperText error={error?.reference_phone?.error}>{error?.reference_phone?.message}</FormHelperText>
            </FormControl>

            <Box style={{ display: 'flex', gap: '8px' }}>
              <FormControl fullWidth>
                <Input
                  error={error?.domain?.error}
                  placeholder='example'
                  autoComplete='off'
                  size='small'
                  name='domain'
                  style={{ width: '100%' }}
                  endAdornment='.soffcrm.uz'
                />
                <FormHelperText error={error?.domain?.error}>{error?.domain?.message}</FormHelperText>
              </FormControl>
            </Box>

            <FormControl className='ms-auto' fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t("Darslarga to'lov tartibi")}
              </InputLabel>
              <Select
                required
                size='small'
                label={t("Darslarga to'lov tartibi")}
                id='user-view-language'
                labelId='user-view-language-label'
                sx={{ mb: 1 }}
                onChange={e => setSelectVal(e.target.value)}
                defaultValue={'by_coming_date'}
                name='payment_service'
              >
                <MenuItem value={'by_coming_date'}>Har oy boshida</MenuItem>
                <MenuItem value={'by_added_at'}>Qoshilgan sanadan pul yechish</MenuItem>
                <MenuItem value={'by_lesson_price'}>Xar dars uchun pul yechish</MenuItem>
                <MenuItem value={'number_of_lesson'}>Har nechtadur darsda</MenuItem>
              </Select>
            </FormControl>

            {selectVal === 'number_of_lesson' && (
              <FormControl fullWidth>
                <TextField
                  required
                  name='number_of_lesson'
                  error={error?.number_of_lesson?.error}
                  type='number'
                  size='small'
                  label={t("To'lov yechiladigan darslar soni")}
                />
                <FormHelperText error={error?.number_of_lesson?.error}>
                  {error?.number_of_lesson?.message}
                </FormHelperText>
              </FormControl>
            )}

            <FormControl className='ms-auto' fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t('Oylik turi')}
              </InputLabel>
              <Select
                required
                size='small'
                label={t('Oylik turi')}
                id='user-view-language'
                labelId='user-view-language-label'
                sx={{ mb: 1 }}
                onChange={e => setSelectVal(e.target.value)}
                defaultValue={'by_course_price'}
                name='salary_service'
              >
                <MenuItem value={'by_course_price'}>Kurs narxidan oylik hisoblash</MenuItem>
                <MenuItem value={'by_student_arrears'}>Yechilgan puldan oylik hisoblash</MenuItem>
                <MenuItem value={'by_student_payments'}>To'langan puldan oylik hisoblash</MenuItem>
              </Select>
            </FormControl>

            <FormControl className='ms-auto' fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t("Darslarga to'lov tartibi")}
              </InputLabel>
              <Select
                required
                size='small'
                label={t("Darslarga to'lov tartibi")}
                id='user-view-language'
                labelId='user-view-language-label'
                sx={{ mb: 1 }}
                onChange={e => setSelectVal(e.target.value)}
                defaultValue={'by_coming_date'}
                name='payment_service'
              >
                <MenuItem value={'by_coming_date'}>Har oy boshida</MenuItem>
                <MenuItem value={'by_added_at'}>Qoshilgan sanadan pul yechish</MenuItem>
                <MenuItem value={'by_lesson_price'}>Xar dars uchun pul yechish</MenuItem>
                <MenuItem value={'number_of_lesson'}>Har nechtadur darsda</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.expiration_date?.error}
                type='date'
                size='small'
                label={t("Tizim to'xtash sanasi")}
                name='expiration_date'
                defaultValue={today}
              />
              <FormHelperText error={error?.expiration_date?.error}>{error?.expiration_date?.message}</FormHelperText>
            </FormControl>

            <Button
              component='label'
              role={undefined}
              variant='outlined'
              startIcon={<IconifyIcon icon={'lets-icons:upload'} />}
            >
              {t('Logo yuklash')}
              <VisuallyHiddenInput accept='.png, .jpg, .jpeg, .webp' name='logo' type='file' />
            </Button>

            <Typography sx={{ fontSize: '20px', marginTop: '15px' }}>
              {t("Yangi foydalanuvchi yaratish uchun quyidagi ma'lumotlarni to'ldiring")}
            </Typography>

            <FormControl fullWidth>
              <TextField error={error?.first_name?.error} size='small' label={t('first_name')} name='first_name' />
              <FormHelperText error={error?.first_name?.error}>{error?.first_name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.phone?.error}
                size='small'
                label={t('phone')}
                name='phone'
                defaultValue={'+998'}
              />
              <FormHelperText error={error?.phone?.error}>{error?.phone?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField size='small' label={t('password')} name='password' style={{ width: '100%' }} />
              <FormHelperText error={error?.password?.error}>{error?.password?.message}</FormHelperText>
            </FormControl>

            <LoadingButton
              loading={loading}
              variant='contained'
              startIcon={<IconifyIcon icon={'fluent:save-16-regular'} />}
              type='submit'
            >
              {t('Saqlash')}
            </LoadingButton>
          </Box>
        </Form>
      </Box>
    </Box>
  )
}
