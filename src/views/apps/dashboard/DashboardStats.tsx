// @ts-nocheck
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical';
import IconifyIcon from 'src/@core/components/icon';
import Box from '@mui/material/Box';
import { useAppSelector } from 'src/store';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import SubLoader from '../loaders/SubLoader';

export default function DashboardStats() {
    const { stats, statsData, isStatsLoading } = useAppSelector(state => state.dashboard)
    const { isMobile, isTablet } = useResponsive()
    const { push } = useRouter()
    const { t } = useTranslation()

    return (
        isStatsLoading ? <SubLoader /> : stats ? (
            <Box sx={{ display: 'grid', gap: '10px', mb: 5, gridTemplateColumns: `repeat(${isMobile ? 3 : isTablet ? 4 : 6}, 1fr)` }} >
                {
                    statsData.map((_, index) => (
                        <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => push(_.link)}>
                            <CardStatsVertical title={stats?.[_.key]} stats={t(_.title)} icon={<IconifyIcon fontSize={"4rem"} icon={_.icon} />} color={_.color} />
                        </Box>
                    ))
                }
            </Box>
        ) : null
    )
}
