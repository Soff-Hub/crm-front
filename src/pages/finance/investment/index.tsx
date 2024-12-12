import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import Router from 'next/router'
import DataTable, { customTableDataProps } from 'src/@core/components/table'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { SelectPicker } from 'rsuite'
import { useAppDispatch, useAppSelector } from 'src/store'
import { today } from 'src/@core/components/card-statistics/kanban-item'
import { fetchInvestments, updateParams } from 'src/store/apps/finance/investments'
import { monthItems, yearItems } from 'src/views/apps/finance/FinanceAllNumber'
const InvestmentPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [isCreateModalOpen, setOpenCreateModal] = useState(false)
  const [investments, setInvestments] = useState<any | null>(null)
  const [total_investments, setTotalInvestments] = useState<number | null>(null)
  const { queryParams, isLoading } = useAppSelector(state => state.investmentSlice)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<string>(today.split('-')[1])
  // Fetch investments data

  useEffect(() => {
    const queryString = new URLSearchParams(
      Object.fromEntries(Object.entries(queryParams).map(([key, value]) => [key, String(value)]))
    ).toString()
    dispatch(fetchInvestments(queryString))
  }, [])
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
    await dispatch(fetchInvestments(queryString))
  }

  // Formik setup
  const formik = useFormik({
    initialValues: {
      amount: '',
      description: ''
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required(t('Miqdor kiritilishi shart') || 'Miqdor kiritilishi shart')
        .positive(t('Miqdor 0 dan katta bolishi kereak') || 'Miqdor 0 dan katta bolishi kereak'),
      description: Yup.string().required(t('Izoh yozilishi kerak') || 'Izoh yozilishi kerak')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await api.post('common/finance/investment/create/', values)
        resetForm()
        setOpenCreateModal(false)
        const queryString = new URLSearchParams(
          Object.fromEntries(Object.entries(queryParams).map(([key, value]) => [key, String(value)]))
        ).toString()
        dispatch(fetchInvestments(queryString))
        toast.success(t('Investitsiya muvaffaqiyatli qoshildi') || 'Investitsiya muvaffaqiyatli qoshildi')
      } catch (error) {
        console.error(error)
        toast.error(t("Boshqatdan urinib ko'ring") || "Boshqatdan urinib ko'ring")
      } finally {
        setSubmitting(false)
      }
    }
  })

  const column: customTableDataProps[] = [
    {
      xs: 0.03,
      title: '#',
      dataIndex: 'index'
    },
    {
      xs: 0.4,
      title: t('Ism familiya'),
      dataIndex: 'first_name'
    },
    {
      xs: 0.4,
      title: t('Izoh'),
      dataIndex: 'description'
    },
    {
      xs: 0.3,
      title: t('Summa'),
      dataIndex: 'amount'
    },
    {
      xs: 0.3,
      title: t('Sana'),
      dataIndex: 'created_at',
      render: date => date
    }
  ]

  const { isMobile } = useResponsive()

  return (
    <Box className='header'>
      <Box
        sx={{
          display: isMobile ? 'grid' : 'flex',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          alignItems: 'center',
          mb: 4,
          px: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center', order: 1 }}>
          <IconButton color='primary' onClick={() => Router.back()}>
            <IconifyIcon icon={'ep:back'} />
          </IconButton>
          <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Investitsiyalar')}</Typography>
        </Box>
        <SelectPicker
          cleanable={false}
          onChange={v => handleYearDate(v, 'y')}
          size='sm'
          data={yearItems}
          style={{
            width: isMobile ? 'auto' : 224,
            margin: isMobile ? '0' : '0 10px 0 auto',
            order: 3
          }}
          value={year}
          searchable={false}
          placeholder='Yilni tanlang'
          menuStyle={{ padding: 0 }}
          renderMenuItem={label => <div className='cursor-pointer py-2 px-2'>{label}</div>}
        />

        <SelectPicker
          onChange={v => handleYearDate(v, 'm')}
          size='sm'
          data={monthItems}
          style={{
            width: isMobile ? 'auto' : 224,
            order: 4
          }}
          cleanable={false}
          value={month}
          searchable={false}
          placeholder='Oyni tanlang'
          menuStyle={{ padding: 0 }}
          renderMenuItem={label => <div className='py-2 px-2'>{label}</div>}
        />

        <Typography
          sx={{
            fontSize: '14px',
            order: 2,
            color: 'error.main',
            ml: 4,
            display: 'flex',
            alignItems: 'center',
            mr: 4,
            gap: '5px'
          }}
        >
          <Chip
            variant='outlined'
            size='medium'
            sx={{ fontSize: '14px', fontWeight: 'bold' }}
            color='success'
            label={`${formatCurrency(total_investments || 0)} UZS`}
          />
        </Typography>
        <Button
          variant='contained'
          size='small'
          sx={{ order: 5, gridColumn: '1/3' }}
          onClick={() => setOpenCreateModal(true)}
        >
          {t('Investitsiya yaratish')}
        </Button>
      </Box>
      <DataTable loading={isLoading} columns={column} data={investments || []} />

      <Dialog open={isCreateModalOpen} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>{t('Investitsiya yaratish')}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin='normal'
              label={t('Miqdor')}
              type='number'
              name='amount'
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              variant='outlined'
            />
            <TextField
              fullWidth
              margin='normal'
              label={t('Izoh')}
              name='description'
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              variant='outlined'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateModal(false)} color='error'>
              {t('Bekor qilish')}
            </Button>
            <Button type='submit' color='primary' disabled={formik.isSubmitting}>
              {t("Qo'shish")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default InvestmentPage
