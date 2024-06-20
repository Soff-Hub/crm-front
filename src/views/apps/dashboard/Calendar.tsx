import CalendarWrapper from "src/@core/styles/libs/fullcalendar"
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import useMediaQuery from '@mui/material/useMediaQuery'
import IconifyIcon from 'src/@core/components/icon'
import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Typography,
} from '@mui/material'
import generateTimeSlots from 'src/@core/utils/generate-time-slots'
import { hourFormatter } from 'src/@core/utils/hourFormatter'
import getMonthName from 'src/@core/utils/gwt-month-name'
import { fetchLessons, handleChangeWeeks, handleOpen, handleTabValue, updateWeeks } from 'src/store/apps/dashboard'
import { ILessonResponse } from 'src/types/apps/dashboardTypes'
import { useAppDispatch, useAppSelector } from "src/store"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { useSettings } from "src/@core/hooks/useSettings"
import { Theme } from '@mui/material/styles'
import { TranslateWeekName } from "src/pages/groups"
import useResponsive from "src/@core/hooks/useResponsive"
import SubLoader from "../loaders/SubLoader"

export default function Calendar() {
    const { events, tabValue, weekDays, isLessonLoading, open, weeks } = useAppSelector((state) => state.dashboard)
    const { companyInfo } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()

    const { t } = useTranslation()
    const { push, pathname } = useRouter()
    const startTime = companyInfo?.work_start_time
    const endTime = companyInfo?.work_end_time
    const { settings } = useSettings()
    const { skin } = settings
    const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
    const { isMobile } = useResponsive()

    const handleUpdateWeekDays = async (weekDays: string[]) => {
        await dispatch(fetchLessons(weekDays))
        dispatch(updateWeeks(weekDays))
    }

    return (
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
                        <TabList onChange={(event, value: string) => dispatch(handleTabValue(value))} aria-label='centered tabs example'>
                            <Tab value='1' label={t('Juft kunlar')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => handleUpdateWeekDays(['tuesday', 'thursday', 'saturday'])} />
                            <Tab value='2' label={t('Toq kunlar')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => handleUpdateWeekDays(['monday', 'wednesday', 'friday'])} />
                            <Tab value='4' label={t('Boshqa')} sx={{ p: '0 !important', fontSize: '9px' }} onClick={() => dispatch(handleOpen("week"))} />
                        </TabList>
                    </TabContext>
                </Box>
                <Box sx={{
                    padding: '0 15px',
                    maxWidth: '100%',
                    overflowX: 'auto'
                }}>
                    <table border={0} style={{ width: "100%" }}>
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
                            {isLessonLoading ?
                                <tr>
                                    <td colSpan={generateTimeSlots(startTime, endTime).length + 1}>
                                        <SubLoader />
                                    </td>
                                </tr> :
                                events?.map((lesson: ILessonResponse) => (
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
            <Dialog open={open === 'week'} onClose={() => dispatch(handleOpen(null))}>
                <DialogTitle sx={{ minWidth: isMobile ? '' : '300px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Hafta kunlari
                    <IconifyIcon icon={'ic:baseline-close'} onClick={() => dispatch(handleOpen(null))} />
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            weekDays.map(week => (
                                <FormControl key={week}>
                                    <label style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'flex-end' }}>
                                        <span>{TranslateWeekName[week]}</span>
                                        <Checkbox checked={weeks?.includes(week)} onClick={() => dispatch(handleChangeWeeks(week))} />
                                    </label>
                                </FormControl>
                            ))
                        }
                        <Button
                            variant='contained'
                            onClick={() => {
                                handleUpdateWeekDays(weeks)
                                dispatch(handleOpen(null))
                            }}
                        >Ko'rish</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </CalendarWrapper >
    )
}
