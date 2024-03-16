// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** React Imports
import { SyntheticEvent } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import IconifyIcon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Actions
import { Button, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import MyGroups from 'src/views/my-groups'
import api from 'src/@core/utils/api'
import { useRouter } from 'next/router'
import useResponsive from 'src/@core/hooks/useResponsive'
import generateTimeSlots from 'src/@core/utils/generate-time-slots'
import { lessonData } from 'src/@core/utils/db'
import { TranslateWeekName } from '../groups'

const statsData: {
  icon: string
  title: string
  color: ThemeColor
  key: string
}[] = [
    {
      icon: "mdi:user-check-outline",
      title: "Faol Lidlar",
      color: 'success',
      key: 'leads_count'
    },
    {
      icon: "arcticons:studentid",
      title: "Faol talabalar",
      color: 'info',
      key: 'active_students'
    },
    {
      icon: "la:layer-group",
      title: "Guruhlar",
      color: 'warning',
      key: 'active_groups'
    },
    {
      icon: "material-symbols-light:warning-outline",
      title: "Qarzdorlar",
      color: 'error',
      key: 'debtor_users'
    },
    {
      icon: "tabler:calendar-stats",
      title: "Sinov darsida",
      color: 'primary',
      key: 'test_students'
    },
    {
      icon: "fa-solid:chalkboard-teacher",
      title: "O'qituvchilar",
      color: 'success',
      key: 'teacher_count'
    },
  ]

const startTime = '09:00';
const endTime = '21:01';


const AppCalendar = () => {

  // ** Hooks
  const { settings } = useSettings()
  const { user } = useContext(AuthContext)
  const { push, pathname, query } = useRouter()
  const { isMobile, isTablet } = useResponsive()
  const [stats, setStats] = useState<any>(null)
  const [tabValue, setTabValue] = useState<string>('1')
  const [open, setOpen] = useState<null | 'week'>(null)
  const [weeks, setWeeks] = useState<any>(query?.weeks ? (typeof query.weeks === 'string' ? query.weeks.split(',') : query.weeks) : []);


  // ** Vars
  const { skin } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [events, setEvents] = useState<any>([])

  async function getStats() {
    const resp = await api.get('common/dashboard/statistic-list/')
    setStats(resp.data);
  }

  async function getLessons() {
    const resp = await api.get('common/dashboard/group-list/')
  }


  useEffect(() => {
    getStats()
    getLessons()
  }, [])

  return user?.role === 'teacher' ? <MyGroups /> : (
    <>
      {
        stats ? (
          <Box sx={{ display: 'grid', gap: '10px', mb: 5, gridTemplateColumns: `repeat(${isMobile ? 3 : isTablet ? 4 : 8}, 1fr)` }} >
            {
              statsData.map((_, index) => (
                <Box key={index} className=''>
                  <CardStatsVertical title={stats?.[_.key]} stats={_.title} icon={<IconifyIcon fontSize={"4rem"} icon={_.icon} />} color={_.color} />
                </Box>
              ))
            }
          </Box>
        ) : (
          <Box sx={{ my: 3, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
          </Box>
        )
      }
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 'none',
            backgroundColor: 'background.paper',
            ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {}),
            maxWidth: '100%'
          }}
        >
          <Box sx={{}}>
            <TabContext value={tabValue}>
              <TabList onChange={(event, value: string) => setTabValue(value)} aria-label='centered tabs example'>
                <Tab value='1' label='Juft kunlar' sx={{ p: '0 !important', fontSize: '9px' }} />
                <Tab value='2' label='Toq kunlar' sx={{ p: '0 !important', fontSize: '9px' }} />
                <Tab value='3' label='Har kuni' sx={{ p: '0 !important', fontSize: '9px' }} />
                <Tab value='4' label='Boshqa' sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => setOpen('week')} />
              </TabList>
            </TabContext>
          </Box>
          <Box sx={{
            padding: '0 15px',
            maxWidth: '100%',
            overflowX: 'scroll'
          }}>
            <table border={0}>
              <tbody>
                <tr>
                  <td style={{ minWidth: '100px', fontSize: '12px' }}>
                    Xonalar / Soat
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', }}>
                      {generateTimeSlots(startTime, endTime).map((el: string) => <Box sx={{ width: '50px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{el}</Box>)}
                    </Box>
                  </td>
                </tr>
                {
                  lessonData.map(lesson => (
                    <tr style={{ borderBottom: '1px solid #c3cccc65' }}>
                      <td style={{ minWidth: '100px', fontSize: '12px' }}>
                        {lesson.room}
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', position: 'relative', marginLeft: '25px' }}>
                          {generateTimeSlots(startTime, endTime).map((el: string) => <Box sx={{ width: '50px', height: '45px', borderLeft: '1px solid #c3cccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></Box>)}
                          {
                            lesson.lessons.map(item => (
                              <Box sx={{ width: `${generateTimeSlots(item.start_at, item.end_at).length * 50}px`, height: '45px', position: 'absolute', padding: '5px', left: `${generateTimeSlots(startTime, endTime).findIndex(el => el === generateTimeSlots(item.start_at, item.end_at)[0]) * 50}px` }}>
                                <Box sx={{ borderRadius: '8px', bgcolor: 'rgba(255, 165, 0, 0.8)', width: '100%', height: '100%', cursor: 'pointer', padding: '2px 6px', overflow: 'hidden' }}>
                                  <Typography sx={{ color: 'black', fontSize: '10px' }}>{item.start_at} - {item.end_at} / Frontend 030</Typography>
                                  <Typography sx={{ color: 'black', fontSize: '10px' }}>Doniyor Eshmamatov</Typography>
                                </Box>
                              </Box>
                            ))
                          }
                        </Box>
                      </td>
                    </tr>
                  ))
                }
                {/* {
                  [1, 2, 3, 4, 5].map(() => (
                    <tr>
                      <td style={{ minWidth: '100px', fontSize: '12px' }}>
                        Frontend xonasi
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', position: 'relative', marginLeft: '25px' }}>
                          {generateTimeSlots(startTime, endTime).map((el: string) => <Box sx={{ width: '50px', height: '45px', borderLeft: '1px solid #c3cccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></Box>)}
                          {
                            lessons.map(lesson => (
                              <Box sx={{ width: `${generateTimeSlots(lesson.start_at, lesson.end_at).length * 50}px`, height: '45px', position: 'absolute', padding: '5px', left: `${generateTimeSlots(startTime, endTime).findIndex(el => el === generateTimeSlots(lesson.start_at, lesson.end_at)[0]) * 50}px` }}>
                                <Box sx={{ borderRadius: '8px', bgcolor: 'rgba(255, 165, 0, 0.8)', width: '100%', height: '100%', cursor: 'pointer', padding: '2px 6px', overflow: 'hidden' }}>
                                  <Typography sx={{ color: 'black', fontSize: '10px' }}>{lesson.start_at} - {lesson.end_at} / Frontend 030</Typography>
                                  <Typography sx={{ color: 'black', fontSize: '10px' }}>Doniyor Eshmamatov</Typography>
                                </Box>
                              </Box>
                            ))
                          }
                        </Box>
                      </td>
                    </tr>
                  ))
                } */}
              </tbody>
            </table>
          </Box>
        </Box>

        <Dialog open={open === 'week'} onClose={() => setOpen(null)}>
          <DialogTitle sx={{ minWidth: isMobile ? '' : '300px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Hafta kunlari
            <IconifyIcon icon={'ic:baseline-close'} onClick={() => setOpen(null)} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {
                ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(week => (
                  <FormControl key={week}>
                    <label style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                      <span>{TranslateWeekName[week]}</span>
                      <Checkbox checked={weeks.includes(week)} onClick={() => setWeeks((c: any) => c.includes(week) ? c.filter((dd: any) => dd !== week) : [...c, week])} />
                    </label>
                  </FormControl>
                ))
              }
              <Button
                variant='contained'
                onClick={() => {
                  push({
                    pathname,
                    query: {
                      weeks: weeks.join(',')
                    }
                  })
                  setOpen(null)
                }}
              >Ko'rish</Button>
            </Box>
          </DialogContent>
        </Dialog>
      </CalendarWrapper >
    </>

  )
}

export default AppCalendar
