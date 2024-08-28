import { Box, Card, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from 'src/@core/utils/format-currency';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import 'rsuite/dist/rsuite.min.css';
import { styled } from '@mui/material/styles';

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

export function formatDateToMMYYYY(dateString: any) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}`;
}

export default function GroupFinanceTable({ data }: any) {
    const { t } = useTranslation()

    return (
        <Card sx={{ display: 'flex', p: '15px', gap: '5px' }}>
            <Box className='header' sx={{ width: '170px' }}>
                <Div sx={{ mb: '5px' }}>{t('Nomi')}</Div>
                <Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >{t('Guruhlar')}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >{t("O'quvchilar soni")}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >{t("To'landi")}</Box>
                    {/* <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >{t('Reja')}</Box> */}
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }} >{t("To'lanishi kerak")}</Box>
                </Box>
            </Box>
            <Box className='header' sx={{ width: '150px' }}>
                <Div sx={{ mb: '5px' }}>{t('Umumiy')}</Div>
                <Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{data?.result?.length}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{data?.students_count}</Box>
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{formatCurrency(data.total_payments)}</Box>
                    {/* <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{formatCurrency(data?.result.reduce((acc: number, curr: any) => acc + curr.planed_payment, 0))}</Box> */}
                    <Box sx={{ border: '1px solid #c3cccc', p: '5px', fontSize: 13 }}>{
                        formatCurrency(data?.result?.map((el: any) => el?.payment_difference > 0 ? el.payment_difference : el.payment_difference * -1).reduce((acc: number, curr: any) => acc + curr, 0))
                    }</Box>
                </Box>
            </Box>
            <Box className='body' sx={{ width: "calc(100% - 320px)" }}>
                <Div sx={{ textAlign: 'end', mb: '5px', padding: '4px', borderRadius: '0', height: "44px" }}></Div>
                <NavigationMenu sx={{ display: 'flex', width: '100%', overflowX: 'auto' }}>
                    {
                        data?.result?.map((group: any, i: number) => (
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
                                {/* <Box sx={{ border: '1px solid #c3cccc', p: '5px' }}>
                                    <Typography fontSize={13}>
                                        {formatCurrency(group.planed_payment)}
                                    </Typography>
                                </Box> */}
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
