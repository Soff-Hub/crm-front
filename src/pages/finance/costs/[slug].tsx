import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import Router, { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next/types'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import { formatCurrency } from 'src/@core/utils/format-currency'
import 'rsuite/DateRangePicker/styles/index.css'
import DataTable, { customTableDataProps } from 'src/@core/components/table'
import CreateCostForm from 'src/views/apps/finance/CreateCostForm'
import IconifyIcon from 'src/@core/components/icon'
import { DateRangePicker } from 'rsuite'
import { formatDateString } from '..'
import EditCostForm from 'src/views/apps/finance/EditCostForm'
import CostRowActions from 'src/views/apps/finance/CostRowOptions'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'

function Slug(props: { slug: string }) {
  const { query, push } = useRouter()

  const { t } = useTranslation()

  const [data, setData] = useState<any[]>([])
  const [name, setName] = useState<string>('')
  const [allAmount, setAllAmount] = useState<string>('')
  const [open, setOpen] = useState<any>(null)
  const [editable, setEditable] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [date, setDate] = useState<any>('')
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'))

  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const updateCategory = async () => {
    try {
      await api.patch(`finance/budget-category/update/${query?.slug}/`, { name })
      getExpense(``)
      setEditable(false)
    } catch (err) {
      console.log(err)
    }
  }

  const getExpense = async (params: string) => {
    setLoading(true)
    const resp = await api.get(`finance/expense/list/${query?.slug}/?${params}`)
    setData(resp.data.result)
    setName(resp.data?.category)
    setAllAmount(resp.data?.total_expense)
    setLoading(false)
  }

  const onEdit = (id: any) => {
    const find = data.find(el => el.id === id)
    setOpen(find)
    console.log(id)
  }

  console.log(selectedYear, selectedMonth)

  const columns: customTableDataProps[] = [
    {
      xs: 0.03,
      title: '#',
      dataIndex: 'index'
    },
    {
      xs: 0.2,
      title: t('Summa'),
      dataIndex: 'amount',
      render: amount => `${formatCurrency(amount)} so'm`
    },
    {
      xs: 0.2,
      title: t('Sana'),
      dataIndex: 'date'
    },
    {
      xs: 0.5,
      title: t('Izoh'),
      dataIndex: 'description'
    },
    {
      xs: 0.05,
      title: '',
      dataIndex: 'id',
      render: id => <CostRowActions reRender={() => getExpense(``)} id={Number(id)} onEdit={onEdit} />
    }
  ]

  const handleYearChange = async (event: any) => {
    const year = event.target.value
      setSelectedYear(year)
      setDate('')

    const formattedDate = `${year}-${selectedMonth}-01`
    await getExpense(`date_year=${formattedDate}&date_month=${formattedDate}`)
  }

  const handleMonthChange = async (event: any) => {
    const month = event.target.value
    setSelectedMonth(month)
    setDate('')
    const formattedDate = `${selectedYear}-${month}-01`
    await getExpense(`date_year=${formattedDate}&date_month=${formattedDate}`)
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const startYear = 2020
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
  }

  const handleChangeDate = async (e: any) => {
    if (e) {
      setSelectedMonth('')
      setSelectedYear('')
      await getExpense(`start_date=${formatDateString(e[0])}&end_date=${formatDateString(e[1])}`)
    } else {
      await getExpense(``)
    }
    setDate(e)
  }

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('casher') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    const formattedDate = `${selectedYear}-${selectedMonth}-01`
    getExpense(`date_year=${formattedDate}&date_month=${formattedDate}`)
  }, [])

  return (
    <Box>
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
          <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center' }}>
            <IconButton color='primary'>
              <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={() => Router.back()} />
            </IconButton>
            {editable ? (
              <TextField
                onBlur={updateCategory}
                size='small'
                sx={{ fontSize: '20px', marginRight: 4 }}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            ) : (
              <Typography variant='h6' sx={{ marginRight: 4 }}>
                {name}
              </Typography>
            )}
            <IconifyIcon
              style={{ cursor: 'pointer' }}
              icon={editable ? 'ic:baseline-check' : 'mdi:edit'}
              onClick={() => setEditable(!editable)}
            />
          </Box>

          <DateRangePicker
            showOneCalendar
            placement='bottomEnd'
            locale={{
              last7Days: t('Oxirgi hafta'),
              sunday: t('Yak'),
              monday: t('Du'),
              tuesday: t('Se'),
              wednesday: t('Cho'),
              thursday: t('Pa'),
              friday: t('Ju'),
              saturday: t('Sha'),
              ok: t('Saqlash'),
              today: t('Bugun'),
              yesterday: t('Kecha'),
              hours: t('Soat'),
              minutes: t('Minut'),
              seconds: t('Sekund')
            }}
            style={{ marginLeft: isMobile ? '0' : 'auto', order: 3, gridColumn: '1/3' }}
            format='yyyy-MM-dd'
            onChange={handleChangeDate}
            translate={'yes'}
            size='sm'
            value={date||''}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id='year-select-label'>{t('Yilni tanlang')}</InputLabel>
              <Select
                size='small'
                labelId='year-select-label'
                value={selectedYear || ''}
                onChange={handleYearChange}
                label={t('Yilni tanlang')}
              >
                {generateYearOptions().map(year => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id='month-select-label'>{t('Oyni tanlang')}</InputLabel>
              <Select
                size='small'
                labelId='month-select-label'
                value={selectedMonth || ''}
                onChange={handleMonthChange}
                label={t('Oyni tanlang')}
              >
                <MenuItem value='01'>{t('Yanvar')}</MenuItem>
                <MenuItem value='02'>{t('Fevral')}</MenuItem>
                <MenuItem value='03'>{t('Mart')}</MenuItem>
                <MenuItem value='04'>{t('Aprel')}</MenuItem>
                <MenuItem value='05'>{t('May')}</MenuItem>
                <MenuItem value='06'>{t('Iyun')}</MenuItem>
                <MenuItem value='07'>{t('Iyul')}</MenuItem>
                <MenuItem value='08'>{t('Avgust')}</MenuItem>
                <MenuItem value='09'>{t('Sentyabr')}</MenuItem>
                <MenuItem value='10'>{t('Oktyabr')}</MenuItem>
                <MenuItem value='11'>{t('Noyabr')}</MenuItem>
                <MenuItem value='12'>{t('Dekabr')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
              color='error'
              label={`${formatCurrency(allAmount)} so'm`}
            />
          </Typography>

          <Button
            variant='contained'
            size='small'
            style={{ order: 4, gridColumn: '1/3' }}
            onClick={() => setOpen('create')}
          >
            {t("Yangi qo'shish")}
          </Button>
        </Box>
      </Box>

      <DataTable loading={loading} columns={columns} data={data} />

      <Dialog open={open === 'create'} onClose={() => setOpen(null)}>
        <DialogTitle sx={{ textAlign: 'center' }}>{t('Xarajat kiritish')}</DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <CreateCostForm slug={props.slug} setOpen={setOpen} reRender={() => getExpense('')} />
        </DialogContent>
      </Dialog>

      <Dialog open={open?.id} onClose={() => setOpen(null)}>
        <DialogTitle sx={{ textAlign: 'center' }}>{t('Xarajatni tahrirlash')}</DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <EditCostForm slug={props.slug} setOpen={setOpen} reRender={() => getExpense('')} initials={open} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context

  return {
    props: {
      slug: params?.slug
    }
  }
}

export default Slug
