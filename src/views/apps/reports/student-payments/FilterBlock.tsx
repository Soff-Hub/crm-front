import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from '@mui/material'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateRangePicker } from 'rsuite'
import ExcelStudents from 'src/@core/components/excelButton/ExcelStudents'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import useDebounce from 'src/hooks/useDebounce'
import usePayment from 'src/hooks/usePayment'
import { formatDateString } from 'src/pages/finance'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentPaymentsList, GroupsPaymentType, updateParams } from 'src/store/apps/reports/studentPayments'

export default function FilterBlock() {
  const [search, setSearch] = useState<string>('')
  const { isMobile } = useResponsive()
  const { paymentMethods, getPaymentMethod } = usePayment()
  const { t } = useTranslation()
  const { groups, queryParams, teachersData } = useAppSelector(state => state.studentPayments)
  const { course_list } = useAppSelector(state => state.settings)
  const [teacher, setTeacher] = useState<string | null>(null)

  const queryString = new URLSearchParams({ ...queryParams }).toString()

  const dispatch = useAppDispatch()
  const [date, setDate] = useState<any>('')
  const searchVal = useDebounce(search, 800)

  const memoizedQueryString = useMemo(() => {
    return new URLSearchParams({ ...queryParams, search: searchVal, page: '1' }).toString()
  }, [queryParams, searchVal])

  useEffect(() => {
    dispatch(updateParams({ search: searchVal, page: '1' }))
    dispatch(fetchStudentPaymentsList(memoizedQueryString))
  }, [memoizedQueryString])

  const handleChangeDate = async (e: any) => {
    if (e) {
      dispatch(
        updateParams({ start_date: `${formatDateString(e[0])}`, end_date: `${formatDateString(e[1])}`, page: '1' })
      )

      const queryString = new URLSearchParams({
        ...queryParams,
        start_date: `${formatDateString(e[0])}`,
        end_date: `${formatDateString(e[1])}`,
        page: '1'
      }).toString()
      await dispatch(fetchStudentPaymentsList(queryString))
    } else {
      dispatch(updateParams({ start_date: ``, end_date: ``, page: '1' }))
      // const queryString = new URLSearchParams({ ...queryParams, start_date: ``, end_date: ``, page: '1' }).toString()
      // await dispatch(fetchStudentPaymentsList(queryString))
    }
    setDate(e)
  }

  const handleFilterGroup = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ group: e.target.value, page: '1' }))
    // const queryString = new URLSearchParams({ ...queryParams, group: e.target.value, page: '1' }).toString()
    // await dispatch(fetchStudentPaymentsList(queryString))
  }

  const handleFilterTeacher = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ teacher: e.target.value, page: '1' }))
    // const queryString = new URLSearchParams({ ...queryParams, teacher: e.target.value, page: '1' }).toString()
    // await dispatch(fetchStudentPaymentsList(queryString))
  }

  const handleFilterCourse = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ course: e.target.value, page: '1' }))
    // const queryString = new URLSearchParams({ ...queryParams, course: e.target.value, page: '1' }).toString()
    // await dispatch(fetchStudentPaymentsList(queryString))
  }
  const handleFilterPayment = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ payment_type: e.target.value, page: '1' }))
    // const queryString = new URLSearchParams({ ...queryParams, payment_type: e.target.value, page: '1' }).toString()
    // await dispatch(fetchStudentPaymentsList(queryString))
  }

  const filterGroup = (group: GroupsPaymentType[]) => {
    const teacherGroup: GroupsPaymentType[] = teacher?.length ? group?.filter(e => teacher === e.teacher) : group

    return teacherGroup.map(group => (
      <MenuItem key={group.id} value={group.id}>
        {group.name}
      </MenuItem>
    ))
  }

  useLayoutEffect(() => {
    getPaymentMethod()
  }, [])

  return (
    <Box
      sx={{
        display: 'grid',
        gridColumn: isMobile ? '1/5' : '1/5',
        alignItems: 'center',
        gridTemplateColumns: isMobile ? '1fr 1fr' : ' 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
        gap: '10px'
      }}
    >
      <FormControl variant='outlined' size='small' fullWidth>
        <InputLabel htmlFor='outlined-adornment-password'>{t('Qidirish')}</InputLabel>

        <OutlinedInput
          fullWidth
          sx={{ bgcolor: 'white' }}
          id='outlined-adornment-password'
          type='text'
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

      <FormControl fullWidth>
        <InputLabel size='small' id='group-filter-label'>
          {t('Guruhlar')}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Guruhlar')}
          value={queryParams.group || ''}
          id='group-filter'
          labelId='group-filter-label'
          onChange={handleFilterGroup}
        >
          <MenuItem value=''>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {filterGroup(groups)}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel size='small' id='group-filter-label'>
          {t('Tolov')}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Tolov')}
          value={queryParams.payment_type || ''}
          id='group-filter'
          labelId='group-filter-label'
          onChange={handleFilterPayment}
        >
          <MenuItem value=''>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {paymentMethods?.map((group: any) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel size='small' id='teacher-filter-label'>
          {t("O'qituvchilar")}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t("O'qituvchilar")}
          value={queryParams.teacher || ''}
          id='teacher-filter'
          labelId='teacher-filter-label'
          onChange={handleFilterTeacher}
        >
          <MenuItem value='' onClick={() => setTeacher(null)}>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {teachersData?.map((teacher: any) => (
            <MenuItem key={teacher.id} value={teacher.id} onClick={() => setTeacher(teacher.first_name)}>
              {teacher.first_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel size='small' id='course-filter-label'>
          {t('Kurslar')}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Kurslar')}
          value={queryParams.course || ''}
          id='course-filter'
          labelId='course-filter-label'
          onChange={handleFilterCourse}
        >
          <MenuItem value=''>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {course_list?.results?.map((course: any) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DateRangePicker
        style={{ minWidth: 'auto', gridColumn: isMobile ? '1/3' : '' }}
        showOneCalendar
        placement='bottomEnd'
        locale={{
          last7Days: t('Oxirgi hafta'),
          sunday: t('Yak'),
          monday: t('Du'),
          tuesday: t('Se'),
          wednesday: t('Chor'),
          thursday: t('Pa'),
          friday: t('Ju'),
          saturday: t('Sha'),
          ok: t('Saqlash'),
          today: t('Bugun'),
          yesterday: t('Kecha'),
          hours: t('Soat'),
          minutes: t('Minut'),
          seconds: t('Sekund')
        }}
        format='yyyy-MM-dd'
        onChange={handleChangeDate}
        translate='yes'
        size='lg'
        value={date}
      />
      <ExcelStudents queryString={queryString} url='/common/student/payments/' />
    </Box>
  )
}
