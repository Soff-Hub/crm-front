import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'src/store'
import LoadingButton from '@mui/lab/LoadingButton'
import IconifyIcon from '../icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import Router from 'next/router'
import showResponseError from 'src/@core/utils/show-response-error'
import toast from 'react-hot-toast'

const EditCompany = ({ slug }: { slug?: any }) => {
  const { details, isLoading } = useAppSelector(state => state.companyDetails)
  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    name: Yup.string().required(t('Ism kiritish shart') || 'Ism kiritish shart'),
    reference_name: Yup.string().required(t('Majburiy maydon') || 'Majburiy maydon'),
    reference_phone: Yup.string()
      .matches(/^\+998\d{9}$/, t("Raqam noto'g'ri formatda") || "Raqam noto'g'ri formatda")
      .required(t('Majburiy maydon') || 'Majburiy maydon'),
    payment_service: Yup.string().required(t('Majburiy maydon') || 'Majburiy maydon'),
    number_of_lesson: Yup.number().when('payment_service', {
      is: 'number_of_lesson',
      then: schema => schema.required(t('Majburiy maydon') || 'Majburiy maydon')
    }),
    expiration_date: Yup.date().required(t('Majburiy maydon') || 'Majburiy maydon')
  })


  const formik = useFormik({
    initialValues: {
      name: details?.name || '',
      salary_service:details?.salary_service||"",
      reference_name: details?.reference_name || '',
      reference_phone: details?.reference_phone || '+998',
      payment_service: details?.payment_service || 'by_coming_date',
      number_of_lesson: details?.number_of_lesson || '',
      expiration_date: details?.expiration_date || ''
    },
    validationSchema,
    onSubmit: async values => {

      setLoading(true)
      try {
        await api.patch(`/owner/client/${details?.id}/`, values)
        Router.push('/c-panel')
        toast.success("O'zgartirildi")
      } catch (err: any) {
        showResponseError(err?.response?.data, formik.setErrors)
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <Box sx={{ padding: '0px 30px' }}>
      <form
        style={{
          width: '100%',
          display: 'flex',
          gap: '20px',
          flexDirection: !isMobile ? 'column' : 'row',
          alignItems: 'center'
        }}
        onSubmit={formik.handleSubmit}
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
            {t("O'quv markaz ma'lumotlarini tahrirlash")}
          </Typography>

          <FormControl fullWidth>
            <TextField
              label={t('Nomi')}
              name='name'
              size='small'
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label={t('Masul shaxs ismi')}
              name='reference_name'
              size='small'
              value={formik.values.reference_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.reference_name && Boolean(formik.errors.reference_name)}
              helperText={formik.touched.reference_name && formik.errors.reference_name}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label={t('Masul shaxs raqami')}
              name='reference_phone'
              size='small'
              value={formik.values.reference_phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.reference_phone && Boolean(formik.errors.reference_phone)}
              helperText={formik.touched.reference_phone && formik.errors.reference_phone}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t("Darslarga to'lov tartibi")}</InputLabel>
            <Select
              label={"Darslarga to'lov tartibi"}
              name='payment_service'
              value={formik.values.payment_service}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.payment_service && Boolean(formik.errors.payment_service)}
            >
              <MenuItem value={'by_coming_date'}>Har oy boshida</MenuItem>
              <MenuItem value={'number_of_lesson'}>Har nechtadur darsda</MenuItem>
              <MenuItem value={'by_added_at'}>Qoshilgan sanadan pul yechish</MenuItem>
              <MenuItem value={'by_lesson_price'}>Xar dars uchun pul yechish</MenuItem>
            </Select>
            <FormHelperText>{formik.touched.payment_service && formik.errors.payment_service}</FormHelperText>
          </FormControl>

          {formik.values.payment_service === 'number_of_lesson' && (
            <FormControl fullWidth>
              <TextField
                label={t("To'lov yechiladigan darslar soni")}
                name='number_of_lesson'
                size='small'
                type='number'
                value={formik.values.number_of_lesson}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.number_of_lesson && Boolean(formik.errors.number_of_lesson)}
                helperText={formik.touched.number_of_lesson && formik.errors.number_of_lesson}
              />
            </FormControl>
          )}
           <FormControl className='ms-auto' fullWidth>
                        <InputLabel size='small' id='user-view-language-label'>
                          {t('Oylik turi')}
                        </InputLabel>
                        <Select
                        
                          size='small'
                          label={t('Oylik turi')}
                          id='user-view-language'
                          labelId='user-view-language-label'
                          name='salary_service'
                          value={formik.values.salary_service}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.salary_service && Boolean(formik.errors.salary_service)}
                        >
                          <MenuItem value={'by_course_price'}>Kurs narxidan oylik hisoblash</MenuItem>
                          <MenuItem value={'by_student_arrears'}>Yechilgan puldan oylik hisoblash</MenuItem>
                          <MenuItem value={'by_student_payments'}>To'langan puldan oylik hisoblash</MenuItem>
                        </Select>
                      </FormControl>

          <LoadingButton loading={loading} variant='contained' type='submit'>
            {t('Saqlash')}
          </LoadingButton>
        </Box>
      </form>
    </Box>
  )
}

export default EditCompany
