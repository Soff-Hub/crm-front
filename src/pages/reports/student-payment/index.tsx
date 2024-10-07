//@ts-nocheck
"use client";
import { Box, Chip, Pagination, Typography } from '@mui/material';
import { ReactNode, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from 'src/store';
import { formatCurrency } from 'src/@core/utils/format-currency';
import dynamic from "next/dynamic";
import { fetchGroupsList, fetchStudentPaymentsList, updateParams } from 'src/store/apps/reports/studentPayments';
import FilterBlock from 'src/views/apps/reports/student-payments/FilterBlock';
import useResponsive from 'src/@core/hooks/useResponsive';
import { AuthContext } from 'src/context/AuthContext';
import { toast } from 'react-hot-toast';

const DataTable = dynamic(() => import('src/@core/components/table'));

export interface customTableProps {
    xs: number
    title: string
    dataIndex?: string | ReactNode
    render?: (source: string) => any | undefined
}

export default function StudentPaymentsPage() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { push } = useRouter()
    const { user } = useContext(AuthContext)

    const { studentsPayment, paymentsCount, total_payments, isLoading, queryParams } = useAppSelector(state => state.studentPayments)

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
        if (!user?.role.includes('ceo') && !user?.role.includes('admin')) {
            push("/")
            toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
        }
        Promise.all([
            dispatch(fetchStudentPaymentsList(new URLSearchParams(queryParams).toString())),
            dispatch(fetchGroupsList())
        ])
    }, [])

    const handlePagination = async (page: number) => {
        dispatch(updateParams({ page: page }))
        await dispatch(fetchStudentPaymentsList(new URLSearchParams({ ...queryParams, page: String(page) }).toString()))
    }
    const { isMobile } = useResponsive()

    return (
        <div>
            <Box
                className='groups-page-header'
                sx={{ display: 'grid', gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr", gap: 2, alignItems: "center", margin: '10px 0' }}
                py={2}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Typography variant='h5'>{t("O'quvchilar to'lovi")}</Typography>
                    {!isLoading && <Chip label={`${paymentsCount}`} variant='outlined' color="primary" size="medium" />}
                    <Chip variant='outlined' size='medium' sx={{ fontSize: "14px", display: isMobile ? "flex" : "none", fontWeight: "bold", }} color="success" label={`${formatCurrency(total_payments)} UZS`} />
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
