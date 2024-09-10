import { Box, Typography } from '@mui/material';
import { hourFormatter } from 'src/@core/utils/hourFormatter';
import { ILessonType } from 'src/types/apps/dashboardTypes';

interface ILessonSlot {
    item: ILessonType,
    width: number,
    leftPosition: number,
    onClick: () => void
}

const LessonSlot = ({ item, width, leftPosition, onClick }: ILessonSlot) => (
    <Box
        onClick={onClick}
        sx={{
            width: `${width}px`,
            height: '45px',
            position: 'absolute',
            padding: '5px',
            left: `${leftPosition}px`,
        }}
    >
        <Box sx={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px", borderRadius: '8px', backgroundColor: item.color, width: '100%', height: '100%', cursor: 'pointer', padding: '2px 6px', overflow: 'hidden' }}>
            <Typography sx={{ color: 'black', fontSize: '10px' }}>
                {hourFormatter(item.start_at)} - {hourFormatter(item.end_at)} / {item.name}
            </Typography>
            <Typography sx={{ color: 'black', fontSize: '10px' }}>
                {item.teacher_name}
            </Typography>
        </Box>
    </Box>
);

export default LessonSlot;
