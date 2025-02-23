import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  debounce,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentsList, updateStudentParams } from 'src/store/apps/students'
import useCourses from 'src/hooks/useCourses'
import useDebounce from 'src/hooks/useDebounce'
import { Toggle } from 'rsuite'
import 'rsuite/Toggle/styles/index.css'
import api from 'src/@core/utils/api'
import { MetaTypes } from 'src/types/apps/groupsTypes'
import { ModalTypes, SendSMSModal } from './view/UserViewLeft'
import useSMS from 'src/hooks/useSMS'
import 'rsuite/DateRangePicker/styles/index.css'
import { DatePicker } from 'rsuite'
import { format } from 'date-fns'
import { fetchSchoolsList, fetchSmsList } from 'src/store/apps/settings'
import ExcelStudents from 'src/@core/components/excelButton/ExcelStudents'
import ceoConfigs from 'src/configs/ceo'

type StudentsFilterProps = {
  isMobile: boolean
}

const StudentsFilter = ({ isMobile }: StudentsFilterProps) => {
  const dispatch = useAppDispatch()
  const { students, queryParams } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [key, setKey] = useState<string>('')
  const { getCourses, courses } = useCourses()
  const [groups, setGroups] = useState<any>()
  const [teachers, setTeachers] = useState<any>()
  const [isActive, setIsActive] = useState<boolean>(true)
  const { t } = useTranslation()
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const { smsTemps, getSMSTemps } = useSMS()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const studentIds = students.map(student => student.id)
  const handleEditClickOpen = (value: ModalTypes) => {
    setOpenEdit(value)
  }
  const queryString = new URLSearchParams({ ...queryParams } as Record<string, string>).toString()

  const handleEditClose = () => {
    setError({})
    setOpenEdit(null)
  }

  async function getGroups() {
    await api
      .get('common/group-check-list/')
      .then(res => setGroups(res.data))
      .catch(error => console.log(error))
  }
  async function getTeachers() {
    await api
      .get(`${ceoConfigs.employee_checklist}?role=teacher`)
      .then(res => setTeachers(res.data))
      .catch(error => console.log(error))
  }

  const handleSearch = (value: string) => {
    dispatch(updateStudentParams({ search: value }))
  }

  async function handleFilter(key: string, value: string | number | null) {
    dispatch(updateStudentParams({ [key]: value }))
    if (key === 'debt_date') {
      setIsActive(false)
      dispatch(updateStudentParams({ is_debtor: true, last_payment: '', not_in_debt: '', debt_date: `${value}` }))
    } else if (key === 'amount') {
      if (value === 'is_debtor') {
        setIsActive(false)
        dispatch(updateStudentParams({ is_debtor: true, last_payment: '', not_in_debt: '' }))
      } else if (value === 'not_in_debt') {
        setIsActive(false)
        dispatch(updateStudentParams({ is_debtor: '', last_payment: '', not_in_debt: true }))
      }
      if (value === 'last_payment') {
        setIsActive(true)
        dispatch(updateStudentParams({ last_payment: true, is_debtor: '', not_in_debt: '' }))
      } else if (value === 'all') {
        setIsActive(true)
        dispatch(updateStudentParams({ is_debtor: '', last_payment: '', not_in_debt: '' }))
      }
      return
    }
    if (key === 'status') {
      dispatch(updateStudentParams({ group_status: '', status: value }))
    }
  }

  useEffect(() => {
    if (key == 'course') {
      getCourses()
    } else if (key == 'group') {
      getGroups()
    } else if (key == 'teacher') {
      getTeachers()
    } else if (key == 'school') {
      dispatch(fetchSchoolsList())
    }
  }, [key])

  const groupOptions = groups?.map((item: MetaTypes) => ({
    label: item?.name,
    value: item?.id
  }))

  const teacherOptions = teachers?.map((item: any) => ({
    label: item?.first_name,
    value: item?.id
  }))

  useEffect(() => {
    dispatch(fetchStudentsList(queryParams as any))
  }, [queryParams])

  if (isMobile)
    <form id='mobile-filter-form'>
      <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel size='small' id='search-input'>
            {t('Qidirish')}
          </InputLabel>
          <OutlinedInput
            onChange={e => handleSearch(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconifyIcon icon={'tabler:search'} />
              </InputAdornment>
            }
            label='Qidirish'
            id='search-input'
            placeholder='Qidirish...'
            size='small'
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Kurslar')}
          </InputLabel>
          <Select
            onClick={() => setKey('course')}
            key={'course'}
            size='small'
            label={t('Kurslar')}
            defaultValue={''}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === '') {
                handleFilter('course', null)
              } else {
                handleFilter('course', e.target.value)
              }
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {courses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Maktab')}
          </InputLabel>

          <Select
            onClick={() => setKey('school')}
            size='small'
            label={t('Maktab')}
            value={queryParams.school}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              handleFilter('school', e.target.value)
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {schools.map((school: any) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Guruhdagi holati')}
          </InputLabel>
          <Select
            onClick={() => setKey('group_status')}
            size='small'
            label={t('Guruhdagi holati')}
            value={queryParams.group_status}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => handleFilter('group_status', e.target.value)}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'active'}>{t('active')}</MenuItem>
            {/* <MenuItem value={'archive'}>{t('archive')}</MenuItem> */}
            <MenuItem value={'new'}>{t('test')}</MenuItem>
            <MenuItem value={'frozen'}>{t('frozen')}</MenuItem>
            <MenuItem value={'not_activated'}>{t('Sinov darsidan ketganlar')}</MenuItem>
            <MenuItem value={'without_group'}>{t('Guruhsiz')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t("To'lov holati")}
          </InputLabel>
          <Select
            size='small'
            label={t("To'lov holati")}
            value={queryParams.is_debtor ? 'is_debtor' : Boolean(queryParams.last_payment) ? 'last_payment' : ''}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === 'is_debtor') {
                handleFilter('amount', 'is_debtor')
              } else if (e.target.value === 'last_payment') {
                handleFilter('amount', 'last_payment')
              } else if (e.target.value === 'not_in_debt') {
                handleFilter('amount', 'not_in_debt')
              } else {
                handleFilter('amount', 'all')
              }
            }}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'last_payment'}>{t("To'lov vaqti yaqinlashgan")}</MenuItem>
            <MenuItem value={'is_debtor'}>{t('Qarzdor')}</MenuItem>
            <MenuItem value={'not_in_debt'}>{t("Qarzdor bo'lmagan")}</MenuItem>
          </Select>
        </FormControl>

        {queryParams.is_debtor && (
          <DatePicker
            size='lg'
            label={`${queryParams.debt_date ? queryParams.debt_date : 'Yil va Oy'}`}
            value={queryParams.debt_date ? new Date(queryParams.debt_date) : null}
            format='MMM/yyyy'
            placeholder='Select month and year'
            onChange={value => {
              if (!value) {
                handleFilter('debt_date', '')
              } else {
                handleFilter('debt_date', format(value, 'yyyy-MM-dd'))
              }
            }}
            style={{ width: '100%' }}
          />
        )}

        <div onClick={() => setKey('group')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!groupOptions}
            disablePortal
            options={groupOptions || []}
            onChange={(e: any, v: any) => handleFilter('group', v?.value)}
            size='small'
            renderInput={params => <TextField {...params} label={t('Guruh')} />}
          />
        </div>
        <div onClick={() => setKey('group')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!teacherOptions}
            disablePortal
            options={teacherOptions || []}
            onChange={(e: any, v: any) => handleFilter('teacher', v?.value)}
            size='small'
            renderInput={params => <TextField {...params} label={t('Ustoz')} />}
          />
        </div>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Toggle
            checked={queryParams.status === 'archive'}
            color='red'
            checkedChildren={t('Arxiv')}
            unCheckedChildren={t('Arxiv')}
            onChange={e => {
              if (e) {
                handleFilter('status', 'archive')
              } else {
                handleFilter('status', 'active')
              }
            }}
          />
        </Box>
        <Button
          onClick={() => (getSMSTemps(), handleEditClickOpen('sms'))}
          variant='outlined'
          color='warning'
          fullWidth
          size='small'
          startIcon={<IconifyIcon icon='material-symbols-light:sms-outline' />}
        >
          {t('Sms yuborish')}
        </Button>
      </Box>
      <div onClick={() => dispatch(fetchSmsList())}>
        <SendSMSModal
          handleEditClose={handleEditClose}
          openEdit={openEdit}
          smsTemps={smsTemps}
          setOpenEdit={setOpenEdit}
          usersData={studentIds}
        />
      </div>
    </form>

  return (
    <Box display='flex' gap={2} alignItems='center' flexWrap={'wrap'} justifyContent='space-between' width='100%'>
      <Box display={'flex'} width='100%' gap={2} flexWrap={'nowrap'}>
        <FormControl sx={{ width: '100%', maxWidth: 260 }}>
          <InputLabel size='small' id='search-input'>
            {t('Qidirish')}
          </InputLabel>

          <OutlinedInput
            onChange={e => handleSearch(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconifyIcon icon={'tabler:search'} />
              </InputAdornment>
            }
            label='Qidirish'
            id='search-input'
            placeholder='Qidirish...'
            size='small'
          />
        </FormControl>

        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Kurslar')}
          </InputLabel>

          <Select
            size='small'
            onClick={() => setKey('course')}
            key={'course'}
            label={t('Kurslar')}
            defaultValue={''}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === '') {
                handleFilter('course', null)
              } else {
                handleFilter('course', e.target.value)
              }
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {courses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Maktab')}
          </InputLabel>
          <Select
            onClick={() => setKey('school')}
            size='small'
            label={t('Maktab')}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === '') {
                handleFilter('school', null)
              } else {
                handleFilter('school', e.target.value)
              }
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {schools?.map((school: any) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Guruhdagi holati')}
          </InputLabel>
          <Select
            size='small'
            onClick={() => setKey('group_status')}
            label={t('Guruhdagi holati')}
            value={queryParams.group_status}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => handleFilter('group_status', e.target.value)}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'active'}>{t('active')}</MenuItem>
            {/* <MenuItem value={'archive'}>{t('archive')}</MenuItem> */}
            <MenuItem value={'new'}>{t('test')}</MenuItem>
            <MenuItem value={'frozen'}>{t('frozen')}</MenuItem>
            <MenuItem value={'not_activated'}>{t('Sinov darsidan ketganlar')}</MenuItem>
            <MenuItem value={'without_group'}>{t('Guruhsiz')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t("To'lov holati")}
          </InputLabel>
          <Select
            size='small'
            onClick={() => setKey('payment_status')}
            label={t("To'lov holati")}
            value={
              queryParams.is_debtor
                ? 'is_debtor'
                : queryParams.not_in_debt
                ? 'not_in_debt'
                : Boolean(queryParams.last_payment)
                ? 'last_payment'
                : ''
            }
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === 'is_debtor') {
                handleFilter('amount', 'is_debtor')
              } else if (e.target.value === 'last_payment') {
                handleFilter('amount', 'last_payment')
              } else if (e.target.value === 'not_in_debt') {
                handleFilter('amount', 'not_in_debt')
              } else {
                handleFilter('amount', 'all')
              }
            }}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'last_payment'}>{t("To'lov vaqti yaqinlashgan")}</MenuItem>
            <MenuItem value={'is_debtor'}>{t('Qarzdor')}</MenuItem>
            <MenuItem value={'not_in_debt'}>{t("Qarzdor bo'lmagan")}</MenuItem>
          </Select>
        </FormControl>

        {queryParams.is_debtor && (
          <DatePicker
            cleanable
            size='lg'
            label={`${queryParams.debt_date ? queryParams.debt_date : 'Yil va Oy'}`}
            value={queryParams.debt_date ? new Date(queryParams.debt_date) : null}
            format='MMM/yyyy'
            placeholder='Select month and year'
            onChange={value => {
              if (!value) {
                handleFilter('debt_date', '')
              } else {
                handleFilter('debt_date', format(value, 'yyyy-MM-dd'))
              }
            }}
            style={{ width: 180 }}
          />
        )}

        <div onClick={() => setKey('group')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!groupOptions}
            sx={{ maxWidth: 180, width: '100%' }}
            disablePortal
            options={groupOptions || []}
            onChange={(e: any, v: any) => handleFilter('group', v?.value)}
            size='small'
            renderInput={params => <TextField {...params} label={t('Guruh')} />}
          />
        </div>
        <div onClick={() => setKey('teacher')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!teacherOptions}
            sx={{ maxWidth: 180, width: '100%' }}
            disablePortal
            value={teacherOptions?.find((option: any) => option.value === queryParams.teacher) || null}
            options={teacherOptions || []}
            onChange={(e: any, v: any) => handleFilter('teacher', v?.value)}
            size='small'
            renderInput={params => <TextField {...params} label={t('Ustoz')} />}
          />
        </div>

        {isActive && (
          <Box sx={{ display: 'flex', alignItems: 'center', width: 180 }}>
            <Toggle
              checked={queryParams.status === 'archive'}
              color='red'
              checkedChildren={t('Arxiv')}
              unCheckedChildren={t('Arxiv')}
              onChange={e => {
                if (e) {
                  handleFilter('status', 'archive')
                } else {
                  handleFilter('status', 'active')
                }
              }}
            />
          </Box>
        )}
        <ExcelStudents size='medium' url='/student/offset-list/' queryString={queryString} />
        <Button
          onClick={() => (getSMSTemps(), handleEditClickOpen('sms'))}
          variant='outlined'
          color='warning'
          fullWidth
          size='small'
          startIcon={<IconifyIcon icon='material-symbols-light:sms-outline' />}
        >
          {t('Sms yuborish')}
        </Button>
      </Box>

      <div onClick={() => dispatch(fetchSmsList())}>
        <SendSMSModal
          handleEditClose={handleEditClose}
          openEdit={openEdit}
          smsTemps={smsTemps}
          setOpenEdit={setOpenEdit}
          usersData={studentIds}
        />
      </div>
    </Box>
  )
}

export default StudentsFilter
