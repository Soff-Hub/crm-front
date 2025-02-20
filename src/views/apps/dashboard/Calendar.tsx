import CalendarWrapper from "src/@core/styles/libs/fullcalendar";
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAppDispatch, useAppSelector } from "src/store";
import { useSettings } from "src/@core/hooks/useSettings";
import { Theme } from '@mui/material/styles';
import CalendarTabs from './CalendarTabs';
import LessonsTable from './LessonsTable';
import WeekDaysDialog from './WeekDaysDialog';
import { fetchLessons, updateWeeks } from 'src/store/apps/dashboard';
import Skeleton from '@mui/material/Skeleton';


export default function Calendar() {
    const dispatch = useAppDispatch()

    const { settings } = useSettings()
    const { skin } = settings
    const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

    const { isLessonLoading,interval } = useAppSelector(state => state.dashboard)

    const handleUpdateWeekDays = async (weekDays: string[]) => {
        await dispatch(fetchLessons({queryWeeks:weekDays,interval:interval}))
        dispatch(updateWeeks(weekDays))
    }

    return (
        <CalendarWrapper
            className='app-calendar'
            sx={{
                boxShadow: skin === 'bordered' ? 0 : 6,
                ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` }),
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
                }}
            >
                <CalendarTabs handleUpdateWeekDays={handleUpdateWeekDays} />
                {isLessonLoading ? <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '11px' }}>
                    {[1, 2, 3, 4].map((el, i) => (
                        <Skeleton
                            key={i}
                            sx={{ bgcolor: 'grey.200' }}
                            variant="rectangular"
                            width={'100%'}
                            height={el === 1 ? '20px' : '45px'}
                            animation="wave"
                        />
                    ))}
                </Box> : <LessonsTable />}
            </Box>
            <WeekDaysDialog handleUpdateWeekDays={handleUpdateWeekDays} />
        </CalendarWrapper>
    )
}
