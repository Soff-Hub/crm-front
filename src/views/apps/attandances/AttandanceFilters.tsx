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

type AttandanceFiltersProps = {
  isMobile: boolean
}

export const AttandanceFilters = ({ isMobile }: AttandanceFiltersProps) => {
  const { queryParams } = useAppSelector(state => state.attendance)
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>('')
  const [teachersData, setTeachersData] = useState<TacherItemType[] | null>(null)
  const { branches, getBranches } = useBranches()

  

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

  const { t } = useTranslation()

  const handleChangeBranch = async(e: SelectChangeEvent<string>) => {
    
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

  const handleChangeDate = (e: SelectChangeEvent<string>) => {
    dispatch(updateQueryParam({ date: e.target.value }))
    const queryString = new URLSearchParams({ ...queryParams }).toString()
    dispatch(fetchAttendances(queryString))
  }

  const handleChangeDateYear = (e: SelectChangeEvent<string>) => {
    dispatch(updateQueryParam({ date_year: e.target.value }))
    const queryString = new URLSearchParams({ ...queryParams }).toString()
    dispatch(fetchAttendances(queryString))
  }

  const handleChangeDateMonth = (e: SelectChangeEvent<string>) => {
    dispatch(updateQueryParam({ date_month: e.target.value }))
    const queryString = new URLSearchParams({ ...queryParams }).toString()
    dispatch(fetchAttendances(queryString))
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

          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='date-select-label'>
              {t('Sana')}
            </InputLabel>
            <Select
              size='small'
              label={t('Sana')}
              id='date-select'
              labelId='date-select-label'
              value={queryParams.date || ''}
              onChange={handleChangeDate}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              {/* Add date options here */}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='year-select-label'>
              {t('Yil')}
            </InputLabel>
            <Select
              size='small'
              label={t('Yil')}
              id='year-select'
              labelId='year-select-label'
              value={queryParams.date_year || ''}
              onChange={handleChangeDateYear}
            >
              {/* Add year options here */}
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
              value={queryParams.date_month || ''}
              onChange={handleChangeDateMonth}
            >
              {/* Add month options here */}
            </Select>
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
