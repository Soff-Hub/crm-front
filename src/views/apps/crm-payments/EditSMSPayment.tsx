import LoadingButton from '@mui/lab/LoadingButton'
import {
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { formatAmount, revereAmount } from 'src/@core/components/amount-input'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import { formatCurrency } from 'src/@core/utils/format-currency'
import UserIcon from 'src/layouts/components/UserIcon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchCRMPayments, handleEditClientPayment, updatePaymentModal } from 'src/store/apps/c-panel'
import * as Yup from 'yup'

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

export default function EditSMSPaymentClientModal() {
  const { t } = useTranslation()
  const [isLoading, setLoading] = useState(false)
  const [file, setFile] = useState<any>(null)
  const { clientOwnPayments, editClientPayment, smsTariffs } = useAppSelector(state => state.cPanelSlice)
  const dispatch = useAppDispatch()

  const found = clientOwnPayments?.results?.find(item => item.id == editClientPayment)
  useEffect(() => {
    if (found) {
      formik.setValues({
        ...formik.initialValues, // Ensures you maintain the structure
        ...found,
        description: found.description || '',
        receipt: found.receipt || '',
        sms_tariff: String(found.sms_tariff) || '',
        amount: found.amount || ''
      })
    }
  }, [editClientPayment])

  const validationSchema = Yup.object({
    description: Yup.string().nullable(),
    receipt: Yup.string()
      .nullable()
      .required(t("To'lov chekini kiriting") as string),
    sms_tariff: Yup.string()
      .nullable()
      .required(t('Tarifni tanlang kiriting') as string),
    amount: Yup.string()
      .nullable()
      .required(t('Tarif summasini kiriting') as string)
  })

  const formik: any = useFormik({
    initialValues: {
      description: '',
      receipt: '',
      sms_tariff: '',
      amount: ''
    },
    validationSchema,
    onSubmit: async (values: any) => {
      setLoading(true)
      const formData = new FormData()
      if (values.receipt) {
        formData.append('description', String(values.description))
        formData.append('sms_tariff', String(values.sms_tariff))
        if (typeof values.receipt !== 'string') {
          formData.append('receipt', values.receipt)
        }
        formData.append('amount', String(values.amount))
      }
      const response = await dispatch(updatePaymentModal({ id: values.id, formData: formData }))

      if (response.meta.requestStatus == 'rejected') {
        formik.setErrors(response.payload)
      } else {
        toast.success("To'lov yangilandi")
        handleClose()
        await dispatch(fetchCRMPayments(''))
      }
      setLoading(false)
    }
  })

  const handleClose = () => {
    formik.resetForm()
    setFile(null)
    setLoading(false)
    dispatch(handleEditClientPayment(null))
  }

  const { isMobile } = useResponsive()

  return (
    <Drawer open={!!editClientPayment && !!found?.sms_tariff} hideBackdrop anchor='right' variant='temporary'>
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: isMobile ? '100%' : '400px' }}>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t("SMS to'lovni tahrirlash")}
          </Typography>
          <IconButton
            onClick={() => handleClose()}
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
        <Box width={'100%'}>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'baseline',
              padding: '20px 10px',
              gap: '10px'
            }}
          >
            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t('SMS tariflar')}
              </InputLabel>
              <Select
                size='small'
                name='sms_tariff'
                label={t('SMS tariflar')}
                id='user-view-language'
                labelId='user-view-language-label'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sms_tariff || ''}
                error={!!formik.errors.sms_tariff && !!formik.touched.sms_tariff}
              >
                {smsTariffs?.map(item => (
                  <MenuItem key={item.id} value={+item.id}>
                    <span style={{ color: '#84cc16' }}>
                      ({item.sms_count} {t('ta sms')})
                    </span>
                    <span style={{ color: '#f59e0b', marginRight: '5px' }}>({formatCurrency(item.amount)} so'm)</span>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!formik.errors.sms_tariff && !!formik.touched.sms_tariff}>
                {!!formik.errors.sms_tariff && !!formik.touched.sms_tariff && formik.errors.sms_tariff}
              </FormHelperText>
            </FormControl>
            <FormControl sx={{ width: '100%' }}>
              <TextField
                name='amount'
                size='small'
                label={t('Tarif summasi')}
                error={!!formik.errors.amount && !!formik.touched.amount}
                value={formatAmount(String(formik.values.amount))}
                defaultValue={formik.values.amount}
                onChange={e => formik.setFieldValue('amount', revereAmount(e.target.value))}
                onBlur={formik.handleBlur}
              />
              <FormHelperText error={!!formik.errors.amount && !!formik.touched.amount}>
                {!!formik.errors.amount && !!formik.touched.amount && formik.errors.amount}
              </FormHelperText>
            </FormControl>
            <Button
              fullWidth
              component='label'
              role={undefined}
              variant='outlined'
              tabIndex={-1}
              color={formik.errors.receipt && formik.touched.receipt ? 'error' : 'primary'}
              startIcon={<UserIcon icon={'iconamoon:cloud-upload-fill'} />}
            >
              {(formik.errors.receipt && formik.touched.receipt && formik.errors.receipt) ||
                file?.name ||
                'Chekni yuklash'}
              <VisuallyHiddenInput
                // value={formik.values.receipt || ""}
                onChange={(e: any) => (formik.setFieldValue('receipt', e.target.files[0]), setFile(e.target.files[0]))}
                onBlur={formik.handleBlur}
                name='receipt'
                type='file'
              />
            </Button>
            <FormControl sx={{ width: '100%' }}>
              <TextField
                name='description'
                size='small'
                label={t('Izoh')}
                multiline
                rows={4}
                error={!!formik.errors.description && !!formik.touched.description}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormHelperText error={!!formik.errors.description && !!formik.touched.description}>
                {!!formik.errors.description && !!formik.touched.description && formik.errors.description}
              </FormHelperText>
            </FormControl>
            <LoadingButton loading={isLoading} variant='contained' type='submit' fullWidth>
              {t('Yangilash')}
            </LoadingButton>
          </form>
        </Box>
      </Box>
    </Drawer>
  )
}
