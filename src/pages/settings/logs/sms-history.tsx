import { Chip, MenuItem, Pagination, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DataTable, { customTableDataProps } from 'src/@core/components/table'
import api from 'src/@core/utils/api'
import { DateRangePicker, Input } from 'rsuite'
import 'rsuite/DateRangePicker/styles/index.css'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next/types'
import format from 'date-fns/format'

let timeoutId: any

const formatDate = async (date: Date[] | null) => {
  if (!date) {
    return {
      start_date: '',
      end_date: ''
    }
  }
  const start_date = date?.[0] ? format(date?.[0], 'yyyy-MM-dd') : ''
  const end_date = date?.[1] ? format(date?.[1], 'yyyy-MM-dd') : ''

  return {
    start_date,
    end_date
  }
}

const debounceFunction = (search: string, clbckSearch: any) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    clbckSearch?.(search)
  }, 800)
}

function SMSHistory() {
  const [data, setData] = React.useState([])
  const { push, query, pathname } = useRouter()
  const [dataCount, setDataCount] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  const columns: customTableDataProps[] = [
    {
      xs: 0.3,
      title: 'Qabul qildi',
      dataIndex: 'first_name',
      renderItem(source) {
        return (
          <div className='d-flex align-items-center gap-2'>
            <Chip
              label={source?.for_lead ? 'Lid' : "O'quvchi"}
              size='small'
              color={source?.for_lead ? 'warning' : 'secondary'}
            />
            <span>{source?.first_name}</span>
          </div>
        )
      }
    },
    {
      xs: 0.3,
      title: 'Xabar',
      dataIndex: 'message'
    },
    {
      xs: 0.3,
      title: 'Yubordi',
      dataIndex: 'admin_data'
    },
    {
      xs: 0.3,
      title: 'Yuborilgan vaqti',
      dataIndex: 'created_at'
    }
  ]

  const getData = async () => {
    setLoading(true)
    try {
      const resp = await api.get('/auth/sms-history/', {
        params: {
          ...query,
          limit: query?.limit || 10,
          offset: query?.offset || 0,
        }
      })
      setData(resp.data?.results)
      setDataCount(resp.data?.count)
    } catch (err: any) {
      console.log(err)
    }
    setLoading(false)
  }

  const handlePaginate = (p: number) => {
    const limit = Number(query?.limit || 10)
    push({
      pathname,
      query: {
        ...query,
        offset: (p - 1) * limit
      }
    })
  }

  useEffect(() => {
    getData()
  }, [query?.offset, query?.search, query?.limit, query?.start_date, query?.end_date])

  return (
    <div>
      <div className='sms-filters d-flex gap-2'>
        <Input
          placeholder='Qidirish...'
          defaultValue={query?.search}
          size='lg'
          onChange={e =>
            debounceFunction(e, (v: string) =>
              push({
                pathname,
                query: {
                  ...query,
                  search: v,
                  offset: 0
                }
              })
            )
          }
        />
        {query?.start_date && query?.end_date ? (
          <DateRangePicker
            format='yyyy-MM-dd'
            onChange={dates =>
              formatDate(dates).then(resp => push({ pathname, query: { ...query, ...resp, offset: 0 } }))
            }
            translate={'yes'}
            size='lg'
            value={
              query?.start_date && query?.end_date
                ? [new Date(query?.start_date?.toString()), new Date(query?.end_date?.toString())]
                : null
            }
          />
        ) : (
          <DateRangePicker
            format='yyyy-MM-dd'
            onChange={dates =>
              formatDate(dates).then(resp => push({ pathname, query: { ...query, ...resp, offset: 0 } }))
            }
            translate={'yes'}
            size='lg'
          />
        )}
      </div>
      <DataTable columns={columns} data={data} loading={loading} />
      {!loading && (
        <div className='d-flex gap=2 mt-3 align-items-center'>
          <Pagination
            defaultPage={Math.floor(Number(query?.offset || 0) / Number(query?.limit || 10)) + 1}
            count={Math.ceil(dataCount / (Number(query?.limit) || 10))}
            variant='outlined'
            shape='rounded'
            page={Math.floor(Number(query?.offset || 0) / Number(query?.limit || 10)) + 1}
            onChange={(_, page) => handlePaginate(page)}
          />
          <Select
            name='branch'
            value={query?.limit || '10'}
            size='small'
            style={{ width: '80px' }}
            onChange={evt => push({ 
              pathname, 
              query: { 
                ...query, 
                limit: evt.target.value, 
                offset: 0 
              } 
            })}
          >
            <MenuItem value={'10'}>10</MenuItem>
            <MenuItem value={'20'}>20</MenuItem>
            <MenuItem value={'50'}>50</MenuItem>
            <MenuItem value={'100'}>100</MenuItem>
          </Select>
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context

  return {
    props: {
      page: query?.page || null,
      search: query?.search || null,
      start_date: query?.start_date || null,
      end_date: query?.end_date || null
    }
  }
}

export default SMSHistory
