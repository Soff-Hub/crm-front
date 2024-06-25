import { Box } from '@mui/material';
import TimeSlot from './TimeSlot';
import ExcludedTimeSlot from './ExcludedTimeSlot';
import LessonSlot from './LessonSlot';
import { useAppSelector } from 'src/store';
import generateTimeSlots from 'src/@core/utils/generate-time-slots';
import getMonthName from 'src/@core/utils/gwt-month-name';
import { useRouter } from 'next/router';
import { ILessonResponse, ILessonType } from 'src/types/apps/dashboardTypes';

const DashboardTable = ({ lesson }: { lesson: ILessonResponse }) => {
    const { workTime, exclude_time } = useAppSelector((state) => state.groups)
    const { push } = useRouter()

    return (
        <Box sx={{ display: 'flex', position: 'relative', marginLeft: '25px' }}>
            {workTime?.map((el) => (
                <TimeSlot key={el} width={50} />
            ))}
            {Object.entries(exclude_time).map(([start, end]) => {
                const slots = generateTimeSlots(start, end as string);
                console.log(slots);

                const width = (slots.length - 1) * 50;
                const leftPosition = workTime.findIndex((el) => el === slots[0]) * 50;

                return (
                    <ExcludedTimeSlot
                        key={start}
                        end={end as string}
                        start={start}
                        width={width}
                        leftPosition={leftPosition}
                    />
                );
            })}

            {lesson?.lessons?.map((item: ILessonType) => {
                const slots = generateTimeSlots(item.start_at, item.end_at);
                const width = (slots.length - 1) * 50;
                const leftPosition = workTime.findIndex((el) => el === slots[0]) * 50;

                return (
                    <LessonSlot
                        key={item.id}
                        item={item}
                        width={width}
                        leftPosition={leftPosition}
                        onClick={() =>
                            push(`/groups/view/security?id=${item.id}&month=${getMonthName(null)}`)
                        }
                    />
                );
            })}
        </Box>
    );
}
export default DashboardTable;
