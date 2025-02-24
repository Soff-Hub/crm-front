import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Switch
} from '@mui/material'
import DataTable, { customTableDataProps } from '../table'
import Router, { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import Status from '../status'
import { toast } from 'react-hot-toast'
import IconifyIcon from '../icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { updateParams } from 'src/store/apps/c-panel'

export interface CompanyType {
  id: number
  name: string
  reference_phone: string
  reference_name: string
  logo: any
  schema_name: string
  is_active: boolean
  domains: { id: number; domain: string }[]
  is_create: boolean
}
export interface CompanyDataType {
  count: number
  next: string | null
  previous: string | null
  results: CompanyType[]
}
export interface QueryParams {
  page?: string
  search?: string
  payment_status_nearly?: string
  debtor?: string
}

export default function CompanyList() {
  const { t } = useTranslation()
  const [data, setData] = useState<CompanyDataType | null>(null)
  const [centerId, setCenterId] = useState<number | null>(null)
  const [isLoading, setLoading] = useState(false)
  const { queryParams } = useAppSelector(state => state.cPanelSlice)
  const dispatch = useAppDispatch()

  const queryString = new URLSearchParams({ ...queryParams } as Record<string, string>).toString()

  async function getData(queryString: string = '') {
    setLoading(true)
    try {
      const resp = await api.get(`/owner/list/client/?` + queryString)
      setData(resp.data)
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while fetching data')
    }
    setLoading(false)
  }

  const suspendCompany = async (item: any, id: any) => {
    setCenterId(item.id)
    try {
      await api.patch(`/owner/client/${item.id}/`, { is_active: id })
      await getData()
    } catch (err: any) {
      console.log(err?.response?.data)
    }
    setCenterId(null)
  }

  const column: customTableDataProps[] = [
    {
      xs: 0.03,
      title: '#',
      dataIndex: 'index'
    },
    {
      xs: 0.15,
      title: t('Nomi'),
      dataIndex: 'name'
    },
    {
      xs: 0.2,
      title: t('Masul shaxs ismi'),
      dataIndex: 'reference_name'
    },
    {
      xs: 0.2,
      title: t('Masul shaxs raqami'),
      dataIndex: 'reference_phone'
    },
    {
      xs: 0.2,
      title: t('Domain'),
      dataIndex: 'domain',
      render: domain => `${domain}.soffcrm.uz`
    },
    {
      xs: 0.2,
      title: t('SMS soni'),
      dataIndex: 'sms_data'
    },
    {
      xs: 0.2,
      title: t("Keyingi to'ov sanasi"),
      dataIndex: 'expiration_date',
      render: expiration_date => `${expiration_date?.split('-').reverse().join('/')}`
    },
    {
      xs: 0.2,
      title: t("Keyingi to'lovgacha"),
      dataIndex: 'allowed_days',
      render: allowed_days => `${allowed_days} kun`
    },
    {
      xs: 0.2,
      title: t("O'quvchilar soni"),
      dataIndex: 'students_count',
      render: domain => `${domain}`
    },
    {
      xs: 0.07,
      title: t('Status'),
      dataIndex: 'id',
      render: (status: any) => {
        const find = data?.results.find(el => el.id === status)
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {centerId === find?.id ? (
              <>
                <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
              </>
            ) : (
              <>
                {find?.is_active === true ? <Status color='success' /> : <Status color='error' />}
                <Switch checked={Boolean(find?.is_active)} onChange={(e, i) => suspendCompany(find, i)} />
              </>
            )}
          </Box>
        )
      }
    }
  ]

  const { push } = useRouter()

  const rowClick = (id: any) => {
    push(`/c-panel/company/${id}`)
  }

  useEffect(() => {
    getData(queryString)
  }, [])

  const handlePagination = async (page: number) => {
    const queryString = new URLSearchParams({ ...queryParams, page: String(page) }).toString()
    dispatch(updateParams((prevState: any) => ({ ...prevState, page: String(page) })))
    await getData(queryString)
  }

  const handleSearch = async (value: string) => {
    const queryString = new URLSearchParams({ ...queryParams, search: value, page: '1' }).toString()
    dispatch(updateParams({ search: value, page: queryParams.page }))
    await getData(queryString)
  }

  async function handleFilter(key: string, value: string | number | null) {
    if (key === 'amount') {
      if (value === 'debtor') {
        const queryString = new URLSearchParams({
          ...queryParams,
          debtor: 'true',
          paid: '',
          payment_status_nearly: '',
          page: '1'
        }).toString()
        await getData(queryString)
        dispatch(updateParams({ debtor: 'true', payment_status_nearly: '', page: '1' }))
      } else if (value === 'payment_status_nearly') {
        const queryString = new URLSearchParams({
          ...queryParams,
          payment_status_nearly: 'true',
          paid: '',
          debtor: '',
          page: '1'
        }).toString()
        await getData(queryString)
        dispatch(updateParams({ payment_status_nearly: 'true', debtor: '', page: '1' }))
      } else if (value === 'paid') {
        const queryString = new URLSearchParams({
          ...queryParams,
          paid: 'true',
          payment_status_nearly: '',
          debtor: '',
          page: '1'
        }).toString()
        await getData(queryString)
        dispatch(updateParams({ paid: 'true', payment_status_nearly: '', debtor: '', page: '1' }))
      } else if (value === 'all') {
        const queryString = new URLSearchParams({
          ...queryParams,
          debtor: '',
          paid: '',
          payment_status_nearly: '',
          page: '1'
        }).toString()
        await getData(queryString)
        dispatch(updateParams({ debtor: '',paid:'', payment_status_nearly: '', page: '1' }))
      }
      return
    }

    if (key === 'status') {
      const queryString = new URLSearchParams({ status: String(value) }).toString()
      await getData(queryString)
    } else {
      const queryString = new URLSearchParams({ ...queryParams, [key]: String(value) }).toString()
      await getData(queryString)
    }
    dispatch(updateParams({ [key]: value }))
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <FormControl variant='outlined' size='small' sx={{ width: '300px' }}>
          <InputLabel htmlFor='outlined-adornment-password'>{t('Qidirish')}</InputLabel>
          <OutlinedInput
            id='outlined-adornment-password'
            type={'text'}
            onChange={e => handleSearch(e.target.value)}
            value={queryParams.search}
            autoComplete='off'
            endAdornment={
              <InputAdornment position='end'>
                <IconifyIcon icon={'tabler:search'} />
              </InputAdornment>
            }
            label={t('Qidirish')}
          />
        </FormControl>
        <Box display='flex' alignItems='center' gap={3} sx={{ width: '300px', ml: 3 }}>
          <FormControl fullWidth>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t("To'lov holati")}
            </InputLabel>
            <Select
              size='small'
              label={t("To'lov holati")}
              value={
                queryParams.debtor
                  ? 'debtor'
                  : Boolean(queryParams.payment_status_nearly)
                  ? 'payment_status_nearly'
                  : Boolean(queryParams.paid)
                  ? 'paid'
                  : ''
              }
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              onChange={(e: any) => {
                if (e.target.value === 'debtor') {
                  handleFilter('amount', 'debtor')
                } else if (e.target.value === 'payment_status_nearly') {
                  handleFilter('amount', 'payment_status_nearly')
                } else if (e.target.value === 'paid') {
                  handleFilter('amount', 'paid')
                } else {
                  handleFilter('amount', 'all')
                }
              }}
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'payment_status_nearly'}>{t("To'lov vaqti yaqinlashgan")}</MenuItem>
              <MenuItem value={'debtor'}>{t('Qarzdor')}</MenuItem>
              <MenuItem value={'paid'}>{t("To'lov qilgan")}</MenuItem>
            </Select>
          </FormControl>
          <Chip label={data?.count} variant='outlined' color='success' />
        </Box>
        <Button onClick={() => Router.push('/c-panel/company/create')} sx={{ marginLeft: 'auto' }} variant='contained'>
          {t('Yaratish')}
        </Button>
      </Box>
      <Box>
        <DataTable
          loading={isLoading}
          columns={column}
          data={data?.results || []}
          rowClick={(id: number) => rowClick(id)}
        />
        {data && data?.count > 50 && !isLoading && (
          <Pagination
            defaultPage={Number(queryParams?.page) || 1}
            count={Math.ceil(data?.count / 50)}
            variant='outlined'
            shape='rounded'
            onChange={(e: any, page) => handlePagination(page)}
          />
        )}
      </Box>
    </Box>
  )
}
