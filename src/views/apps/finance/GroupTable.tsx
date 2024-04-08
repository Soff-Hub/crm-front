import { Box, Card, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface GroupStatsType {
    id: number
    name: string
    student_count: number
    plan: number
    income: number
    distance: number
}

const NavigationMenu = styled(Paper)(({ theme }) => ({
    overflowY: 'auto',
    display: 'flex',

    '&::-webkit-scrollbar': {
        width: 6
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: 10,
        background: hexToRGBA('#72E128', theme.palette.mode === 'light' ? 0.4 : 0.2),
    },
    '&::-webkit-scrollbar-track': {
        borderRadius: 10,
        background: 'transparent'
    },
    '& .MuiList-root': {
        paddingTop: 0,
        paddingBottom: 0
    },
    '& .menu-group.Mui-selected': {
        borderRadius: 0,
        backgroundColor: theme.palette.action.hover
    }
}))

const Div = styled(Box)(({ theme }) => ({
    padding: '10px',
    background: hexToRGBA('#72E128', theme.palette.mode === 'light' ? 0.4 : 0.2),
}))



export default function GroupFinanceTable() {


    const data: GroupStatsType = {
        id: 1,
        name: "Frontend 001",
        student_count: 12,
        plan: 6500000,
        income: 5700000,
        distance: 200000
    }

    return (
        <Card sx={{ display: 'flex', p: '15px', gap: '5px' }}>
            <Box className='header' sx={{ minWidth: '150px' }}>
                <Div sx={{ mb: '5px' }}>2024</Div>
                <Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }} >Nomi / Guruh</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }} >O'quvchi soni</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }} >Reja</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }} >Tushum</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }} >Farq</Box>
                </Box>
            </Box>
            <Box className='header' sx={{ minWidth: '150px' }}>
                <Div sx={{ mb: '5px' }}>Umumiy</Div>
                <Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>20 ta guruh</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>120 ta o'quvchi</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>{formatCurrency(30000000)}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>{formatCurrency(27000000)}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>{formatCurrency(1500000)}</Box>
                </Box>
            </Box>
            <Box className='body' sx={{ flexGrow: 1 }}>
                <Div sx={{ textAlign: 'center', mb: '5px' }}>Mart</Div>
                <NavigationMenu sx={{ display: 'flex', maxWidth: '1050px', overflowX: 'auto' }}>
                    {
                        Array(20).fill(data).map((group: GroupStatsType) => (
                            <Box sx={{ minWidth: '150px' }}>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography>
                                        {group.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography>
                                        {group.student_count}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography>
                                        {formatCurrency(group.plan)}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography>
                                        {formatCurrency(group.income)}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography>
                                        {formatCurrency(group.distance)}
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    }
                </NavigationMenu>
            </Box>
        </Card>
    )
}
