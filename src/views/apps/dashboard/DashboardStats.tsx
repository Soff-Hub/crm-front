//@ts-nocheck
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical';
import IconifyIcon from 'src/@core/components/icon';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'src/store';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { updateStudentParams } from 'src/store/apps/students';

export default function DashboardStats() {
    const { stats, statsData, isStatsLoading } = useAppSelector(state => state.dashboard)
    const dispatch = useAppDispatch()
    const { isMobile, isTablet } = useResponsive()
    const { push } = useRouter()
    const { t } = useTranslation()

    function click(link: string) {
        if (link === 'debtor_users') {
            dispatch(updateStudentParams({ is_debtor: true, last_payment: '' }))
            return push('/students')
        } else if (link === 'last_payment') {
            dispatch(updateStudentParams({ is_debtor: '', last_payment: true }))
            return push('/students')
        } else if (link === 'group_status') {
            dispatch(updateStudentParams({ group_status: 'new' }))
            return push('/students')
        } else if (link === 'active_students') {
            dispatch(updateStudentParams({ group_status: 'active' }))
            return push('/students')
        }

        push(link)
    }

    return (
        <Box sx={{ display: 'grid', gap: '10px', mb: 5, gridTemplateColumns: `repeat(${isMobile ? 3 : isTablet ? 4 : 8}, 1fr)` }} >
            {
                isStatsLoading ? statsData.map((_, index) => (
                    <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => click(_.link)}>
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
                    <Box key={index} className='' sx={{ cursor: 'pointer' }} onClick={() => click(_.link)}>
                        <CardStatsVertical title={stats?.[_.key]} stats={t(_.title)} icon={<IconifyIcon fontSize={"4rem"} icon={_.icon} />} color={_.color} />
                    </Box>
                )) : null
            }
        </Box>
    )
}
