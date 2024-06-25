import { Box, Typography } from '@mui/material';
import { hourFormatter } from 'src/@core/utils/hourFormatter';

interface IExcludedTimeSlot {
    width: number,
    leftPosition: number
    start: string
    end: string
}

const ExcludedTimeSlot = ({ width, leftPosition, start, end }: IExcludedTimeSlot) => (
    <Box
        sx={{
            width: `${width}px`,
            height: '45px',
            position: 'absolute',
            padding: '5px',
            left: `${leftPosition}px`
        }}
    >
        <Box
            sx={{
                borderRadius: '8px',
                backgroundColor: `#fecaca`,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                padding: '2px 6px',
                overflow: 'hidden'
            }}
        >
            <Typography sx={{ color: 'black', fontSize: '10px' }}>
                {hourFormatter(start)} - {hourFormatter(end)}
            </Typography>
            <Typography sx={{ color: 'black', fontSize: '10px' }}>
                O'qituvchi band
            </Typography>
        </Box>
    </Box>
);

export default ExcludedTimeSlot;
