import { Box, Button, Chip, Pagination, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from 'src/@core/utils/format-currency';
import 'react-datepicker/dist/react-datepicker.css';
import DataTable from 'src/@core/components/table';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getAdvanceList, getStaffs, setOpenCreateModal, updateParams } from 'src/store/apps/finance/advanceSlice';
import CreateModal from 'src/views/apps/finance/advance/CreateModal';
import EditModal from 'src/views/apps/finance/advance/EditModal';


function Slug() {
    const { isLoading, queryParams, advanceList, columns } = useAppSelector(state => state.advanceSlice)
    const dispatch = useAppDispatch()

    const { t } = useTranslation()

    useEffect(() => {
        dispatch(getAdvanceList())
        dispatch(getStaffs())
    }, [])

    const handlePagination = async (page: number) => {
        const queryString = new URLSearchParams({ ...queryParams, page: String(page) }).toString()
        dispatch(updateParams({ page: page }))
        await dispatch(getAdvanceList(queryString))
    }

    return (
        <Box>
            <Box className='header'>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2 }}>
                    <Typography variant='h6' sx={{ marginRight: 4 }}>{t("Avanslar")}</Typography>
                    <Typography sx={{ fontSize: '14px', color: 'error.main', ml: 'auto', display: 'flex', alignItems: 'center', mr: 4, gap: '5px' }} >
                        <Chip variant='outlined' size='medium' sx={{ fontSize: "14px", fontWeight: "bold" }} color="success" label={`${formatCurrency(advanceList?.total_prepayments)} UZS`} />
                    </Typography>
                    <Button variant='contained' size='small' onClick={() => dispatch(setOpenCreateModal(true))}>{t("Avans berish")}</Button>
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
