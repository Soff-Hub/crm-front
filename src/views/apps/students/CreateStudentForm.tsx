import { useEffect, useState } from 'react'

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
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Assets
import { useTranslation } from 'react-i18next'
import { today } from 'src/@core/components/card-statistics/kanban-item'

// ** Packs
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { CreateStudentDto } from 'src/types/apps/studentsTypes'
import {
  createStudent,
  fetchGroupCheckList,
  fetchStudentsList,
  setOpenEdit,
  updateStudentParams
} from 'src/store/apps/students'
import { useAppDispatch, useAppSelector } from 'src/store'
import useGroups from 'src/hooks/useGroups'
import useResponsive from 'src/@core/hooks/useResponsive'
import PhoneInput from 'src/@core/components/phone-input'
import { reversePhone } from 'src/@core/components/phone-input/format-phone-number'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import Router from 'next/router'
import api from 'src/@core/utils/api'

export default function CreateStudentForm() {
  // ** Hooks
  const { t } = useTranslation()
  const error: any = {}
  const dispatch = useAppDispatch()
  const { groups } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)

  const { isMobile } = useResponsive()
  const [isSchool, setIsSchool] = useState(false)
  // ** States
  const [isGroup, setIsGroup] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const school_type = localStorage.getItem('school_type')
  const getGroups = async () => {
    await dispatch(fetchGroupCheckList())
  }

  
  

  const validationSchema = Yup.object({
    first_name: Yup.string().required('Ismingizni kiriting'),
    phone: Yup.string().required('Telefon raqam kiriting'),
    birth_date: Yup.string(),
    gender: Yup.string().required('Jinsini tanlang'),
    password: Yup.string(),
    fixed_price: Yup.number().required("To'ldiring")
  })

  const initialValues: CreateStudentDto = {
    first_name: '',
    phone: '',
    school: '',
    contract_amount: 0,
    birth_date: today,
    gender: 'male',
    start_at: today,
    fixed_price: '0'
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (valuess: CreateStudentDto) => {
      setLoading(true)
      dispatch(disablePage(true))

      const discountConfig = {
        discount_amount: values?.fixed_price,
        discount_count: 100,
        discount_description: 'kurs oxirigacha',
        is_discount: isDiscount
      }

      const newVlaues = {
        ...valuess,
        phone: reversePhone(values.phone),
        group: values?.group ? [values.group] : [],
        ...discountConfig
      }

      const resp = await dispatch(createStudent(newVlaues))

      if (resp.meta.requestStatus === 'rejected') {
        formik.setErrors(resp.payload)
      } else {
        // if (isDiscount) {
        //   const discountConfig = {
        //     amount: values?.fixed_price,
        //     discount_count: 100,
        //     description: 'kurs oxirigacha',
        //     group: values?.group,
        //     student: resp.payload.id
        //   }
        //   await api.post(`common/personal-payment/`, discountConfig)
        // }

        toast.success("O'quvchi muvaffaqiyatli yaratildi")
        await dispatch(updateStudentParams({ status: 'active' }))
        await dispatch(fetchStudentsList({ status: 'active' }))
        dispatch(setOpenEdit(null))
        formik.resetForm()
        setIsGroup(false)
      }
      dispatch(disablePage(false))
      setIsDiscount(false)
      setLoading(false)
    }
  })

  const { values, errors, touched, handleBlur, handleChange } = formik

  useEffect(() => {
    getGroups()

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

      {school_type == 'private_school' && (
        <FormControl sx={{ width: '100%' }}>
          <TextField
            size='small'
            type='number'
            label={t('Kelishilgan summa')}
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

      {isGroup ? (
        <FormControl fullWidth>
          <InputLabel size='small' id='user-view-language-label'>
            {t('Guruhlar')}
          </InputLabel>
          <Select
            size='small'
            error={!!errors.group && touched.group}
            label={t('Guruhlar')}
            id='user-view-language'
            labelId='user-view-language-label'
            name='group'
            onChange={handleChange}
            value={values.group || ''}
            sx={{ mb: 3 }}
          >
            {groups.map(group => (
              <MenuItem key={group.id} value={Number(group.id)}>
                {group.name}
              </MenuItem>
            ))}
            <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/groups')}>
              {t('Yangi yaratish')}
              <IconifyIcon icon={'ion:add-sharp'} />
            </MenuItem>
          </Select>
          {errors.group && <FormHelperText error={!!errors.group}>{errors.group}</FormHelperText>}

          <TextField
            size='small'
            label={t("Qo'shilish sanasi")}
            name='start_at'
            type='date'
            error={!!errors.start_at && touched.start_at}
            value={values.start_at}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormHelperText error={true}>{errors.start_at}</FormHelperText>
        </FormControl>
      ) : (
        ''
      )}
      {isSchool && (
        // <FormControl sx={{ width: '100%' }}>
        // <Autocomplete
        //   noOptionsText="Ma'lumot yo'q"
        //   size="small"
        //     options={schools || []}
        //     value={formik.values.school}
        //   getOptionLabel={(option: any) => (typeof option === 'string' ? option : option.name)}
        //     onChange={(event, newValue:{name:string,id:number|string}) => {

        //     if (newValue?.id == 'add-group') {
        //       // Handle adding a new group
        //       console.log('Add Group clicked');
        //     } else {
        //       console.log('fwefewf');

        //     }
        //   }}
        //   // onInputChange={(event, value, reason) => {
        //   //   if (reason === 'input') {
        //   //     setCustomOptions([{ id: 'add-group', name: 'Add Group' }, ...(schools || [])]);
        //   //   }
        //   // }}
        //   filterOptions={(options, state) => {
        //     const filtered = options.filter(option => option.name?.toLowerCase().includes(state.inputValue.toLowerCase()));
        //     return [{ id: 'add-group', name: 'Add Group' }, ...filtered];
        //   }}
        //   onBlur={handleBlur}
        //   renderInput={params => (
        //     <TextField
        //       {...params}
        //       label={t('Maktab nomi')}
        //       placeholder="Maktab"
        //       error={!!errors.school}
        //       helperText={errors.school}
        //     />
        //   )}
        //   renderOption={(props, option) => (
        //     <li {...props}>
        //       {option.id === 'add-group' ? 'Maktab qoshish +' : option.name}
        //     </li>
        //   )}
        // />
        // </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='user-view-language-label'>
            {t('Maktab')}
          </InputLabel>
          <Select
            size='small'
            error={!!errors.school && touched.school}
            label={t('Maktab')}
            id='user-view-language'
            labelId='user-view-language-label'
            name='school'
            onChange={handleChange}
            value={values.school || ''}
            sx={{ mb: 3 }}
          >
            {schools.map((school: { id: number | string; name: string }) => (
              <MenuItem key={school.id} value={Number(school.id)}>
                {school.name}
              </MenuItem>
            ))}
            <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/settings/office/schools')}>
              {t('Yangi yaratish')}
              <IconifyIcon icon={'ion:add-sharp'} />
            </MenuItem>
          </Select>
          {errors.school && <FormHelperText error={!!errors.school}>{errors.school}</FormHelperText>}

          <TextField
            size='small'
            label={t("Qo'shilish sanasi")}
            name='start_at'
            type='date'
            error={!!errors.start_at && touched.start_at}
            value={values.start_at}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormHelperText error={true}>{errors.start_at}</FormHelperText>
        </FormControl>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {!isGroup && (
          <Button
            fullWidth
            onClick={async () => setIsGroup(true)}
            type='button'
            variant='outlined'
            size='small'
            startIcon={<IconifyIcon icon={'material-symbols:add'} />}
          >
            {t("Guruhga qo'shish")}
          </Button>
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {!isSchool && (
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

      {isGroup && values?.group && (
        <Box className='w-100'>
          {isDiscount && (
            <div>
              <TextField
                size='small'
                label={t('Alohida narx')}
                name='fixed_price'
                type='number'
                error={!!errors.fixed_price}
                value={values.fixed_price}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
              />
              <FormHelperText className='mb-2' error={true}>
                {errors.fixed_price}
              </FormHelperText>
            </div>
          )}

          <Button
            onClick={() => setIsDiscount(!isDiscount)}
            type='button'
            variant='outlined'
            size='small'
            color='warning'
          >
            {isDiscount ? "Alohida narxni o'chirish" : 'Alohida narx kiritish'}
          </Button>
        </Box>
      )}
      <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>
        {t('Saqlash')}
      </LoadingButton>
    </form>
  )
}
