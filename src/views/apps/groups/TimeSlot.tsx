import { Box } from '@mui/material';

const TimeSlot = ({ width }: { width: number }) => (
    <Box
        sx={{
            width: `${width}px`,
            height: '45px',
            borderLeft: '1px solid #c3cccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
    />
);

export default TimeSlot;
