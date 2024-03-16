import React from 'react'
import { Box, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

export default function AllSettings() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Typography sx={{ minWidth: '120px' }}>Tashkilot nomi:</Typography>
                <Typography>Soff Study</Typography>
                <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Typography sx={{ minWidth: '120px' }}>Filiallar:</Typography>
                <Typography>Novza, Bodomzor</Typography>
                <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Typography sx={{ minWidth: '120px' }}>Logo:</Typography>
                <img src='/images/soff-logo.png' width={120} />
                <IconifyIcon icon={'basil:edit-outline'} style={{ cursor: 'pointer' }} />
            </Box>
        </Box>
    )
}
