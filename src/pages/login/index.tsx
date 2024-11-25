// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import LoadingButton from '@mui/lab/LoadingButton'
import useResponsive from 'src/@core/hooks/useResponsive'
import toast from 'react-hot-toast'
import PhoneInput from 'src/@core/components/phone-input'
import { useTranslation } from 'react-i18next'
import { reversePhone } from 'src/@core/components/phone-input/format-phone-number'
import api from 'src/@core/utils/api'
import { toggleModal } from 'src/store/apps/page'
import { useAppDispatch } from 'src/store'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(0)
  }
}))


const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))


const schema = yup.object().shape({
  phone: yup.string().required('Telefon raqam kiriting'),
  password: yup.string().min(1).required("Parol kiriting")
})

const defaultValues = {
  phone: '',
  password: ''
}

interface FormData {
  phone: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const dispatch = useAppDispatch()
  // ** Hooks
  const auth = useAuth()
  const { isMobile } = useResponsive()
  const { t } = useTranslation()
  let currentDate = new Date().toISOString()

  const pageLoad = async () => {
    try {
      const response = await api.get("common/public-settings/")
      if (response.status == 200) {
        setData(response.data)
      }
    } catch {
      toast.error("Markaz ma'lumotini olib bo'lmadi")
    }
  }

  useEffect(() => {
    pageLoad()
  }, [])


  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { phone, password } = data
    await auth.login({ phone: reversePhone(phone), password }, (resp: any) => {
      console.log(resp.response);
   
      if (resp?.response) {
        setLoading(false)
        Object.keys(resp?.response?.data).map((el: any) => {
          return setError(el, {
            type: 'manual',
            message: resp?.response?.data[el]
          })
        })
      
      } else {
        setLoading(false)
        toast.error("Network Error!", { position: 'top-center' })
      }
    })
  }


  return (
    <Box className='content-right'>
      {data && <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <LoginIllustrationWrapper sx={{ maxWidth: isMobile ? '300px' : '450px' }}>
          <Box sx={{ mb: 6, display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            {data && <Box style={{ width: "auto", height: "80px", marginBottom: "10px" }}>
              <img src={data?.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "scale-down" }} />
            </Box>}
            {data ? <TypographyStyled variant='h5'>{`${data?.training_center_name || themeConfig.templateName}! ga Xush kelibsiz 👋🏻`}</TypographyStyled> :
              <TypographyStyled variant='h5'>{`Xush kelibsiz 👋🏻`}</TypographyStyled>}
            <Typography variant='body2'>Iltimos tizimga kirish uchun shaxsiy malumotlaringizni kiriting</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel error={Boolean(errors.phone)} htmlFor="login-input">{t('phone')}</InputLabel>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <PhoneInput
                    id='login-input'
                    size='medium'
                    label='Telefon raqam'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.phone)}
                  // placeholder='+998 90 000 00 00'
                  />
                )}
              />
              {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                Parol
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Parol'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
            </Box>
            <LoadingButton loading={loading} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
              Kirish
            </LoadingButton>
          </form>
        </LoginIllustrationWrapper>
        <FooterIllustrationsV2 />
      </Box>}
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
