import { Box, Card, Checkbox, Paper, Radio, Typography, styled } from '@mui/material'
import React from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface GroupStatsType {
    id: number
    name: string
    student_count: number
    plan: number
    income: number
}


interface ExpensesType {
    id: Number
    description: string
    amount: number
}

const NavigationMenu = styled(Paper)(({ theme }) => ({
    overflowY: 'auto',
    display: 'flex',

    '&::-webkit-scrollbar': {
        width: 6
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: 10,
        background: hexToRGBA('#FF4D49', theme.palette.mode === 'light' ? 0.4 : 0.2),
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
    background: hexToRGBA('#FF4D49', theme.palette.mode === 'light' ? 0.4 : 0.2),
}))



export default function GroupFinanceTable() {


    const data: GroupStatsType = {
        id: 1,
        name: "Frontend 001",
        student_count: 12,
        plan: 6500000,
        income: 5700000
    }

    const expenses: ExpensesType = {
        id: 1,
        amount: 300000,
        description: "Ofis uchun 2ta monitor"
    }

    return (
        <Card>
            <Box sx={{ padding: '5px 0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Radio name='year_month' checked={true} />
                        <Typography>Yillik</Typography>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Radio name='year_month' />
                        <Typography>Oylik</Typography>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <Checkbox name='comments' checked={false} />
                        <Typography>Izohlar</Typography>
                    </label>

                </Box>
            </Box>
            <Card sx={{ display: 'flex', p: '15px', gap: '5px' }}>
                
            </Card>
        </Card>
    )
}
