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

import 'react-datepicker/dist/react-datepicker.css'
import { useTranslation } from 'react-i18next'
import Excel from 'src/@core/components/excelButton/Excel'
import api from 'src/@core/utils/api'
import useBranches from 'src/hooks/useBranch'
import { store, useAppDispatch, useAppSelector } from 'src/store'
import { fetchAttendances, updateQueryParam } from 'src/store/apps/attandance'
import { TacherItemType } from 'src/types/apps/mentorsTypes'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { format, parseISO } from 'date-fns'
type AttandanceFiltersProps = {
  isMobile: boolean
}

export const AttandanceFilters = ({ isMobile }: AttandanceFiltersProps) => {
  const { t } = useTranslation()
  const { queryParams } = useAppSelector(state => state.attendance)
  const dispatch = useAppDispatch()
  const [teachersData, setTeachersData] = useState<TacherItemType[] | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { branches, getBranches } = useBranches()
  const now = new Date()
  const currentYear = new Date().getFullYear()

  const years = Array.from({ length: currentYear - 2021 + 1 }, (_, index) => 2021 + index)

  const monthOptions = [
    t('Yanvar'),
    t('Fevral'),
    t('Mart'),
    t('Aprel'),
    t('May'),
    t('Iyun'),
    t('Iyul'),
    t('Avgust'),
    t('Sentabr'),
    t('Oktabr'),
    t('Noyabr'),
    t('Dekabr')
  ]

  // const [defaultYear, defaultMonth] = useMemo(() => {
  //   if (queryParams.date) {
  //     const [year, month] = queryParams.date.split('-')
  //     return [year, parseInt(month, 10)]
  //   }
  //   return [String(currentYear), 1]
  // }, [queryParams.date, currentYear])

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
    getBranches()
  }, [])

  const handleChangeBranch = async (e: SelectChangeEvent<string>) => {
    dispatch(updateQueryParam({ branch: e.target.value }))

    const updatedQueryParams = store.getState().attendance.queryParams

    const queryString = new URLSearchParams({ ...updatedQueryParams }).toString()

    await dispatch(fetchAttendances(queryString))
  }

  const handleChangeTeacher = async (value: string) => {
    dispatch(updateQueryParam({ teacher: value }))

    const updatedQueryParams = store.getState().attendance.queryParams

    const queryString = new URLSearchParams({ ...updatedQueryParams }).toString()

    await dispatch(fetchAttendances(queryString))
  }

  const handleChangeDate = async (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
      const formattedDate = format(date, 'yyyy-MM-dd')
      await dispatch(updateQueryParam({ date: formattedDate, date_month: '', date_year: '' }))
      const updatedQueryParams = store.getState().attendance.queryParams

      const queryString = new URLSearchParams({ ...updatedQueryParams }).toString()
      await dispatch(fetchAttendances(queryString))
    }
  }

  const handleChangeDateYear = async (e: SelectChangeEvent<string>) => {
    setSelectedDate(null)
    const month = queryParams.date_month ? queryParams.date_month.split('-')[1] : queryParams.date_month || '01'

    const day = String(now.getDate()).padStart(2, '0')
    dispatch(
      updateQueryParam({
        date_year: `${e.target.value}-${month}-${day}`,
        date: ''
      })
    )

    const updatedQueryParams = store.getState().attendance.queryParams

    const queryString = new URLSearchParams({ ...updatedQueryParams }).toString()

    await dispatch(fetchAttendances(queryString))
  }

  const handleChangeDateMonth = async (e: SelectChangeEvent<string>) => {
    setSelectedDate(null)
    const year = queryParams.date_year ? queryParams.date_year.split('-')[0] : queryParams.date_year || currentYear
    const day = String(now.getDate()).padStart(2, '0')
    dispatch(updateQueryParam({ date_month: `${year}-${e.target.value}-${day}`, date: '' }))

    const updatedQueryParams = store.getState().attendance.queryParams

    const queryString = new URLSearchParams({ ...updatedQueryParams }).toString()

    await dispatch(fetchAttendances(queryString))
  }

  const queryString = new URLSearchParams({ ...queryParams }).toString()

  const options =
    teachersData?.map(item => ({
      label: item?.first_name,
      value: item?.id
    })) || []

  return (
    <Box>
      <form id='filter-form'>
        <Box
          display={'flex'}
          gap={2}
          flexDirection={isMobile ? 'column' : 'row'}
          paddingTop={isMobile ? 3 : 0}
          rowGap={isMobile ? 4 : 0}
        >
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='branch-select-label'>
              {t('Filial')}
            </InputLabel>
            <Select
              size='small'
              label={t('Filial')}
              id='branch-select'
              labelId='branch-select-label'
              value={queryParams.branch || ''}
              onChange={handleChangeBranch}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              {branches?.map(branch => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size='small'  sx={{width: '100%' }}>
            <LocalizationProvider  dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:"center"
                  }
                }}
                
                value={selectedDate}
                onChange={newValue => {
                  handleChangeDate(newValue)
                }}
                
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' placeholder='yilni tanlang' id='year-select-label'>
              {t('Yil')}
            </InputLabel>
            <Select
              size='small'
              label={t('Yil')}
              id='year-select'
              labelId='year-select-label'
              value={queryParams.date_year?.split('-')[0]}
              onChange={handleChangeDateYear}
            >
              {years.map(year => (
                <MenuItem key={year} value={`${year}`}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='month-select-label'>
              {t('Oy')}
            </InputLabel>
            <Select
              size='small'
              label={t('Oy')}
              id='month-select'
              labelId='month-select-label'
              value={queryParams.date_month.split('-')[1]}
              onChange={handleChangeDateMonth}
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              {monthOptions.map((month, index) => (
                <MenuItem key={index} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              onChange={(e: any, v) => handleChangeTeacher(String(v?.value))}
              size='small'
              placeholder={"O'qituvchi"}
              disablePortal
              options={options}
              renderInput={params => <TextField {...params} label='Oqituvchi' />}
            />
          </FormControl>
        </Box>
      </form>

      {!isMobile && (
        <Box display={'flex'} justifyContent='flex-end' marginTop={2}>
          <Excel url='/common/attendances/export/' queryString={queryString} />
        </Box>
      )}
    </Box>
  )
}