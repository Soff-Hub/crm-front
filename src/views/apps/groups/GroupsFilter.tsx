// @ts-nocheck

// ** MUI Imports
import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { useEffect, useState } from 'react'

// ** Third Party Imports
import 'react-datepicker/dist/react-datepicker.css' // Import CSS file for react-datepicker
import { useTranslation } from 'react-i18next'
import Excel from 'src/@core/components/excelButton/Excel'
import IconifyIcon from 'src/@core/components/icon'
import api from 'src/@core/utils/api'
import useDebounce from 'src/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchGroups, updateParams } from 'src/store/apps/groups'
import { TacherItemType } from 'src/types/apps/mentorsTypes'

type GroupsFilterProps = {
  isMobile: boolean
}

export const GroupsFilter = ({ isMobile }: GroupsFilterProps) => {
  const { queryParams, courses } = useAppSelector(state => state.groups)
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>('')
  const searchVal = useDebounce(search, 600)
  const [loading, setLoading] = useState<boolean>(false)
  const [teachersData, setTeachersData] = useState<TacherItemType[] | null>(null)

  const getTeachers = async () => {
   await api
      .get('auth/employees-check-list/?role=teacher')
      .then(data => {
        setTeachersData(data.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getTeachers()
  }, [])

  const { t } = useTranslation()

  const handleChangeStatus = async(e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ status: e.target.value }))
    // const queryString = new URLSearchParams({ ...queryParams, status: e.target.value }).toString()
   await  dispatch(fetchGroups({ ...queryParams, status: e.target.value }))
  }
  const handleChangeTeacher = async(e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ teacher: e.target.value }))    
    await dispatch(fetchGroups({ ...queryParams, teacher: e.target.value }))
  }
  const handleChangeCourse = async(e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ course: e.target.value }))
    await dispatch(fetchGroups({ ...queryParams, course: e.target.value }))
  }
  const handleChangeDateOfWeek = (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ day_of_week: e.target.value }))
    dispatch(fetchGroups({ ...queryParams, day_of_week: e.target.value }))
  }

  const handleSearch = async () => {
    setLoading(true)
    dispatch(updateParams({ search: searchVal }))
    await dispatch(fetchGroups({ ...queryParams, search: searchVal }))
    setLoading(false)
  }

  useEffect(() => {
    handleSearch()
  }, [searchVal])

  const queryString = new URLSearchParams({ ...queryParams }).toString()

  const options = teachersData?.map(item => ({
    label: item.first_name,
    value: item.id
  }))

  if (isMobile) {
    return (
      <form id='mobile-filter-form'>
        <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
          <FormControl sx={{ width: '100%', maxWidth: 260 }}>
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
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Holat')}
            </InputLabel>
            <Select
              size='small'
              label={t('Holat')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.status || ''}
              onChange={handleChangeStatus}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              <MenuItem value={'active'}>{'Aktiv'}</MenuItem>
              <MenuItem value={'archive'}>{'arxiv'}</MenuItem>
              <MenuItem value={'new'}>{'Sinov darsida'}</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
          <Autocomplete
                onChange={(e, v) => handleChangeTeacher({ ...e, target: { ...e.target, value: v?.value || '' } })}
                size='small'
                placeholder={"O'qituvchi"}
                disablePortal
                options={options}
                renderInput={params => <TextField {...params} label='Oqituvchi' />}
              />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kurslar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kurslar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.course || ''}
              onChange={handleChangeCourse}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              {courses?.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kunlar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kunlar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.day_of_week || ''}
              onChange={handleChangeDateOfWeek}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              <MenuItem value={'tuesday,thursday,saturday'}>Juft kunlari</MenuItem>
              <MenuItem value={'monday,wednesday,friday'}>Toq kunlari</MenuItem>
              <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>Har kuni</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </form>
    )
  } else
    return (
      <Box display={'flex'} gap={2} flexWrap={'nowrap'} alignItems='center' justifyContent='space-between' width='100%'>
        <Box display={'flex'} width='90%' gap={2} flexWrap={'nowrap'}>
          <FormControl sx={{ width: '100%', maxWidth: 260 }}>
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
          <FormControl sx={{ maxWidth: 220, width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Holat')}
            </InputLabel>
            <Select
              size='small'
              label={t('Holat')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.status || ''}
              onChange={handleChangeStatus}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              <MenuItem value={'active'}>{'Aktiv'}</MenuItem>
              <MenuItem value={'archived'}>{'Arxivlangan'}</MenuItem>
              <MenuItem value={'new'}>{'Yangi'}</MenuItem>
            </Select>
          </FormControl>
          {options?.length > 0 && (
            <FormControl sx={{ maxWidth: 180, width: '100%' }}>
              <Autocomplete
                onChange={(e, v) => handleChangeTeacher({ ...e, target: { ...e.target, value: v?.value || '' } })}
                size='small'
                placeholder={"O'qituvchi"}
                disablePortal
                options={options}
                renderInput={params => <TextField {...params} label='Oqituvchi' />}
              />
            </FormControl>
          )}
          <FormControl sx={{ maxWidth: 180, width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kurslar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kurslar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.course || ''}
              onChange={handleChangeCourse}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              {courses?.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ maxWidth: 180, width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kunlar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kunlar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.day_of_week || ''}
              onChange={handleChangeDateOfWeek}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              <MenuItem value={'tuesday,thursday,saturday'}>Juft kunlari</MenuItem>
              <MenuItem value={'monday,wednesday,friday'}>Toq kunlari</MenuItem>
              <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>Har kuni</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Excel url='/common/groups/export/' queryString={queryString} />
      </Box>
    )
}
