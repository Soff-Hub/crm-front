import { Box, Pagination, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable, { customTableDataProps } from 'src/@core/components/table';
import { formatCurrency } from 'src/@core/utils/format-currency';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchTeacherSalaries, updateMyGroupParams } from 'src/store/apps/groups';



export default function PaymentsList() {
    const { t } = useTranslation()
    const { groups, isTableLoading, myGroupParams, isLoading, teacherSalaries } = useAppSelector(state => state.groups)
    const dispatch = useAppDispatch()

    const column: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: 'index',
        },
        {
            xs: 0.3,
            title: t("Markaz nomi"),
            dataIndex: 'title',
        },
        {
            xs: 0.2,
            title: t("To'lov summasi"),
            dataIndex: 'amount',
            render: (salaries) => `${formatCurrency(salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("To'lov qilingan sana"),
            dataIndex: 'date',
            render: (salaries) => `${formatCurrency(salaries)} so'm`
        },
        {
            xs: 0.2,
            title: t("To'lov hujjati"),
            dataIndex: 'file',
            render: (salaries) => `${formatCurrency(salaries)} so'm`
        },
        {
            xs: 0.1,
            title: t("Holati"),
            dataIndex: '',
            render: (salaries) => `${formatCurrency(salaries)} so'm`
        },
    ]

    useEffect(() => {
        (async function () {
            dispatch(fetchTeacherSalaries())
        })()
    }, [])

    const handlePagination = async (page: number) => {
        const queryString = new URLSearchParams({ ...myGroupParams, page: String(page) }).toString();
        dispatch(updateMyGroupParams({ page: page }))
        await dispatch(fetchTeacherSalaries(queryString))
    }


    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant='h6'>{t("O'quv markaz to'lovlari")}</Typography>
                <DataTable
                    loading={isTableLoading}
                    columns={column}
                    data={teacherSalaries?.results || []}
                    rowClick={(id: number) => null}
                />
            </Box>
            {teacherSalaries &&
                teacherSalaries?.count > 10 &&
                !isTableLoading &&
                <Pagination
                    defaultPage={myGroupParams?.page || 1}
                    count={Math.ceil(teacherSalaries?.count / 10)}
                    variant="outlined"
                    shape="rounded"
                    onChange={(e: any, page) => handlePagination(page)}
                />}
        </Box>
    )
}
