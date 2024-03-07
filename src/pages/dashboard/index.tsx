// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { RootState } from 'src/store'
import { CalendarColors, CalendarFiltersType } from 'src/types/apps/calendarTypes'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import IconifyIcon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Actions
import { Checkbox, FormControlLabel, Typography } from '@mui/material'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import MyGroups from 'src/views/my-groups'
import useResponsive from 'src/@core/hooks/useResponsive'

// ** CalendarColors
const calendarsColor: CalendarColors = {
  "Toq kunlar": 'primary',
  'Juft kunlar': 'error',
  'Boshqa': 'warning',
}

const statsData: {
  icon: string,
  title: string,
  count: string,
  color: ThemeColor
}[] = [
    {
      icon: "mdi:user-check-outline",
      title: "Faol Lidlar",
      count: "42",
      color: 'success'
    },
    {
      icon: "arcticons:studentid",
      title: "Faol talabalar",
      count: "56",
      color: 'info'
    },
    {
      icon: "la:layer-group",
      title: "Guruhlar",
      count: "11",
      color: 'warning'
    },
    {
      icon: "material-symbols-light:warning-outline",
      title: "Qarzdor",
      count: "21",
      color: 'error'
    },
    {
      icon: "tabler:calendar-stats",
      title: "Sinov darsida",
      count: "14",
      color: 'primary'
    },
    {
      icon: "fa-solid:chalkboard-teacher",
      title: "O'qituvchilar",
      count: "7",
      color: 'success'
    },
  ]

const hourData: string[] = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '12:00',
  '13:30',
  '13:00',
  '14:30',
  '14:00',
  '15:30',
  '15:00',
  '16:30',
  '16:00',
  '17:30',
  '17:00',
  '18:30',
  '18:00',
  '19:30',
  '19:00',
  '20:30',
  '21:00',
]

const roomsData: {
  room_id: string;
  room_branch: string,
  room_number: string,
  lesson_duration: string[]
}[] = [
    {
      room_id: '1',
      room_branch: 'Novza',
      room_number: '1',
      lesson_duration: ['10:30', '11:00', '11:30', '12:00', '12:30']
    },
    {
      room_id: '2',
      room_branch: 'Novza',
      room_number: '2',
      lesson_duration: ['09:30', '10:00', '10:30', '11:00']
    }
  ]

const AppCalendar = () => {

  // ** Hooks
  const { settings } = useSettings()
  const store = useSelector((state: RootState) => state.calendar)
  const { user } = useContext(AuthContext)
  const { isMobile } = useResponsive()

  // ** Vars
  const { skin } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]: string[]) => {
      return (
        <FormControlLabel
          key={key}
          label={key}
          sx={{ mb: 0.5 }}
          control={
            <Checkbox
              color={value as ThemeColor}
              checked={store.selectedCalendars.includes(key as CalendarFiltersType)}
            />
          }
        />
      )
    })
    : null

  return user?.role === 'teacher' ? <MyGroups /> : (
    <>
      <Grid container spacing={6} className='mb-3'>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box className='row gy-4' >
                {
                  statsData.map((_, index) => (
                    <Box key={index} className='col-md-2 col-6'>
                      <CardStatsVertical title={_.count} stats={_.title} icon={<IconifyIcon fontSize={"4rem"} icon={_.icon} />} color={_.color} />
                    </Box>
                  ))
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
        }}
      >
        <Box
          sx={{
            px: 5,
            pt: 1,
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 'none',
            backgroundColor: 'background.paper',
            ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
          }}
        >
          <Box>
            {renderFilters}
          </Box>
          <Box sx={{ display: 'flex', width: '100%', paddingBottom: 3 }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #cfcccc', textAlign: 'center' }}><Typography>Dars Vaqtlari</Typography></td>
                  {
                    hourData.slice(0, 10).map(hour => <th key={hour} style={{ padding: '10px', border: '1px solid #cfcccc', textAlign: 'center' }}><Typography>{hour}</Typography></th>)
                  }
                </tr>
              </thead>
              <tbody>
                {
                  roomsData.map(room => (
                    <tr key={room.room_id}>
                      <td style={{ padding: '10px', border: '1px solid #cfcccc', textAlign: 'center' }}>{`${room.room_branch} / ${room.room_number}-xona`}</td>
                      {
                        hourData.slice(0, 10).map(hour => <td key={hour} style={{ padding: '10px', border: '1px solid #cfcccc', textAlign: 'center', backgroundColor: room.lesson_duration.includes(hour) ? 'orange' : '' }}></td>)
                      }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </Box>
        </Box>
      </CalendarWrapper>
    </>

  )
}

export default AppCalendar
