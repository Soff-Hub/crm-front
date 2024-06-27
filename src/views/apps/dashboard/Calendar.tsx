import CalendarWrapper from "src/@core/styles/libs/fullcalendar"
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useAppDispatch, useAppSelector } from "src/store"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { useSettings } from "src/@core/hooks/useSettings"
import { Theme } from '@mui/material/styles'
import useResponsive from "src/@core/hooks/useResponsive"
import CalendarTabs from './CalendarTabs'
import LessonsTable from './LessonsTable'
import WeekDaysDialog from './WeekDaysDialog'
import { fetchLessons, updateWeeks } from 'src/store/apps/dashboard'

export default function Calendar() {
    const dispatch = useAppDispatch()

    const { settings } = useSettings()
    const { skin } = settings
    const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

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
                <CalendarTabs handleUpdateWeekDays={handleUpdateWeekDays} />
                <LessonsTable />
            </Box>
            <WeekDaysDialog handleUpdateWeekDays={handleUpdateWeekDays} />
        </CalendarWrapper>
    )
}
