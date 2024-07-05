//@ts-nocheck
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical';
import IconifyIcon from 'src/@core/components/icon';
import Box from '@mui/material/Box';
import { useAppSelector } from 'src/store';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';

export default function DashboardStats() {
    const { stats, statsData, isStatsLoading } = useAppSelector(state => state.dashboard)
    const { isMobile, isTablet } = useResponsive()
    const { push } = useRouter()
    const { t } = useTranslation()

    return (
        <Box sx={{ display: 'grid', gap: '10px', mb: 5, gridTemplateColumns: `repeat(${isMobile ? 3 : isTablet ? 4 : 6}, 1fr)` }} >
            {
                isStatsLoading ? statsData.map((_, index) => (
                    <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => push(_.link)}>
                        <Skeleton
                            sx={{ bgcolor: 'grey.300' }}
                            variant="rectangular"
                            width={'100%'}
                            height={'140px'}
                            style={{ borderRadius: '10px' }}
                            animation="wave"
                        />
                    </Box>
                )) : ''
            }
            {
                stats && !isStatsLoading ? statsData.map((_, index) => (
                    <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => push(_.link)}>
                        <CardStatsVertical title={stats?.[_.key]} stats={t(_.title)} icon={<IconifyIcon fontSize={"4rem"} icon={_.icon} />} color={_.color} />
                    </Box>
                )) : null
            }
        </Box>
    )
}
