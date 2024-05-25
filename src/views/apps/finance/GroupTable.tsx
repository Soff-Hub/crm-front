import { Box, Card, Paper, TextField, Typography, styled } from '@mui/material'
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



export default function GroupFinanceTable({ data, updateData }: any) {

    return (
        <Card sx={{ display: 'flex', p: '15px', gap: '5px' }}>
            <Box className='header' sx={{ minWidth: '150px' }}>
                <Div sx={{ mb: '5px' }}>Nomi</Div>
                <Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >Nomi / Guruh</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >O'quvchi soni</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >To'landi</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >Reja</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >To'lanishi kerak</Box>
                </Box>
            </Box>
            <Box className='header' sx={{ minWidth: '150px' }}>
                <Div sx={{ mb: '5px' }}>Umumiy</Div>
                <Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{data?.result?.length} ta guruh</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{data?.students_count} ta o'quvchi</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{formatCurrency(data.total_payments)}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{formatCurrency(data?.result.reduce((acc: number, curr: any) => acc + curr.planed_payment, 0))}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{
                        formatCurrency(data?.result.map((el: any) => el?.payment_difference > 0 ? el.payment_difference : el.payment_difference * -1).reduce((acc: number, curr: any) => acc + curr, 0))
                    }</Box>
                </Box>
            </Box>
            <Box className='body' sx={{ flexGrow: 1 }}>
                <Div sx={{ textAlign: 'center', mb: '5px', padding: '2px' }}>
                    <TextField defaultValue={`${new Date().getFullYear()}-${Number(new Date().getMonth()) + 1 < 10 ? "0" + (1 + new Date().getMonth()) : new Date().getMonth() + 1}`} style={{ border: 'none' }} size='small' type='month' onChange={(e) => updateData(e.target.value)} />
                </Div>
                <NavigationMenu sx={{ display: 'flex', maxWidth: '1050px', overflowX: 'auto' }}>
                    {
                        data?.result.map((group: any, i: number) => (
                            <Box sx={{ minWidth: '160px' }} key={i}>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography fontSize={13}>
                                        {group.group}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography fontSize={13}>
                                        {group.student_count}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography fontSize={13}>
                                        {formatCurrency(group.total_payment)}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography fontSize={13}>
                                        {formatCurrency(group.planed_payment)}
                                    </Typography>
                                </Box>
                                <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography fontSize={13}>
                                        {group.payment_difference > 0 ? formatCurrency(group.payment_difference) : formatCurrency(-1 * group.payment_difference)}
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
