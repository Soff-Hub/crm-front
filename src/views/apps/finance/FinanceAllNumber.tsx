import { Box, Grid, Skeleton, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { DateRangePicker, SelectPicker } from 'rsuite';
import CardStatisticsHorizontal from 'src/views/ui/cards/statistics/CardStatisticsHorizontal'
import { useAppDispatch, useAppSelector } from 'src/store';
import { useTranslation } from 'react-i18next';
import EmptyContent from 'src/@core/components/empty-content';
import { fetchFinanceAllNumbers, updateNumberParams } from 'src/store/apps/finance';
import { formatDateString } from 'src/pages/finance';
import { AuthContext } from 'src/context/AuthContext';



const yearItems = [{ label: 2021, value: 2021 }, ...Array(new Date().getFullYear() - 2021).fill(1).map((item, index) => ({ label: 2021 + index + 1, value: 2021 + index + 1 }))]
const monthItems = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'].map((el, i) => ({ label: el, value: (i + 1) < 10 ? `0${i + 1}` : `${i + 1}` }))


const FinanceAllNumber = () => {
    const { all_numbers, numbersLoad, allNumbersParams } = useAppSelector(state => state.finance)
    const { user } = useContext(AuthContext)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [date, setDate] = useState<any>('')
    const [activeBranch, setActiveBranch] = useState<any>(user?.active_branch)

    const statsHorizontal = all_numbers ? [
        {
            color: 'warning',
            stats: all_numbers?.label.benefit,
            trend: 'negative',
            icon: 'hugeicons:money-receive-flow-02',
            trendNumber: '12.6%',
            title: t('Tushumlar'),
            id: '#tushumlar'
        },
        {
            stats: all_numbers?.label.expense,
            color: 'error',
            icon: 'hugeicons:money-send-flow-02',
            trendNumber: '22.5%',
            title: t('Chiqimlar'),
            id: '#chiqimlar'
        },
        {
            color: Number(all_numbers?.label.difference) < 0 ? 'error' : 'success',
            stats: all_numbers?.label.difference,
            trend: Number(all_numbers?.label.difference) < 0 ? 'negative' : 'positive',
            icon: Number(all_numbers?.label.difference) < 0 ? 'mdi:trending-down' : 'mdi:trending-up',
            trendNumber: '12.6%',
            title: t("Foyda"),
            id: '#tushumlar'
        }
    ] : []


    const handleChangeDate = async (e: any) => {
        if (e) {
            dispatch(updateNumberParams({ date_year: '', date_month: '' }))
            dispatch(updateNumberParams({ start_date: `${formatDateString(e[0])}`, end_date: `${formatDateString(e[1])}`, date_year: '', date_month: '' }))
            await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, start_date: `${formatDateString(e[0])}`, end_date: `${formatDateString(e[1])}`, date_year: '', date_month: '' }))
            dispatch(updateNumberParams({ date_month: '' }))
        } else {
            dispatch(updateNumberParams({ date_year: `${new Date().getFullYear()}-01-01`, start_date: ``, end_date: `` }))
            await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, date_year: `${new Date().getFullYear()}-01-01`, start_date: ``, end_date: `` }))
        }
        setDate(e)
    }

    const handleYearDate = async (value: any, t: 'm' | 'y') => {
        dispatch(updateNumberParams({ start_date: '', end_date: '' }))
        setDate('')
        if (!value) {
            if (t === 'm') {
                dispatch(updateNumberParams({ date_month: '' }))
                await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` }))
            } else {
                dispatch(updateNumberParams({ date_year: `${new Date().getFullYear()}-01-01` }))
                await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, date_month: '', start_date: ``, end_date: `` }))
            }
            return
        }
        if (Number(value) > 100) {
            dispatch(updateNumberParams({ date_year: `${value}-01-01` }))
            await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, date_year: `${value}-01-01`, start_date: ``, end_date: `` }))
        } else {
            dispatch(updateNumberParams({ date_month: value }))
            await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, date_year: allNumbersParams.date_year || `${new Date().getFullYear()}-01-01`, date_month: value, start_date: ``, end_date: `` }))
        }
    }

    const handleChangeBranch = async (branch: any) => {
        if (branch) {
            setActiveBranch(branch)
            dispatch(updateNumberParams({ branch }))
            await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, branch }))
        } else {
            setActiveBranch('')
            dispatch(updateNumberParams({ branch: '' }))
            await dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, branch: '' }))
        }
    }

    useEffect(() => {
        dispatch(fetchFinanceAllNumbers({ ...allNumbersParams, branch: activeBranch }))
    }, [])

    return (
        <div>
            <Grid xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: 1 }}>
                    <Typography sx={{ flexGrow: 1 }} variant="h5">{t('Umumiy raqamlar')}</Typography>
                    <SelectPicker
                        onChange={handleChangeBranch}
                        size='sm'
                        data={user?.branches ? [...user?.branches?.map(el => ({ label: el.name, value: el.id })), { label: 'Barcha filiallar', value: '' }] : []}
                        style={{ width: 224 }}
                        searchable={false}
                        placeholder="Filialni tanlang"
                        value={activeBranch}
                    />
                    <SelectPicker
                        onChange={(v) => handleYearDate(v, 'y')}
                        size='sm'
                        data={yearItems}
                        style={{ width: 224 }}
                        value={Number(allNumbersParams.date_year.split('-')[0])}
                        searchable={false}
                        placeholder="Yilni tanlang"
                    />
                    <SelectPicker
                        onChange={(v) => handleYearDate(v, 'm')}
                        size='sm'
                        data={monthItems}
                        style={{ width: 224 }}
                        value={allNumbersParams.date_month}
                        searchable={false}
                        placeholder="Oyni tanlang"
                    />
                    <DateRangePicker showOneCalendar placement="bottomEnd" locale={{
                        last7Days: "Oxirgi hafta",
                        sunday: "Yak",
                        monday: "Du",
                        tuesday: "Se",
                        wednesday: "Cho",
                        thursday: "Pa",
                        friday: "Ju",
                        saturday: "Sha",
                        ok: "Ok",
                        today: "Bugun",
                        yesterday: "Ertaga",
                        hours: "Soat",
                        minutes: "Minut",
                        seconds: "Sekund",
                    }}
                        format="yyyy-MM-dd"
                        onChange={handleChangeDate}
                        translate={'yes'}
                        size="sm"
                        value={date}
                    />
                </Box>
                {
                    numbersLoad ? <Grid container spacing={7}>
                        {
                            [1, 2, 3].map((_, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Skeleton
                                        variant="rounded"
                                        width={'100%'}
                                        height={'80px'}
                                        style={{ borderRadius: '10px' }}
                                        animation="wave"
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                        : all_numbers ? <CardStatisticsHorizontal data={statsHorizontal} /> : <EmptyContent />
                }
            </Grid>
        </div>
    );
}

export default FinanceAllNumber;