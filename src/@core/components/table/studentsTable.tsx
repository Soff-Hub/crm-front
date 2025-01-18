import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import EmptyContent from '../empty-content'
import { fetchDepartmentList } from 'src/store/apps/leads'
import { useAppDispatch } from 'src/store'

export interface customTableDataProps {
  xs: number
  title: string | React.ReactNode
  dataIndex?: string | ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
}

interface DataTableProps {
  columns: customTableDataProps[]
  data: any[]
  minWidth?: string | undefined
  maxWidth?: string | undefined
  rowClick?: any
  color?: boolean | undefined
  text_color?: boolean | undefined
  loading?: boolean,
}

export default function StudentsDataTable({
  columns,
  loading = false,
  data,
  minWidth,
  maxWidth,
  rowClick,
  color,
  text_color,
}: DataTableProps) {
  const { query } = useRouter()
  const dispatch = useAppDispatch()
  const handleClick = (id: any,item:any) => {
    rowClick?.(id,item)
  }
    useEffect(() => {
        dispatch(fetchDepartmentList())
      
    }, [])

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', padding: '0 5px' }}>
      <Box
        minWidth={minWidth || '200px'}
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
          // maxWidth: maxWidth || null
        }}
      >
        {columns.map((el, i) => (
          <Box key={i} sx={{ textAlign: 'start', flex: el.xs }} pt={'0 !important'} pl={'0 !important'}>
            <Box sx={{ fontSize: 14, fontWeight: 700 }}>{el.title}</Box>
          </Box>
        ))}
      </Box>
      {loading ? (
        <SubLoader />
      ) : data?.length > 0 ? (
        data?.map((item, index) => {
          return (
            <Box
              minWidth={minWidth || '200px'}
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
                // maxWidth: maxWidth || null,
                cursor: 'pointer',
                ':hover': {
                  transition: 'all 0.3s ease',
                  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 0px, rgba(0, 0, 0, 0.23) 0px 0px 5px'
                },
                position: 'relative',
                backgroundColor: color ? item.color?.split?.(',')?.[0] : 'transparent',
                color: text_color ? item.color?.split?.(',')?.[1] : ''
              }}
            >
              {columns.map((el: any, i) => (
                <Box
                  key={i}
                  sx={{ textAlign: 'start', flex: el.xs, pb: '5px' }}
                  pt={'5px !important'}
                  pl={'0 !important'}
                >
                  <Box sx={{ fontSize: 12, fontWeight: 500 }}>
                    {el.render
                      ? el.render(el.dataIndex === 'index' ? index + 1 : item[`${el.dataIndex}`])
                      : el.renderItem
                      ? el.renderItem(item)
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
                  sx={{ width: '75%', zIndex: 1, height: '36px', position: 'absolute' }}
                  onClick={() => handleClick(item.id,item)}
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
