// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Type Import
import { CardStatsType } from 'src/@fake-db/types'

// ** Demo Components Imports
import CardStatisticsHorizontal from 'src/views/ui/cards/statistics/CardStatisticsHorizontal'
import CardStatisticsLiveVisitors from 'src/views/ui/cards/statistics/CardStatisticsLiveVisitors'
import CardStatisticsVertical from 'src/views/ui/cards/statistics/CardStatisticsVertical'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import GroupFinanceTable from 'src/views/apps/finance/GroupTable'
import { formatCurrency } from 'src/@core/utils/format-currency'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { forwardRef, useState } from 'react'
import { addDays, format } from 'date-fns'
import { useTranslation } from 'react-i18next'


type DateType = Date

interface PickerProps {
    label?: string;
    end: Date | number;
    start: Date | number;
}


const CardStatistics = () => {

    const { push } = useRouter()
    const { t } = useTranslation()

    const [startDateRange, setStartDateRange] = useState<DateType>(new Date());
    const [endDateRange, setEndDateRange] = useState<DateType>(addDays(new Date(), 45));
    const [nameVal, setNameVal] = useState<string>('');
    const [open, setOpen] = useState<'create' | null>(null);


    const handleOnChangeRange = (dates: any) => {
        const [start, end] = dates;
        setStartDateRange(start);
        setEndDateRange(end);
    };

    const CustomInput = forwardRef((props: PickerProps, ref) => {
        const startDate = format(props?.start || new Date(), 'MM/dd/yyyy')
        const endDate = props.end !== null ? format(props.end, 'MM/dd/yyyy') : '';

        const value = `${startDate}${endDate !== '' ? '-' + endDate : ''}`;

        return <TextField size='small' inputRef={ref} label={props.label || ''} {...props} value={value} />;
    });

    const apiData: CardStatsType = {
        statsHorizontal: [
            {
                color: 'success',
                stats: '64,550,000',
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: 'Tushum (oxirgi oy)',
                id: '#tushumlar'
            },
            {
                stats: '31,412,000',
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: 'Chiqim (oxirgi oy)',
                id: '#chiqimlar'
            },
            {
                color: 'success',
                stats: '64,550,000',
                trend: 'negative',
                icon: 'mdi:trending-up',
                trendNumber: '12.6%',
                title: 'Tushum (oxirgi yil)',
                id: '#tushumlar'
            },
            {
                stats: '31,412,000',
                color: 'error',
                icon: 'mdi:trending-down',
                trendNumber: '22.5%',
                title: 'Chiqim (oxirgi yil)',
                id: '#chiqimlar'
            }
        ],
        statsVertical: [
            {
                stats: formatCurrency(3000000),
                color: 'warning',
                icon: 'tdesign:money',
                title: 'Marketing',
            }
        ],
        statsCharacter: []
    }


    return (
        <ApexChartWrapper>
            <KeenSliderWrapper>
                <Grid container spacing={4}>

                    <Grid item xs={12}>
                        <Typography>Umumiy raqamlar</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <CardStatisticsHorizontal data={apiData.statsHorizontal} />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <CardStatisticsLiveVisitors />
                    </Grid>

                    <div id='tushumlar'></div>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '20px' }}>Guruh to'lovlari</Typography>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <GroupFinanceTable />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>Chiqimlar hisoboti</Typography>
                            <Button variant='contained' onClick={() => setOpen('create')}>+ {t("Bo'lim")}</Button>
                            <Box>
                                <DatePicker
                                    selectsRange
                                    monthsShown={2}
                                    endDate={endDateRange}
                                    selected={startDateRange}
                                    startDate={startDateRange}
                                    shouldCloseOnSelect={false}
                                    id='date-range-picker-months'
                                    onChange={handleOnChangeRange}
                                    popperPlacement={'bottom-start'}
                                    customInput={
                                        <CustomInput
                                            label="Sana bo'yicha"
                                            end={endDateRange as Date | number}
                                            start={startDateRange as Date | number}
                                        />
                                    }
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <div id='chiqimlar'></div>

                    <Grid item xs={12} md={12} >
                        {/* <CardStatisticsVertical data={apiData.statsVertical} /> */}
                        {
                            apiData.statsVertical.map((_, index) => (
                                <Box key={index} className='' sx={{ cursor: 'pointer', maxWidth: '200px' }} onClick={() => push(`/finance/costs/${12}`)}>
                                    <CardStatsVertical title={_.title} stats={_.stats} icon={<IconifyIcon fontSize={"4rem"} icon={'tdesign:money'} />} color={_.color} />
                                </Box>
                            ))
                        }
                    </Grid>
                </Grid>
            </KeenSliderWrapper>


            <Dialog open={open === 'create'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>Xarajatlar bo'limini yaratish</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField autoComplete='off' size='small' placeholder={t("Bo'lim nomi")} fullWidth onChange={(e) => setNameVal(e.target.value)} />
                    <Button variant='contained'>{t("Saqlash")}</Button>
                </DialogContent>
            </Dialog>
        </ApexChartWrapper>
    )
}


export default CardStatistics
