import { Box, Button, Chip, IconButton, Pagination, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from 'src/@core/utils/format-currency';
import 'react-datepicker/dist/react-datepicker.css';
import DataTable from 'src/@core/components/table';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getAdvanceList, getStaffs, setOpenCreateModal, updateParams } from 'src/store/apps/finance/advanceSlice';
import CreateModal from 'src/views/apps/finance/advance/CreateModal';
import EditModal from 'src/views/apps/finance/advance/EditModal';
import { SelectPicker } from 'rsuite';
import { monthItems, yearItems } from 'src/views/apps/finance/FinanceAllNumber';
import { today } from 'src/@core/components/card-statistics/kanban-item';
import IconifyIcon from 'src/@core/components/icon';
import Router, { useRouter } from 'next/router';
import useResponsive from 'src/@core/hooks/useResponsive';
import { AuthContext } from 'src/context/AuthContext';


function Slug() {
    const { isLoading, queryParams, advanceList, columns } = useAppSelector(state => state.advanceSlice)
    const dispatch = useAppDispatch()

    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [month, setMonth] = useState<string>(today.split('-')[1])

    const { user } = useContext(AuthContext)
    const router = useRouter()

    const { t } = useTranslation()
    const { isMobile } = useResponsive()

    useEffect(() => {
        if (user?.role.includes('student') ||
            (user?.role.includes('teacher') && !user?.role.includes('ceo')) ||
            user?.role.includes('admin')) {
            router.push("/")
        }
        const queryString = new URLSearchParams({ ...queryParams, page: `1` }).toString()
        dispatch(getAdvanceList(queryString))
        dispatch(getStaffs())
    }, [])

    const handlePagination = async (page: number) => {
        const queryString = new URLSearchParams({ ...queryParams, page: String(page) }).toString()
        dispatch(updateParams({ page: page }))
        await dispatch(getAdvanceList(queryString))
    }

    const handleYearDate = async (value: any, t: 'm' | 'y') => {
        let params: any = {
            date_year: ``,
            date_month: ``
        }

        if (value) {
            if (t === 'y') {
                setYear(value)
                setMonth(``)
                params.date_year = `${value}-01-01`
            } else {
                setMonth(value)
                params.date_month = `${year}-${value}-01`
                params.date_year = `${year}-01-01`
            }
        } else {
            if (t === 'y') {
                setYear(new Date().getFullYear())
            } else {
                setMonth(today.split('-')[1])
            }
        }
        const queryString = new URLSearchParams({ ...queryParams, ...params }).toString()
        dispatch(updateParams(params))
        await dispatch(getAdvanceList(queryString))
    }

    return (
        <Box>
            <Box className='header'>
                <Box sx={{ display: isMobile ? "grid" : 'flex', gridTemplateColumns: "1fr 1fr", gap: 2, alignItems: 'center', mb: 4, px: 2 }}>
                    <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center', order: 1 }}>
                        <IconButton color='primary'>
                            <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={() => Router.back()} />
                        </IconButton>
                        <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t("Avanslar")}</Typography>
                    </Box>
                    <SelectPicker
                        onChange={(v) => handleYearDate(v, 'y')}
                        size='sm'
                        data={yearItems}
                        style={{ width: isMobile ? "auto" : 224, margin: isMobile ? "0" : '0 10px 0 auto', order: 3 }}
                        value={year}
                        searchable={false}
                        placeholder="Yilni tanlang"
                    />
                    <SelectPicker
                        onChange={(v) => handleYearDate(v, 'm')}
                        size='sm'
                        data={monthItems}
                        style={{ width: isMobile ? "auto" : 224, order: 4 }}
                        value={month}
                        searchable={false}
                        placeholder="Oyni tanlang"
                    />
                    <Typography sx={{ fontSize: '14px', order: 2, color: 'error.main', ml: 4, display: 'flex', alignItems: 'center', mr: 4, gap: '5px' }} >
                        <Chip variant='outlined' size='medium' sx={{ fontSize: "14px", fontWeight: "bold" }} color="success" label={`${formatCurrency(advanceList?.total_prepayments)} UZS`} />
                    </Typography>
                    <Button variant='contained' size='small' sx={{ order: 5, gridColumn: "1/3" }} onClick={() => dispatch(setOpenCreateModal(true))}>{t("Avans berish")}</Button>
                </Box>
            </Box>
            <DataTable loading={isLoading} columns={columns} data={advanceList?.results as []} />
            {advanceList && advanceList?.count > 10 && !isLoading && <Pagination defaultPage={queryParams?.page || 1} count={Math.ceil(advanceList?.count / 10)} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(page)} />}
            <CreateModal />
            <EditModal />
        </Box>
    )
}


export default Slug
