import { Box, FormControl, FormHelperText, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import Router from 'next/router'
import showResponseError from 'src/@core/utils/show-response-error'
import Form from 'src/@core/components/form'

export default function CreateCompany() {
  const [error, setError] = useState<any>({})
  const { isMobile } = useResponsive()
  const { t } = useTranslation()

  async function handleSubmit(values: any) {
    try {
      await api.post(`/owner/create/user/`, values)
      Router.push('/c-panel')
    } catch (err: any) {
      showResponseError(err?.response?.data, setError)
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
              {t("Yangi foydalanuvchi yaratish uchun quyidagi ma'lumotlarni to'ldiring")}
            </Typography>

            <FormControl fullWidth>
              <TextField error={error?.first_name} size='small' label={t('first_name')} name='first_name' />
              <FormHelperText error={error?.first_name}>{error?.first_name}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField error={error?.phone} size='small' label={t('phone')} name='phone' defaultValue={'+998'} />
              <FormHelperText error={error?.phone}>{error?.phone}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField size='small' label={t('password')} name='password' style={{ width: '100%' }} />
              <FormHelperText error={error?.password}>{error?.password}</FormHelperText>
            </FormControl>

            <Button variant='contained' type='submit'>
              {t('Saqlash')}
            </Button>
          </Box>
        </Form>
      </Box>
    </Box>
  )
}
