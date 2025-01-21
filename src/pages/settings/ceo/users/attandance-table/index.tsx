import {
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from 'src/@core/hooks/useSettings'
import api from 'src/@core/utils/api'
import SubLoader from 'src/views/apps/loaders/SubLoader'

export default function EmployeesAttendanceTable() {
  const [dates, setDates] = useState<any>([])
  const [attendances, setAttendances] = useState<any>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, '0') 
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { settings } = useSettings()

  console.log(selectedYear,selectedMonth);
  
  async function fetchEmployeesAttendance(year: any, month: string) {
    setLoading(true)
    const date = `${year}-${month}-01`
    await api
      .get(`auth/attendance/employees/?date=${date}`)
      .then(res => {
        setAttendances(res.data.result)
        setDates(res.data.dates)
      })
      .catch(err => {
        console.error(err)
      })
    setLoading(false)
  }

  useEffect(() => {
    fetchEmployeesAttendance(selectedYear, selectedMonth)
  }, [selectedYear, selectedMonth])

  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value)
  }

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value)
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const startYear = 2020 
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h5' sx={{ paddingY: 5 }}>
          {t('Xodimlar Davomati')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id='year-select-label'>{t('Yilni tanlang')}</InputLabel>
            <Select
              labelId='year-select-label'
              value={selectedYear}
              onChange={handleYearChange}
              label={t('Yilni tanlang')}
            >
              {generateYearOptions().map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id='month-select-label'>{t('Oyni tanlang')}</InputLabel>
            <Select
              labelId='month-select-label'
              value={selectedMonth}
              onChange={handleMonthChange}
              label={t('Oyni tanlang')}
            >
              <MenuItem value='01'>{t('Yanvar')}</MenuItem>
              <MenuItem value='02'>{t('Fevral')}</MenuItem>
              <MenuItem value='03'>{t('Mart')}</MenuItem>
              <MenuItem value='04'>{t('Aprel')}</MenuItem>
              <MenuItem value='05'>{t('May')}</MenuItem>
              <MenuItem value='06'>{t('Iyun')}</MenuItem>
              <MenuItem value='07'>{t('Iyul')}</MenuItem>
              <MenuItem value='08'>{t('Avgust')}</MenuItem>
              <MenuItem value='09'>{t('Sentyabr')}</MenuItem>
              <MenuItem value='10'>{t('Oktyabr')}</MenuItem>
              <MenuItem value='11'>{t('Noyabr')}</MenuItem>
              <MenuItem value='12'>{t('Dekabr')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {loading ? (
        <SubLoader />
      ) : (
        <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  className={`sticky left-0 bg-${settings.mode === 'dark' ? '#282A42' : '#ffffff'}`}
                  sx={{minWidth:150, zIndex: 100, position: 'sticky', left: 0 }}
                >
                  {t('Ism')}
                </TableCell>
                <TableCell
                  className={`sticky left-150 bg-${settings.mode === 'dark' ? '#282A42' : '#ffffff'}`}
                  sx={{ zIndex: 100, position: 'sticky', left: 150 }}
                >
                  {t('Telefon')}
                </TableCell>
                {dates.map((d: any) => (
                  <TableCell key={d.date} sx={{ textAlign: 'center' }}>
                    {new Date(d.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell
                    sx={{
                      minWidth:150,
                      position: 'sticky',
                      left: 0,
                      background: settings.mode === 'dark' ? '#282A42' : '#ffffff',
                      zIndex: 1,
                      fontSize: '14px',
                      padding: '8px 20px',
                      borderRight: `1px solid ${settings.mode === 'dark' ? '#444' : '#c3cccc'}`
                    }}
                  >
                    {user.first_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 150,
                      background: settings.mode === 'dark' ? '#282A42' : '#ffffff',
                      zIndex: 1,
                      fontSize: '14px',
                      padding: '8px 20px',
                      borderRight: `1px solid ${settings.mode === 'dark' ? '#444' : '#c3cccc'}`
                    }}
                  >
                    {user.phone}
                  </TableCell>
                  {dates.map((d: any) => {
                    const attendance = user.attendances.filter((a: any) => {
                      const createdAt = new Date(a?.created_at)

                      if (isNaN(createdAt.getTime())) {
                        return false
                      }

                      return createdAt.toISOString().split('T')[0] === d.date
                    })
                    return (
                      <TableCell key={d.date} sx={{ textAlign: 'center' }}>
                        {attendance.length > 0
                          ? attendance.map((a: any, index: number) => {
                              const time = new Date(a.created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })

                              return (
                                <div
                                  key={a.id}
                                  className={`text-sm font-medium text-gray-700 py-1 ${
                                    index > 0 ? 'border-t border-gray-300' : ''
                                  }`}
                                >
                                  {time}
                                </div>
                              )
                            })
                          : '-'}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
