import { useEffect, useRef, useState } from 'react'

// ** Components
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Assets
import { useTranslation } from 'react-i18next'

// ** Packs
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { UpdateStudentDto } from 'src/types/apps/studentsTypes'
import { fetchStudentsList, setOpenEdit, updateStudent } from 'src/store/apps/students'
import { useAppDispatch, useAppSelector } from 'src/store'
import useGroups from 'src/hooks/useGroups'
import useResponsive from 'src/@core/hooks/useResponsive'
import PhoneInput from 'src/@core/components/phone-input'
import { reversePhone } from 'src/@core/components/phone-input/format-phone-number'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import { TeacherAvatar, VisuallyHiddenInput } from '../mentors/AddMentorsModal'

export default function EditStudentForm() {
  // ** Hooks
  const { t } = useTranslation()
  const error: any = {}
  const dispatch = useAppDispatch()
  const { isMobile } = useResponsive()
  const { studentData, queryParams } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [rowsPerPage, setRowsPerPage] = useState<number>(() => Number(localStorage.getItem('rowsPerPage')) || 10)

  const [isGroup, setIsGroup] = useState<boolean>(false)
  const [isPassword, setIsPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isSchool, setIsSchool] = useState(false)
  const [image, setImage] = useState<any>(null)
  const profilePhoto: any = useRef(null)
  const school_type = localStorage.getItem('school_type')

  const validationSchema = Yup.object({
    first_name: Yup.string().required('Ismingizni kiriting'),
    phone: Yup.string().required('Telefon raqam kiriting'),
    birth_date: Yup.string(),
    gender: Yup.string().required('Jinsini tanlang'),
    password: Yup.string()
  })

  const initialValues: UpdateStudentDto = {
    id: studentData?.id,
    image: studentData?.image,
    contract_amount: studentData?.contract_amount || 0,
    school: studentData?.school_data?.id,
    first_name: studentData?.first_name || '',
    phone: studentData?.phone?.replace('+998', '') || '',
    gender: studentData?.gender || 'male',
    birth_date: studentData?.birth_date || null
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: UpdateStudentDto) => {
      setLoading(true)
      dispatch(disablePage(true))
      const newValues = new FormData();

      for (const [key, value] of Object.entries(values)) {
        if (!['image'].includes(key)) {
          if (key === "phone") {
            newValues.append(key, reversePhone(value as any));
          } else if (key === "school") {
            newValues.append(key, value || ''); 
          } else if (Array.isArray(value) || typeof value === "object") {
            newValues.append(key, JSON.stringify(value)); 
          } else {
            newValues.append(key, value as any);
          }
        }
      }
      
      if (image) {
        newValues.append("image", image);
      } else {
        console.error("Invalid image type:", image);
      }
      
      for (let pair of newValues.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const resp = await dispatch(updateStudent({ data: newValues, id: studentData?.id }));
      

      if (resp.meta.requestStatus === 'rejected') {
        formik.setErrors(resp.payload)
      } else {
        toast.success("O'zgarishlar muvaffaqiyatli saqlandi")
        await dispatch(fetchStudentsList({ ...queryParams, limit: String(rowsPerPage) }))

        dispatch(setOpenEdit(null))
        formik.resetForm()
        setIsGroup(false)
      }
      setLoading(false)
      dispatch(disablePage(false))
    }
  })

  const { values, errors, touched, handleBlur, handleChange } = formik

  useEffect(() => {
    return () => {
      formik.resetForm()
    }
  }, [])

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'baseline',
        padding: '20px 10px',
        gap: '10px',
        minWidth: isMobile ? '330px' : '400px'
      }}
    >
      <TeacherAvatar
        onClick={() => profilePhoto?.current?.click()}
        skin='light'
        color={'info'}
        variant='rounded'
        sx={{ cursor: 'pointer', margin: '0 auto 10px' }}
      >
        {profilePhoto.current?.files?.[0] || formik.values?.image ? (
          <img
            width={100}
            height={100}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            src={image ? URL.createObjectURL(image) : formik.values?.image ? formik.values?.image : ''}
            alt=''
          />
        ) : (
          <IconifyIcon fontSize={40} icon={'material-symbols-light:add-a-photo-outline'} />
        )}
        <VisuallyHiddenInput
          ref={profilePhoto}
          name='image'
          onChange={e => setImage(e.target?.files?.[0])}
          type='file'
          accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic'
        />
      </TeacherAvatar>
      <FormControl sx={{ width: '100%' }}>
        <TextField
          size='small'
          label={t('first_name')}
          name='first_name'
          error={!!errors.first_name && touched.first_name}
          value={values.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.first_name && touched.first_name && <FormHelperText error={true}>{errors.first_name}</FormHelperText>}
      </FormControl>

      <FormControl sx={{ width: '100%' }}>
        <InputLabel error={!!errors.phone && touched.phone} htmlFor='outlined-adornment-password'>
          {t('phone')}
        </InputLabel>
        <PhoneInput
          id='outlined-adornment-password'
          label={t('phone')}
          name='phone'
          error={!!errors.phone && touched.phone}
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.phone && touched.phone && <FormHelperText error={true}>{errors.phone}</FormHelperText>}
      </FormControl>

      {isSchool && (
        <FormControl sx={{ width: '100%' }}>
          <Autocomplete
            noOptionsText="Ma'lumot yo'q"
            size='small'
            options={schools || []}
            getOptionLabel={(option: any) => option.name}
            onChange={(event, newValue) => {
              formik.setFieldValue('school', newValue.id)
            }}
            onBlur={handleBlur}
            renderInput={params => (
              <TextField
                {...params}
                label={t('Maktab nomi')}
                placeholder='Maktab'
                error={!!errors.school}
                helperText={errors.school}
              />
            )}
          />
        </FormControl>
      )}

      {studentData?.school_data && (
        <FormControl sx={{ width: '100%' }}>
          <Autocomplete
            noOptionsText="Ma'lumot yo'q"
            size='small'
            options={schools || []}
            value={schools?.find((school: any) => school.id === studentData.school_data.id) || null}
            getOptionLabel={(option: any) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            onChange={(event, newValue: any) => {
              formik.setFieldValue('school', newValue ? newValue.id : null)
            }}
            onBlur={handleBlur}
            renderInput={params => (
              <TextField
                {...params}
                label={t('Maktab nomi')}
                placeholder='Maktab'
                error={!!errors.school}
                helperText={errors.school}
              />
            )}
          />
        </FormControl>
      )}
      {school_type == 'private_school' && (
        <FormControl sx={{ width: '100%' }}>
          <TextField
            size='small'
            type='number'
            label={t('contract_amount')}
            name='contract_amount'
            error={!!errors.contract_amount && touched.contract_amount}
            value={values.contract_amount}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.contract_amount && touched.contract_amount && (
            <FormHelperText error={true}>{errors.contract_amount}</FormHelperText>
          )}
        </FormControl>
      )}

      <FormControl sx={{ width: '100%' }}>
        <TextField
          size='small'
          label={t('birth_date')}
          name='birth_date'
          type='date'
          error={!!errors.birth_date && touched.birth_date}
          value={values.birth_date}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormHelperText error={true}>{errors.birth_date}</FormHelperText>
      </FormControl>

      <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormLabel>{t('Jinsini tanlang')}</FormLabel>
        <RadioGroup
          aria-labelledby='demo-controlled-radio-buttons-group'
          name='gender'
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <FormControlLabel value='male' control={<Radio />} label={t('Erkak')} />
            <FormControlLabel value='female' control={<Radio />} label={t('Ayol')} />
          </Box>
        </RadioGroup>
      </FormControl>

      {isPassword ? (
        <FormControl sx={{ width: '100%' }}>
          <TextField
            size='small'
            label={t('password')}
            name='password'
            error={!!errors.password && touched.password}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormHelperText error={true}>{errors.password}</FormHelperText>
        </FormControl>
      ) : (
        ''
      )}

      <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>
        {t('Saqlash')}
      </LoadingButton>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {!studentData?.school_data && (
          <Button
            fullWidth
            color='warning'
            onClick={async () => setIsSchool(true)}
            type='button'
            variant='outlined'
            size='small'
            startIcon={<IconifyIcon icon={'material-symbols:add'} />}
          >
            {t("Maktab qo'shish")}
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* {!isGroup && <Button onClick={async () => (setIsGroup(true), await getGroups())} type='button' variant='outlined' size='small' startIcon={<IconifyIcon icon={'material-symbols:add'} />}>{t("Guruhga qo'shish")}</Button>} */}
        {!isPassword && (
          <Button
            onClick={() => setIsPassword(true)}
            type='button'
            variant='outlined'
            size='small'
            color='warning'
            startIcon={<IconifyIcon icon={'lucide:key-round'} />}
          >
            {t("Parol qo'shish")}
          </Button>
        )}
      </Box>
    </form>
  )
}
