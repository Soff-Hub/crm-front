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
import { Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import MyGroups from 'src/views/my-groups'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import api from 'src/@core/utils/api'
import { useRouter } from 'next/router'
import getMonthName from 'src/@core/utils/gwt-month-name'
import useResponsive from 'src/@core/hooks/useResponsive'

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
const endTime = '22:00';

const localizer = momentLocalizer(moment)

const AppCalendar = () => {

  // ** Hooks
  const { settings } = useSettings()
  const { user } = useContext(AuthContext)
  const { push } = useRouter()
  const { isMobile, isTablet } = useResponsive()
  const [stats, setStats] = useState<any>({})

  // ** Vars
  const { skin } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const [events, setEvents] = useState<any>([])
  const [view, setView] = useState<'day' | 'week'>('day')

  const eventStyleGetter = (event: any, start: any, end: any, isSelected: any) => {
    // Eventning fonga rangini belgilash
    const backgroundColor = event.index === 1 ? 'rgb(114, 225, 40)' : event.index === 1 ? 'rgb(38, 198, 249)' : event.index == 2 ? 'rgb(253, 181, 40)' : event.index === 3 ? 'rgb(255, 77, 73)' : event.index === 4 ? 'rgb(109, 120, 141)' : event.index === 5 ? 'rgb(102, 16, 242)' : 'rgb(255, 193, 7)'

    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      width: '20% !important',
    };
    return {
      style,
    };
  };

  moment.locale('uz', {
    week: {
      dow: 0,
    },
    months: [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentabr',
      'Oktabr',
      'Noyabr',
      'Dekabr',
    ],
    weekdays: [
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
      'Yakshanba',
    ],
    weekdaysShort: [
      'Dush',
      'Se',
      'Chor',
      'Pay',
      'Ju',
      'Sha',
      'Yak',
    ]
  })

  async function getStats() {
    const resp = await api.get('common/dashboard/statistic-list/')
    setStats(resp.data);
  }

  async function getLessons() {
    setEvents([])
    const resp = await api.get('common/dashboard/group-list/')
    Object.values(resp.data).map((el: any) => {
      return setEvents((c: any[]) => ([...c,
      ...el.map((item: any) => ({
        id: item.group_id,
        index: Math.floor(Math.random() * 6) + 1,
        title: (
          <Box>
            <Typography sx={{ color: 'white', fontSize: '11px' }}>{item.room}</Typography>
            <Typography sx={{ color: 'white', fontSize: '11px' }}>{item.start_at.split(' ')[1]} - {item.end_at.split(' ')[1]}</Typography>
            <Typography sx={{ color: 'white', fontSize: '11px' }}>{item.group_name}</Typography>
            {/* <Typography sx={{ color: 'white', fontSize: '11px' }}>{item.teacher}</Typography> */}
          </Box>
        ),
        start: new Date(item.start_at),
        end: new Date(item.end_at)
      }))]))
    })
  }

  useEffect(() => {
    getStats()
    getLessons()
  }, [])

  return user?.role === 'teacher' ? <MyGroups /> : (
    <>
      {/* <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: bigMobile ? 'flex-start' : isMobile ? 'center' : 'flex-start', mb: 3 }} >
        {
          statsData.map((_, index) => (
            <Box key={index} className=''>
              <CardStatsVertical title={stats?.[_.key]} stats={_.title} icon={<IconifyIcon fontSize={"4rem"} icon={_.icon} />} color={_.color} />
            </Box>
          ))
        }
      </Box> */}
      <Box sx={{ display: 'grid', gap: '10px', mb: 5, gridTemplateColumns: `repeat(${isMobile ? 3 : isTablet ? 4 : 8}, 1fr)` }} >
        {
          statsData.map((_, index) => (
            <Box key={index} className=''>
              <CardStatsVertical title={stats?.[_.key]} stats={_.title} icon={<IconifyIcon fontSize={"4rem"} icon={_.icon} />} color={_.color} />
            </Box>
          ))
        }
      </Box>
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
            maxWidth: '100%',
            overflowX: 'scroll'
          }}
        >
          <Calendar
            localizer={localizer}
            startAccessor="start"
            messages={{
              week: 'Hafta',
              day: 'Kun',
              month: 'Oy',
              today: "Bugun",
              date: 'Sana',
              time: 'Vaqt',
              event: 'Event',
              allDay: 'Kun bo\'yi',
            }}
            views={['day', 'week']}
            defaultView='day'
            endAccessor="end"
            events={events}
            min={new Date(new Date().setHours(9, 0))}
            max={new Date(new Date().setHours(22, 1))}
            formats={{
              timeGutterFormat: 'H:mm'
            }}
            style={{ minWidth: '1200px' }}
            onView={(e: any) => setView(e)}
            eventPropGetter={eventStyleGetter}
            dayLayoutAlgorithm="no-overlap"
            onSelectEvent={(e) => push(`/groups/view/security?id=${e.id}&moonth=${getMonthName(null)}`)}
          />
        </Box>
      </CalendarWrapper >
    </>

  )
}

export default AppCalendar
