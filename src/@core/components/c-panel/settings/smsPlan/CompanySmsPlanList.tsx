import { Box, Button, Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import { useAppSelector } from 'src/store'
import IconifyIcon from '../../../icon'

type Props = {}

export default function CompanySmsPlanList({ }: Props) {
    const { tariffs, isGettingTariffs } = useAppSelector(state => state.cPanelSlice)
    const { t } = useTranslation()

    return (
        <Box sx={{ pb: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant='h6'>SMS tariflar</Typography>
                <Button variant='contained' color='primary'>SMS tarif qo'shish</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
                {isGettingTariffs ?
                    [1, 2, 3, 4].map((el, i) => (
                        <Box key={i} onClick={() => { }}>
                            <Skeleton
                                sx={{ bgcolor: 'gray.300' }}
                                variant="rectangular"
                                width={'100%'}
                                height={'150px'}
                                style={{ borderRadius: '10px' }}
                                animation="wave"
                            />
                        </Box>)) : tariffs.length ? tariffs.map(tariff => (
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minWidth: '150px' }}>
                                        <Typography variant='caption'>Bir oyga</Typography>
                                        <Typography color='green'>15 000 so'm</Typography>
                                        <Typography variant='body2' sx={{ color: 'orange' }}>500 ta sms</Typography>
                                        <Box>
                                            <Button size='small' color='error'>
                                                <IconifyIcon icon={'material-symbols-light:delete-outline'} />
                                            </Button>
                                            <Button size='small' color='primary'>
                                                <IconifyIcon icon={'material-symbols-light:edit-outline'} />
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )) : <EmptyContent />}

            </Box>
        </Box>
    )
}