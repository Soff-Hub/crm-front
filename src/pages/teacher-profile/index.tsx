// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** React Imports

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'

import IconifyIcon from 'src/@core/components/icon'

// ** Actions
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import MyGroups from 'src/views/my-groups'
import api from 'src/@core/utils/api'
import { useRouter } from 'next/router'
import useResponsive from 'src/@core/hooks/useResponsive'
import generateTimeSlots from 'src/@core/utils/generate-time-slots'
import { TranslateWeekName } from '../groups'
import { hourFormatter } from 'src/@core/utils/hourFormatter'
import { useTranslation } from 'react-i18next'
import getMonthName from 'src/@core/utils/gwt-month-name'
import { useAppSelector } from 'src/store'





const AppCalendar = () => {
    const currentWeek: string = `${new Date()}`.split(' ')[0].toLocaleLowerCase()

    // ** Hooks
    const { settings } = useSettings()
    const { user } = useContext(AuthContext)
    const { push, pathname, query } = useRouter()
    const { isMobile, isTablet } = useResponsive()
    const [tabValue, setTabValue] = useState<string>(currentWeek === 'mon' || currentWeek === 'wed' || currentWeek === 'fri' ? '2' : '1')
    const [open, setOpen] = useState<null | 'week'>(null)
    const [weeks, setWeeks] = useState<any>(query?.weeks ? (typeof query.weeks === 'string' ? query.weeks.split(',') : query.weeks) : currentWeek === 'mon' || currentWeek === 'wed' || currentWeek === 'fri' ? ['monday', 'wednesday', 'friday'] : ['tuesday', 'thursday', 'saturday']);

    const { companyInfo } = useAppSelector((state: any) => state.user)
    const startTime = companyInfo?.work_start_time
    const endTime = companyInfo?.work_end_time

    const { t } = useTranslation()


    // ** Vars
    const { skin } = settings
    const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

    const [events, setEvents] = useState<any>([])

    async function getLessons() {
        const resp = await api.get(`common/dashboard/?day_of_week=${query?.weeks || weeks}`)
        setEvents(resp.data.room_list)
    }

    useEffect(() => {
        getLessons()
    }, [weeks, query])

    return (
        <>
            <CalendarWrapper
                className='app-calendar'
                sx={{
                    boxShadow: skin === 'bordered' ? 0 : 6,
                    ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` }),
                    marginBottom: '30px'
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
                                <Tab value='1' label={t('Juft kunlar')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => {
                                    push({
                                        pathname,
                                        query: {
                                            weeks: ['tuesday', 'thursday', 'saturday']
                                        }
                                    })
                                }} />
                                <Tab value='2' label={t('Toq kunlar')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => {
                                    push({
                                        pathname,
                                        query: {
                                            weeks: ['monday', 'wednesday', 'friday']
                                        }
                                    })
                                }} />
                                <Tab value='4' label={t('Boshqa')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => setOpen('week')} />
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
                                        {t("Xonalar")} {" / "}{t('Soat')}
                                    </td>
                                    <td>
                                        <Box sx={{ display: 'flex', }}>
                                            {generateTimeSlots(startTime, endTime).map((el: string) => <Box key={el} sx={{ width: '50px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{el}</Box>)}
                                        </Box>
                                    </td>
                                </tr>
                                {
                                    events.map((lesson: any) => (
                                        <tr style={{ borderBottom: '1px solid #c3cccc65' }} key={lesson.room_id}>
                                            <td style={{ minWidth: '100px', fontSize: '12px' }}>
                                                {lesson.room_name}
                                            </td>
                                            <td>
                                                <Box sx={{ display: 'flex', position: 'relative', marginLeft: '25px' }}>
                                                    {generateTimeSlots(startTime, endTime).map((el: string) => <Box key={el} sx={{ width: '50px', height: '45px', borderLeft: '1px solid #c3cccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></Box>)}
                                                    {
                                                        lesson.lessons.map((item: any) => (
                                                            <Box onClick={() => push(`/groups/view/security?id=${item.id}&month=${getMonthName(null)}`)} key={item.id} sx={{ width: `${generateTimeSlots(item.start_at, item.end_at).length * 50}px`, height: '45px', position: 'absolute', padding: '5px', left: `${generateTimeSlots(startTime, endTime).findIndex(el => el === generateTimeSlots(item.start_at, item.end_at)[0]) * 50}px` }}>
                                                                <Box sx={{ borderRadius: '8px', backgroundColor: `${item.color}`, width: '100%', height: '100%', cursor: 'pointer', padding: '2px 6px', overflow: 'hidden' }}>
                                                                    <Typography sx={{ color: 'black', fontSize: '10px' }}>{hourFormatter(item.start_at)} - {hourFormatter(item.end_at)} / {item.name}</Typography>
                                                                    <Typography sx={{ color: 'black', fontSize: '10px' }}>{item.teacher_name}</Typography>
                                                                </Box>
                                                            </Box>
                                                        ))
                                                    }
                                                </Box>
                                            </td>
                                        </tr>
                                    ))
                                }
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
            <MyGroups />
        </>
    )
}

export default AppCalendar
