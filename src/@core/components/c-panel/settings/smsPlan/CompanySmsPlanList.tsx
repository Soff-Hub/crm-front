import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import IconifyIcon from '../../../icon'

type Props = {}

export default function CompanySmsPlanList({ }: Props) {
    return (
        <Box sx={{ borderBottom: "2px solid #d1d5db", pb: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant='h6'>SMS tariflar</Typography>
                <Button variant='contained' color='primary'>SMS tarif qo'shish</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
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
            </Box>
        </Box>
    )
}