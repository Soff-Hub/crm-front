import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentsList, updateStudentParams } from 'src/store/apps/students'
import useCourses from 'src/hooks/useCourses'
import useDebounce from 'src/hooks/useDebounce'
import { Toggle } from 'rsuite'
import 'rsuite/Toggle/styles/index.css'
import Excel from 'src/@core/components/excelButton/Excel'
import api from 'src/@core/utils/api'
import { GroupFormInitialValue, MetaTypes } from 'src/types/apps/groupsTypes'

type StudentsFilterProps = {
  isMobile: boolean
}

const StudentsFilter = ({ isMobile }: StudentsFilterProps) => {
  const [search, setSearch] = useState<string>('')
  const dispatch = useAppDispatch()
  const { queryParams } = useAppSelector(state => state.students)
  const { getCourses, courses } = useCourses()
  const [groups, setGroups] = useState<any>()
  const [teachers, setTeachers] = useState<any>()

  const { t } = useTranslation()
  const searchVal = useDebounce(search, 800)

  async function getGroups() {
    await api
      .get('common/group-check-list/')
      .then(res => setGroups(res.data))
      .catch(error => console.log(error))
  }
  async function getTeachers() {
    await api
      .get('auth/employees-check-list/?role=teacher')
      .then(res => setTeachers(res.data))
      .catch(error => console.log(error))
  }

  async function handleFilter(key: string, value: string | number | null) {
    dispatch(updateStudentParams({ [key]: value }))
    if (key === 'amount') {
      if (value === 'is_debtor') {
        dispatch(updateStudentParams({ is_debtor: true, last_payment: '' }))
        await dispatch(fetchStudentsList({ ...queryParams, is_debtor: true, last_payment: '' }))
      }
      if (value === 'last_payment') {
        dispatch(updateStudentParams({ last_payment: true, is_debtor: '' }))
        await dispatch(fetchStudentsList({ ...queryParams, last_payment: true, is_debtor: '' }))
      } else if (value === 'all') {
        dispatch(updateStudentParams({ is_debtor: '', last_payment: '' }))
        await dispatch(fetchStudentsList({ ...queryParams, is_debtor: '', last_payment: '' }))
      }
      return
    }
    if (key === 'status') {
      dispatch(updateStudentParams({ group_status: '', status: value }))
      await dispatch(fetchStudentsList({ ...queryParams, [key]: value }))
    } else {
      await dispatch(fetchStudentsList({ ...queryParams, [key]: value }))
    }
  }

  useEffect(() => {
    getCourses()
    getGroups()
    getTeachers()
  }, [])

  const groupOptions = groups?.map((item: MetaTypes) => ({
    label: item?.name,
    value: item?.id
  }))
  const teacherOptions = teachers?.map((item: any) => ({
    label: item?.first_name,
    value: item?.id
  }))
  useEffect(() => {
    dispatch(fetchStudentsList({ ...queryParams, search: searchVal }))
  }, [searchVal])

  const queryString = new URLSearchParams({ ...queryParams } as Record<string, string>).toString()

  if (isMobile) {
    return (
      <form id='mobile-filter-form'>
        <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='search-input'>
              {t('Qidirish')}
            </InputLabel>
            <OutlinedInput
              onChange={e => setSearch(e.target.value)}
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
              {t('Guruhdagi holati')}
            </InputLabel>
            <Select
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
              <MenuItem value={'frozen'}>{t('Muzlatilgan')}</MenuItem>
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
            </Select>
          </FormControl>
          <Box sx={{ width: '100%' }}>
            <Autocomplete
              disablePortal
              options={groupOptions}
              onChange={(e: any, v: any) => handleFilter('group', v?.value)}
              size='small'
              renderInput={params => <TextField {...params} label='Guruh' />}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Autocomplete
              disablePortal
              options={teacherOptions}
              onChange={(e: any, v: any) => handleFilter('teacher', v?.value)}
              size='small'
              renderInput={params => <TextField {...params} label='Ustoz' />}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Toggle
              checked={queryParams.status === 'archive'}
              color='red'
              checkedChildren='Arxiv'
              unCheckedChildren='Arxiv'
              onChange={e => {
                if (e) {
                  handleFilter('status', 'archive')
                } else {
                  handleFilter('status', 'active')
                }
              }}
            />
          </Box>
        </Box>
      </form>
    )
  } else
    return (
      <Box display={'flex'} gap={2} alignItems='center' flexWrap={'wrap'} justifyContent='space-between' width='100%'>
        <Box display={'flex'} width='90%' gap={2} flexWrap={'nowrap'}>
          <FormControl variant='outlined' size='small' sx={{ maxWidth: 180, width: '100%' }}>
            <InputLabel htmlFor='outlined-adornment-password'>{t('Qidirish')}</InputLabel>
            <OutlinedInput
              fullWidth
              id='outlined-adornment-password'
              type={'text'}
              onChange={(e: any) => setSearch(e.target.value)}
              value={search}
              autoComplete='off'
              endAdornment={
                <InputAdornment position='end'>
                  <IconifyIcon icon={'tabler:search'} />
                </InputAdornment>
              }
              label={t('Qidirish')}
            />
          </FormControl>
          <FormControl sx={{ maxWidth: 180, width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kurslar')}
            </InputLabel>
            <Select
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

          <FormControl sx={{ maxWidth: 180, width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Guruhdagi holati')}
            </InputLabel>
            <Select
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
              <MenuItem value={'frozen'}>{t('Muzlatilgan')}</MenuItem>
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
              label={t("To'lov holati")}
              value={queryParams.is_debtor ? 'is_debtor' : Boolean(queryParams.last_payment) ? 'last_payment' : ''}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              onChange={(e: any) => {
                if (e.target.value === 'is_debtor') {
                  handleFilter('amount', 'is_debtor')
                } else if (e.target.value === 'last_payment') {
                  handleFilter('amount', 'last_payment')
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
            </Select>
          </FormControl>

          <Box sx={{ width: '100%' }}>
            <Autocomplete
              sx={{ maxWidth: 180, width: '100%' }}
              disablePortal
              options={groupOptions}
              onChange={(e: any, v: any) => handleFilter('group', v?.value)}
              size='small'
              renderInput={params => <TextField {...params} label='Guruh' />}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Autocomplete
              sx={{ maxWidth: 180, width: '100%' }}
              disablePortal
              options={teacherOptions}
              onChange={(e: any, v: any) => handleFilter('teacher', v?.value)}
              size='small'
              renderInput={params => <TextField {...params} label='Ustoz' />}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', width: 180 }}>
            <Toggle
              checked={queryParams.status === 'archive'}
              color='red'
              checkedChildren='Arxiv'
              unCheckedChildren='Arxiv'
              onChange={e => {
                if (e) {
                  handleFilter('status', 'archive')
                } else {
                  handleFilter('status', 'active')
                }
              }}
            />
          </Box>
          {/* <Excel url='/common/students/export/' queryString={queryString} /> */}
        </Box>
      </Box>
    )
}

export default StudentsFilter
