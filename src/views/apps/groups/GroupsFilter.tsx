// @ts-nocheck

// ** MUI Imports
import { LoadingButton } from '@mui/lab'
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
import { setOnlineLessonLoading } from 'src/store/apps/groupDetails'
import { fetchGroups, updateParams } from 'src/store/apps/groups'
import { TacherItemType } from 'src/types/apps/mentorsTypes'

type GroupsFilterProps = {
  isMobile: boolean
}

export const GroupsFilter = ({ isMobile }: GroupsFilterProps) => {
  const { queryParams, courses, teachersData } = useAppSelector(state => state.groups)
  const { onlineLessonLoading } = useAppSelector(state => state.groupDetails)

  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>('')
  const searchVal = useDebounce(search, 600)
  const [loading, setLoading] = useState<boolean>(false)
  
  const { t } = useTranslation()
 
  async function handleGetMeetLink() {
    if (window.location.hostname == 'test.soffcrm.uz' || 'localhost') {
      dispatch(setOnlineLessonLoading(true))
      await api.get(`meets/google/login/`).then(res => {
        if (res.data.url) {
          window.location.assign(res.data.url)
          // console.log(window.location);
          
          // dispatch(setMeetLink(res.data.url))
        }
      })
      dispatch(setOnlineLessonLoading(false))
    } else {
      console.log('xatolik')
    }
  }
 


  const handleChangeStatus = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ status: e.target.value }))
    const queryString = new URLSearchParams({ ...queryParams, status: e.target.value }).toString()
    await dispatch(fetchGroups({ ...queryParams, status: e.target.value }))
  }
  const handleChangeTeacher = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ teacher: e.target.value }))
    await dispatch(fetchGroups({ ...queryParams, teacher: e.target.value }))
  }
  const handleChangeCourse = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ course: e.target.value }))
    await dispatch(fetchGroups({ ...queryParams, course: e.target.value }))
  }
  const handleChangeDateOfWeek = (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ day_of_week: e.target.value }))
    dispatch(fetchGroups({ ...queryParams, day_of_week: e.target.value }))
  }

  const handleSearch = async (searchVal: string) => {
    setLoading(true)
    dispatch(updateParams({ search: searchVal }))
    await dispatch(fetchGroups({ ...queryParams, search: searchVal }))
    setLoading(false)
  }

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
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'active'}>{t('Aktiv')}</MenuItem>
              <MenuItem value={'archived'}>{t('archive')}</MenuItem>
              <MenuItem value={'new'}>{t('Sinov darsida')}</MenuItem>
              <MenuItem value={'frozen'}>{t('Muzlatilgan')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              onChange={(e, v) => handleChangeTeacher({ ...e, target: { ...e.target, value: v?.value || '' } })}
              size='small'
              placeholder={"O'qituvchi"}
              disablePortal
              options={options}
              renderInput={params => <TextField {...params} label={t("O'qituvchi")} />}
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
                <b>{t('Barchasi')}</b>
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
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'tuesday,thursday,saturday'}>{t('Juft kunlari')}</MenuItem>
              <MenuItem value={'monday,wednesday,friday'}>{t('Toq kunlari')}</MenuItem>
              <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>{t('Har kuni')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </form>
    )
  } else
    return (
      <Box  display={'flex'} gap={2} flexWrap={'nowrap'} alignItems='center' justifyContent='space-between' width='100%'>
        <Box display={'flex'} width='100%' gap={2} flexWrap={'nowrap'}>
          <FormControl sx={{ width: '100%'}}>
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
          <FormControl sx={{width: '100%' }}>
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
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'active'}>{t('active')}</MenuItem>
              <MenuItem value={'archived'}>{t('archive')}</MenuItem>
              <MenuItem value={'new'}>{t('new')}</MenuItem>
              <MenuItem value={'frozen'}>{t('frozen')}</MenuItem>
            </Select>
          </FormControl>
          {options?.length > 0 && (
            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                onChange={(e, v) => handleChangeTeacher({ ...e, target: { ...e.target, value: v?.value || '' } })}
                size='small'
                placeholder={"O'qituvchi"}
                disablePortal
                options={options}
                renderInput={params => <TextField {...params} label={t("O'qituvchi")} />}
              />
            </FormControl>
          )}
          <FormControl sx={{width: '100%' }}>
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
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'tuesday,thursday,saturday'}>{t('Juft kunlari')}</MenuItem>
              <MenuItem value={'monday,wednesday,friday'}>{t('Toq kunlari')}</MenuItem>
              <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>{t('Har kuni')}</MenuItem>
            </Select>
          </FormControl>
          <Excel url='/common/groups/export/' queryString={queryString} />
          <LoadingButton
                  loading={onlineLessonLoading}
                color='success'
                variant='outlined'
                onClick={() => {
                  handleGetMeetLink()
                }}
              >
                <IconifyIcon icon='mdi:laptop' />
              </LoadingButton>
        </Box>
      </Box>
    )
}
