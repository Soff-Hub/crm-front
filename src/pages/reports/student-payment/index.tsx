'use client'
import { Box, Chip, MenuItem, Pagination, Select, Tooltip, Typography } from '@mui/material'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/store'
import { formatCurrency } from 'src/@core/utils/format-currency'
import dynamic from 'next/dynamic'
import { fetchGroupsList, fetchStudentPaymentsList, updateParams } from 'src/store/apps/reports/studentPayments'
import FilterBlock from 'src/views/apps/reports/student-payments/FilterBlock'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'

const DataTable = dynamic(() => import('src/@core/components/table'))

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
  const [rowsPerPage, setRowsPerPage] = useState<number>(() => Number(localStorage.getItem('rowsPerPage')) || 10)
  const { studentsPayment, paymentsCount, total_payments, isLoading, queryParams } = useAppSelector(
    state => state.studentPayments
  )
  const [page, setPage] = useState<number>(queryParams.page ? Number(queryParams.page) - 1 : 1)
  const { limit, offset, is_payment, page: paramPage, group, start_date, end_date } = queryParams

  const handleRowsPerPageChange = async (value: string) => {
    const limit = value
    setRowsPerPage(Number(value))
    localStorage.setItem('rowsPerPage', `${value}`)

    dispatch(updateParams({ limit: value }))
    const urlParams = new URLSearchParams({
      limit: limit ?? '',
      offset: offset ?? '0',
      is_payment: String(is_payment),
      page: String(page),
      group: group ?? '',
      start_date: start_date ?? '',
      end_date: end_date ?? ''
    }).toString()
    await dispatch(fetchStudentPaymentsList(urlParams))
    setPage(0)
  }
  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index',
      render: index => {
        return `${Number(queryParams?.offset || 0) + Number(index)}`
      }
    },
    {
      xs: 1.7,
      title: t("O'quvchi"),
      dataIndex: 'student_name'
    },
    {
      xs: 1.7,
      title: t('Guruhi'),
      dataIndex: 'group_name'
    },
    {
      xs: 1.7,
      title: t("To'lov miqdori"),
      dataIndex: 'amount',
      render: amount => {
        if (!isNaN(Number(amount))) {
          return `${formatCurrency(amount)} UZS`
        } else {
          return '*****'
        }
      }
    },
    {
      xs: 1.7,
      title: t("To'lov sanasi"),
      dataIndex: 'payment_date'
    },
    {
      xs: 1.7,
      title: t('Izoh').length > 10 ? t('Izoh').slice(0, 10) + '...' : t('Izoh'),
      dataIndex: 'description',
      render: text => (
        <Tooltip title={text}>
          <span>{text.length > 10 ? text.slice(0, 10) + '...' : text}</span>
        </Tooltip>
      )
    },
    {
      xs: 1.7,
      title: t("To'lov turi"),
      dataIndex: 'payment_type_name'
    }
  ]

  useEffect(() => {
    if (!user?.role.includes('ceo') && !user?.role.includes('admin') && !user?.role.includes('watcher')&& !user?.role.includes('marketolog')) {
      push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    if (rowsPerPage) {
      const params = new URLSearchParams({ ...queryParams, limit: `${rowsPerPage}` }).toString()
      Promise.all([dispatch(fetchStudentPaymentsList(params)), dispatch(fetchGroupsList())])
    }
  }, [rowsPerPage])

  const handlePagination = async (page: number) => {
    dispatch(updateParams({ page: page }))
    await dispatch(
      fetchStudentPaymentsList(
        new URLSearchParams({
          ...queryParams,
          offset: `${(page - 1) * rowsPerPage}`,
          limit: `${rowsPerPage}`
        }).toString()
      )
    )
  }
  const { isMobile } = useResponsive()

  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr',
          gap: 2,
          alignItems: 'center',
          margin: '10px 0'
        }}
        py={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Typography variant='h5'>{t("O'quvchilar to'lovi")}</Typography>
          {!isLoading && <Chip label={`${paymentsCount}`} variant='outlined' color='primary' size='medium' />}
          <Chip
            variant='outlined'
            size='medium'
            sx={{ fontSize: '14px', display: isMobile ? 'flex' : 'none', fontWeight: 'bold' }}
            color='success'
            label={`${formatCurrency(total_payments)} UZS`}
          />
        </Box>
        <FilterBlock />
      </Box>
      <DataTable loading={isLoading} columns={columns} data={studentsPayment} />
      {Math.ceil(paymentsCount / 10) > 1 && !isLoading && (
        <div className='d-flex'>
          <Pagination
            defaultPage={Number(queryParams.page) || 1}
            count={Math.ceil(paymentsCount / rowsPerPage)}
            variant='outlined'
            shape='rounded'
            onChange={(_: any, page) => handlePagination(page)}
          />
          <Select
            size='small'
            onChange={e => handleRowsPerPageChange(String(e.target.value))}
            value={rowsPerPage}
            className='page-resize'
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
          </Select>
        </div>
      )}
    </div>
  )
}
