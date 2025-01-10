import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CustomAvatar from 'src/@core/components/mui/avatar';
import { CardStatsVerticalProps } from 'src/@core/components/card-statistics/types';
import useResponsive from 'src/@core/hooks/useResponsive';
import { formatCurrency } from 'src/@core/utils/format-currency';
import { Icon } from '@iconify/react';
import { updateEyeVisible } from 'src/store/apps/dashboard';
import { useAppDispatch, useAppSelector } from 'src/store';

const CardStatsVertical = (props: CardStatsVerticalProps) => {

  const { eyeVisible} = useAppSelector(state => state.dashboard)
  const handleEyeChange = (event: React.MouseEvent) => {
  
    const dispatch = useAppDispatch()
    event.stopPropagation(); // Prevents the event from propagating to parent elements
    dispatch(updateEyeVisible(!eyeVisible))
  };

  const { title, color, icon, stats, data_key } = props;
  const { isMobile, isTablet } = useResponsive();

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '10px 0px !important' : '15px 10px !important',
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mb: 2 }}>
          <CustomAvatar
            sx={{ width: isMobile ? '30px' : '30px', height: isMobile ? '30px' : '30px', p: 1 }}
            className="text-center fs-2"
            skin="light"
            variant="rounded"
            color={color}
          >
            {icon}
          </CustomAvatar>
        </Box>
        <Typography
          className="text-center"
          variant="caption"
          sx={{ mb: 2, fontSize: isMobile ? '12px !important' : isTablet ? '14px !important' : '16px !important' }}
        >
          {stats}
        </Typography>
          {/* <Typography className="text-center" variant="h4" sx={{ mb: 0, fontSize: '16px !important' }}>
            {formatCurrency(title)}
          </Typography> */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            {/* <Icon
              icon={!eyeVisible ? 'mdi:eye-off' : 'mdi:eye'}
              style={{
                fontSize: '20px',
                cursor: 'pointer',
              }}
              // onClick={handleEyeChange}
            /> */}
            <Typography className="text-center" variant="h4" sx={{ mb: 0, fontSize: '16px !important' }}>
              {eyeVisible ? formatCurrency(title) : '****'}
            </Typography>
          </Box>
      </CardContent>
    </Card>
  );
};

export default CardStatsVertical;
