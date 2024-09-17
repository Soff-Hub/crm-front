//@ts-nocheck
"use client";
import { Box, Chip, Pagination, Typography } from '@mui/material';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from 'src/store';
import { formatCurrency } from 'src/@core/utils/format-currency';
import dynamic from "next/dynamic";
import { fetchGroupsList, fetchStudentPaymentsList, updateParams } from 'src/store/apps/reports/studentPayments';
import FilterBlock from 'src/views/apps/reports/student-payments/FilterBlock';

const DataTable = dynamic(() => import('src/@core/components/table'));

export interface customTableProps {
    xs: number
    title: string
    dataIndex?: string | ReactNode
    render?: (source: string) => any | undefined
}

export default function StudentPaymentsPage() {
    const { t } = useTranslation()
    const { push } = useRouter()
    const dispatch = useAppDispatch()

    const { studentsPayment, paymentsCount, isLoading, queryParams } = useAppSelector(state => state.studentPayments)

    const columns: customTableProps[] = [
        {
            xs: 0.2,
            title: t("ID"),
            dataIndex: 'index'
        },
        {
            xs: 1.7,
            title: t("O'quvchi"),
            dataIndex: 'student_name'
        },
        {
            xs: 1.7,
            title: t("Guruhi"),
            dataIndex: 'group_name'
        },
        {
            xs: 1.7,
            title: t("To'lov miqdori"),
            dataIndex: 'amount',
            render: (amount) => {
                if (!isNaN(Number(amount))) {
                    return `${formatCurrency(amount)} UZS`;
                } else {
                    return "*****";
                }
            }
        },
        {
            xs: 1.7,
            title: t("To'lov sanasi"),
            dataIndex: 'payment_date',
        },
        {
            xs: 1.7,
            title: t("To'lov turi"),
            dataIndex: 'payment_type_name'
        },
    ]


    useEffect(() => {
        Promise.all([
            dispatch(fetchStudentPaymentsList(new URLSearchParams(queryParams).toString())),
            dispatch(fetchGroupsList())
        ])
    }, [])

    const handlePagination = async (page: number) => {
        dispatch(updateParams({ page: page }))
        await dispatch(fetchStudentPaymentsList(new URLSearchParams({ ...queryParams, page: String(page) }).toString()))
    }

    return (
        <div>
            <Box
                className='groups-page-header'
                sx={{ display: 'grid', gridTemplateColumns: "1fr 1fr", alignItems: "center", margin: '10px 0' }}
                py={2}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Typography variant='h5'>{t("O'quvchilar to'lovi")}</Typography>
                    {!isLoading && <Chip label={`${paymentsCount}`} variant='outlined' color="primary" size="medium" />}
                </Box>
                <FilterBlock />
            </Box>
            <DataTable loading={isLoading} columns={columns} data={studentsPayment} />
            {Math.ceil(paymentsCount / 10) > 1 && !isLoading && <Pagination
                defaultPage={Number(queryParams.page) || 1}
                count={Math.ceil(paymentsCount / 10)}
                variant="outlined"
                shape="rounded"
                onChange={(_: any, page) =>
                    handlePagination(page)
                }
            />}
        </div>
    )
}
