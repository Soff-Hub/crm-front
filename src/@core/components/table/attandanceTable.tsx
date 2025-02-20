import { useState } from 'react'
import { Box, Collapse } from '@mui/material'
import { useRouter } from 'next/router'
import { Placeholder } from 'react-bootstrap'
import EmptyContent from '../empty-content'

export interface customTableDataProps {
  xs: number
  title: string | React.ReactNode
  dataIndex?: string | React.ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
  renderSource?: (source: any, item: any) => any | undefined
}

interface DataTableProps {
  columns: customTableDataProps[]
  data: any[]
  minWidth?: string | undefined
  maxWidth?: string | undefined
  rowClick?: any
  color?: boolean | undefined
  text_color?: boolean | undefined
  loading?: boolean
}

export default function DataTable({
  columns,
  loading = false,
  data,
  minWidth,
  maxWidth,
  rowClick,
  color,
  text_color
}: DataTableProps) {
  const { query } = useRouter()
  const router = useRouter()

  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const handleClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
    rowClick?.(id)
  }

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', padding: '0 5px' }}>
      {/* Table Header */}
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
          <Box key={i} sx={{ textAlign: 'start', flex: el.xs }}>
            <Box sx={{ fontSize: 14, fontWeight: 700 }}>
              {loading ? (
                <Placeholder as='span' animation='glow' style={{ width: '100px', height: '20px' }} />
              ) : (
                el.title
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Table Body */}
      {loading ? (
        <div>
          {[...Array(5)].map((_, index) => (
            <Box
              minWidth={minWidth || '1200px'}
              key={index}
              my={2}
              sx={{
                padding: '15px 15px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                maxWidth: maxWidth || null
              }}
            >
              {columns.map((el: any, i) => (
                <Box key={i} sx={{ textAlign: 'start', flex: el.xs }}>
                  <Placeholder as='span' animation='glow' style={{ width: '100%', height: '20px' }} />
                </Box>
              ))}
            </Box>
          ))}
        </div>
      ) : data?.length > 0 ? (
        data?.map((item, index) => {
          return (
            <Box key={index} minWidth={minWidth || '1200px'} my={2}>
              {/* Row Item */}
              <Box
                sx={{
                  padding: '5px 10px',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  maxWidth: maxWidth || null,
                  cursor: 'pointer',
                  backgroundColor: expandedRow === item.id ? '#f5f5f5' : 'transparent'
                }}
                onClick={() => handleClick(item.id)}
              >
                {columns.map((el: any, i) => (
                  <Box key={i} sx={{ textAlign: 'start', flex: el.xs }}>
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
                            query.page && Number(query.page) > 1
                              ? (Number(query?.page) - 1) * 10 + index + 1
                              : 1 + index
                          }`
                        : item[`${el.dataIndex}`] || '—'}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Expandable Row */}
              <Collapse in={expandedRow === item.id}>
                <Box
                  sx={{
                    padding: '10px 15px',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    borderBottom: '1px solid #ddd',
                    marginTop: '5px',
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'
                  }}
                >
                  {item?.students.length ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: '40px 1fr 2fr', border: '1px solid #ddd' }}>
                      {/* Table Header */}
                      <Box
                        sx={{ fontWeight: 600, padding: '5px', background: '#e0e0e0', borderBottom: '1px solid #ddd' }}
                      >
                        #
                      </Box>
                      <Box
                        sx={{
                          fontWeight: 500,
                          fontSize: 15,
                          padding: '5px',
                          background: '#e0e0e0',
                          borderBottom: '1px solid #ddd'
                        }}
                      >
                        Ism
                      </Box>
                      <Box
                        sx={{
                          fontWeight: 600,
                          fontSize: 15,
                          padding: '5px',
                          background: '#e0e0e0',
                          borderBottom: '1px solid #ddd'
                        }}
                      >
                        Izoh
                      </Box>

                      {/* Table Body */}
                      {item.students.map((student: any, idx: number) => (
                        <>
                          <Box
                            key={`index-${idx}`}
                            sx={{
                              fontSize: 12,
                              padding: '5px',
                              borderBottom: '1px solid #ddd',
                              textAlign: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={() => router.push(`/students/view/security?student=${student?.student_id}`)}
                          >
                            {idx + 1}
                          </Box>
                          <Box
                            fontSize={13}
                            key={`name-${idx}`}
                            sx={{
                              padding: '5px',
                              borderBottom: '1px solid #ddd',
                              cursor: 'pointer'
                            }}
                            onClick={() => router.push(`/students/view/security?student=${student?.student_id}`)}
                          >
                            {student.first_name}
                          </Box>
                          <Box
                            
                            key={`desc-${idx}`}
                            sx={{
                              fontSize:13,
                              padding: '5px',
                              borderBottom: '1px solid #ddd',
                              cursor: 'pointer'
                            }}
                            onClick={() => router.push(`/students/view/security?student=${student?.student_id}`)}
                          >
                            {student.description || "Izoh yo'q"}
                          </Box>
                        </>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ fontSize: 12, color: 'gray' }}>O'quvchi yo'q.</Box>
                  )}
                </Box>
              </Collapse>
            </Box>
          )
        })
      ) : (
        <EmptyContent />
      )}
    </div>
  )
}
