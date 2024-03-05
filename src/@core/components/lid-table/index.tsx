import { Box } from '@mui/material'
import React, { ReactNode } from 'react'

export interface customTableDataProps {
    xs: number
    title: string
    dataIndex?: string | ReactNode
    render?: (source: string) => any | undefined
}

interface DataTableProps {
    columns: customTableDataProps[]
    data: any[]
    minWidth?: string | undefined
    maxWidth?: string | undefined
}


export default function LidTable({ columns, data, minWidth, maxWidth }: DataTableProps) {

    return (
        <div style={{ maxWidth: '100%', overflowX: 'scroll', padding: '0 5px' }}>
            <Box
                minWidth={minWidth || '1200px'}
                my={2}
                sx={{
                    padding: '10px 10px',
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
                        <Box sx={{ fontSize: 14, fontWeight: 700 }}>{el.title}</Box>
                    </Box>
                ))}
            </Box>
            {data.map((item, index) => {
                return (
                    <Box
                        minWidth={minWidth || '1200px'}
                        key={index}
                        my={1}
                        id='context-menu'
                        sx={{
                            padding: '10px',
                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%',
                            maxWidth: maxWidth || null,
                            cursor: 'pointer',
                            ':hover': {
                                transition: 'all 0.3s ease',
                                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 0px, rgba(0, 0, 0, 0.23) 0px 0px 5px'
                            }
                        }}
                    >
                        {columns.map((el, i) => (
                            <div key={i} style={{ textAlign: 'start', flex: el.xs }}>
                                <Box sx={{ fontSize: 14 }}>
                                    {el.render ? el.render(item[`${el.dataIndex}`]) : item[`${el.dataIndex}`]}
                                </Box>
                            </div>
                        ))}
                    </Box>
                )
            })}
        </div>
    )
}
