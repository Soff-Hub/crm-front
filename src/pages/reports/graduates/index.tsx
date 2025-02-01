import { Box, Typography, Checkbox, Pagination } from '@mui/material'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from 'src/@core/components/table'

export interface customTableProps {
  xs: number
  title: string | React.ReactNode
  dataIndex?: string | React.ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
  renderSource?: (source: any, item: any) => any | undefined
}

export default function GraduatesPage() {
  const { t } = useTranslation()

  // State to hold the data with the updated `is_awarded` status
  const [graduatesData, setGraduatesData] = useState([
    {
      id: 1,
      name: 'John Doe',
      group: 'Group A',
      end_date: '2025-06-15',
      is_awarded: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      group: 'Group B',
      end_date: '2024-12-20',
      is_awarded: false
    },
    {
      id: 3,
      name: 'Mark Wilson',
      group: 'Group A',
      end_date: '2025-03-30',
      is_awarded: true
    },
    {
      id: 4,
      name: 'Emily Davis',
      group: 'Group C',
      end_date: '2024-08-19',
      is_awarded: false
    }
  ])

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const columns: customTableProps[] = [
    {
      title: 'Ism',
      dataIndex: 'name',
      xs: 3
    },
    {
      title: 'Guruhi',
      dataIndex: 'group',
      xs: 3
    },
    {
      title: 'Tugatkan sanasi',
      dataIndex: 'end_date',
      render: (end_date: string) => {
        return <span>{end_date}</span>
      },
      xs: 2
    },
    {
      title: 'Taqdirlangan',
      dataIndex: 'is_awarded',
      renderSource: (is_awarded: boolean, item: any) => {
          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log(event.target.checked);
            
          const updatedData = graduatesData.map(graduate =>
            graduate.id === item.id ? { ...graduate, is_awarded: event.target.checked } : graduate
          )
          setGraduatesData(updatedData)
        }

        return <Checkbox checked={is_awarded == true ? true : false} onChange={handleChange} color='primary' />
      },
      xs: 2
    }
  ]

  console.log(graduatesData)

  // Slice the data according to pagination
  const paginatedData = graduatesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography variant='h5'>{t('Bitiruvchilar')}</Typography>
        </Box>
      </Box>

      <DataTable columns={columns} data={paginatedData} loading={false} minWidth='1200px' maxWidth='1500px' />

      {/* Pagination controls */}
      <Pagination
        count={Math.ceil(graduatesData.length / rowsPerPage)} // Total number of pages
        page={page}
        onChange={handleChangePage}
        color='primary'
        shape='rounded'
      />
    </div>
  )
}
