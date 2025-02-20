import { useEffect, useRef, useState } from 'react'

// ** Components
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  debounce,
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
  fetchStudentGroups,
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
import { TeacherAvatar, VisuallyHiddenInput } from '../mentors/AddMentorsModal'
import { revereAmount } from 'src/@core/components/amount-input'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'

export default function CreateStudentForm() {
  // ** Hooks
  const { t } = useTranslation()
  const error: any = {}
  const dispatch = useAppDispatch()
  const { groups } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [image, setImage] = useState<any>(null)
  const profilePhoto: any = useRef(null)

  const { isMobile } = useResponsive()
  const [isSchool, setIsSchool] = useState(false)
  const [isGroup, setIsGroup] = useState<boolean>(false)
  const [isParent, setIsParent] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const [checked, setChecked] = useState(false)
  const [parents, setParents] = useState([])
  const school_type = localStorage.getItem('school_type')
  const getGroups = async () => {
    await dispatch(fetchGroupCheckList())
  }

  async function fetchParentsCheckList(search?: string) {
    api.get(`${ceoConfigs.parents_checklist}?search=${search || ''}`).then(res => {
      setParents(res.data)
    })
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required('Ismingizni kiriting'),
    phone: Yup.string().required('Telefon raqam kiriting'),
    birth_date: Yup.string(),
    parent_phone: Yup.string().nullable(),
    gender: Yup.string().required('Jinsini tanlang'),
    password: Yup.string(),
    fixed_price: Yup.number().required("To'ldiring")
  })

  const initialValues: CreateStudentDto = {
    first_name: '',
    phone: '',
    image: '',
    school: '',
    parent_phone: '',
    contract_amount: 0,
    birth_date: today,
    gender: 'male',
    start_at: today,
    fixed_price: '0'
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: CreateStudentDto) => {
      setLoading(true)
      dispatch(disablePage(true))
      console.log(values)

      const discountConfig = {
        discount_amount: values?.fixed_price,
        discount_count: 100,
        discount_description: 'kurs oxirigacha',
        is_discount: isDiscount
      }

      const newValues = new FormData()

      for (const [key, value] of Object.entries({ ...values })) {
        if (key === 'phone') {
          newValues.append(key, reversePhone(value as any))
        } else if (key === 'parent_phone') {
          if (String(value).length > 5) {
            newValues.append(key, reversePhone(value as any))
          }
        } else {
          newValues.append(key, value as any)
        }
      }
      if (image) {
        newValues.append('image', image)
      }

      const resp = await dispatch(createStudent(newValues))

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
        setIsSchool(false)
        setIsParent(false)
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
  const handleChangeCheck = (event: any) => {
    setChecked(event.target.checked)
  }

  const handleSearch = debounce(async (val: string) => {
    await dispatch(fetchGroupCheckList(val))
  }, 500)

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
        {image ? (
          <img
            width={100}
            height={100}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            src={URL.createObjectURL(image)}
            alt=''
          />
        ) : (
          <IconifyIcon fontSize={40} icon={'material-symbols-light:add-a-photo-outline'} />
        )}
        <VisuallyHiddenInput
          onChange={e => setImage(e.target?.files?.[0])}
          ref={profilePhoto}
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
      {/* {formik.errors?.phone == '"phone" foydalanuvchi allaqachon mavjud.' && (
        <FormControl>
          <FormControlLabel
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            control={<Checkbox checked={checked} onChange={handleChangeCheck} />}
            label='Aka ukami'
          />
        </FormControl>
      )} */}
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

      {isParent && (
        <>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel htmlFor='outlined-adornment-phone'>{t('Ota-ona telefon raqami')}</InputLabel>
            <PhoneInput
              id='outlined-adornment-phone'
              label={t('Ota-ona telefon raqami')}
              name='parent_phone'
              value={values.parent_phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <TextField
              size='small'
              label={t('Ota-ona ismi')}
              name='parent_first_name'
              error={!!errors.parent_first_name && touched.parent_first_name}
              value={values.parent_first_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </FormControl>
        </>
      )}

      {isSchool && (
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

      {isGroup && (
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
            <MenuItem className='hover:bg-gray-100 cursor-not-allowed' sx={{ width: '500px' }}>
              <TextField onChange={e => handleSearch(e.target.value)} label={'Qidiruv'} fullWidth size='small' />
            </MenuItem>

            {groups.map((group: any) => (
              <MenuItem key={group.id} value={Number(group.id)} sx={{ width: '500px' }}>
                {group.name}
              </MenuItem>
            ))}

            <MenuItem sx={{ fontWeight: 600, width: '500px' }} onClick={() => Router.push('/groups')}>
              <IconifyIcon icon={'ion:add-sharp'} />
              {t('Yangi yaratish')}
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
        {!isParent && (
          <Button
            fullWidth
            onClick={async () => setIsParent(true)}
            type='button'
            variant='outlined'
            size='small'
            startIcon={<IconifyIcon icon={'material-symbols:add'} />}
          >
            {t("Ota-ona telefon raqami qo'shish")}
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
