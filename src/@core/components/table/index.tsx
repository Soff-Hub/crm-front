'use client'

import { Box, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { Placeholder } from 'react-bootstrap'
import EmptyContent from '../empty-content'

export type customTableDataProps = {
  xs: number
  title: string | React.ReactNode
  dataIndex?: string | ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
  renderSource?: (source: any, item: any) => any | undefined
}

type DataTableProps = {
  columns: customTableDataProps[]
  data: any[]
  minWidth?: string | undefined
  maxWidth?: string | undefined
  rowClick?: any
  color?: boolean | undefined
  text_color?: boolean | undefined
  loading?: boolean
}

export default function DataTable({ columns, loading = false, data, minWidth, maxWidth, rowClick }: DataTableProps) {
  const { query } = useRouter()

  const handleClick = (id: any) => {
    rowClick?.(id)
  }

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', padding: '0 5px' }}>
      <Box
        minWidth={minWidth || '1200px'}
        my={2}
        sx={{
          padding: '15px 10px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          cursor: 'pointer',
          maxWidth: maxWidth || null
        }}
      >
        {columns.map((el, i) => (
          <Box key={i} sx={{ textAlign: 'start', flex: el.xs }} pt={'0 !important'} pl={'0 !important'}>
            <Box sx={{ fontSize: 14, fontWeight: 700 }}>
              {loading ? (
                <Placeholder as='span' animation='glow' style={{ width: '100px', height: '30px' }} />
              ) : (
                el.title
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
          <Skeleton variant='rounded' height={40} width='100%' />
        </Box>
      ) : data?.length > 0 ? (
        data?.map((item, index) => {
          return (
            <Box
              minWidth={minWidth || '1200px'}
              key={index}
              my={2}
              sx={{
                padding: '5px 10px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                maxWidth: maxWidth || null,
                cursor: 'pointer'
              }}
            >
              {columns.map((el: any, i) => (
                <Box key={i} sx={{ textAlign: 'start', flex: el.xs, pb: '5px' }}>
                  <Box sx={{ fontSize: 12, fontWeight: 500 }}>
                    {el.render
                      ? el.render(el.dataIndex === 'index' ? index + 1 : item[`${el.dataIndex}`])
                      : el.renderItem
                      ? el.renderItem(item)
                      : el.renderSource
                      ? el.renderSource(item[`${el.dataIndex}`], item)
                      : el.renderId
                      ? el.renderId(item.id, item[`${el.dataIndex}`])
                      : el.dataIndex === 'index'
                      ? `${
                          query.page && Number(query.page) > 1 ? (Number(query?.page) - 1) * 10 + index + 1 : 1 + index
                        }.`
                      : item[`${el.dataIndex}`]}
                  </Box>
                </Box>
              ))}
              {rowClick && (
                <Box
                  sx={{ width: '55%', zIndex: 1, height: '36px', position: 'absolute' }}
                  onClick={() => handleClick(item.id)}
                ></Box>
              )}
            </Box>
          )
        })
      ) : (
        <EmptyContent />
      )}
    </div>
  )
}
