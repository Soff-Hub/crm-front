import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import IconifyIcon from '../../icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useAppSelector } from 'src/store'
import EmptyContent from '../../empty-content'

type Props = {}

export default function CompanySmsHistory({ }: Props) {
    const { sms, isGettingSMS } = useAppSelector(state => state.companyDetails)
    const { isMobile } = useResponsive()

    return (
        <Box sx={{ display: 'flex', gap: '15px', mt: 3, flexWrap: 'no-wrap', justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: 'column', width: "300px", }}>
            <Typography sx={{ fontSize: '20px' }}>{"Xabarlar tarixi"}</Typography>
            {isGettingSMS ? <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Skeleton animation="wave" height={100} variant="rounded" />
                <Skeleton animation="wave" height={100} variant="rounded" />
            </Box> :
                <Box sx={{ maxHeight: '400px', display: "flex", flexDirection: "column", gap: "10px", overflow: "auto" }}>
                    {sms?.length > 0 ? sms?.map((item) => (
                        <Box key={item.id} style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
                            <Card sx={{ width: '100%', padding: 0 }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', p: '6px', flexDirection: 'column' }}>
                                    <Typography sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <IconifyIcon icon={'lets-icons:message-fill'} color='orange' />
                                        <span>{item.created_at.split('-').reverse().join('/')}</span>
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '5px' }}>
                                        <Typography sx={{ fontSize: '12px', fontStyle: 'italic' }}>{item.message}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    )) : <EmptyContent />}
                </Box>}
        </Box >
    )
}