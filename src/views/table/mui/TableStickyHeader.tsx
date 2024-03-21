// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

interface Column {
  id: 'student_count' | 'student_amount' | 'group' | 'date_interval' | 'all'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'student_count', label: "O'quvchi soni", minWidth: 170 },
  { id: 'student_amount', label: 'Har biri uchun', minWidth: 100 },
  {
    id: 'group',
    label: 'Guruhi',
    minWidth: 170,
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'date_interval',
    label: "Sana oralig'i",
    minWidth: 170,
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'all',
    label: 'Umumiy summa',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2)
  }
]

interface Data {
  student_count: string
  student_amount: string
  group: string
  date_interval: string
  all: string
}

function createData(student_count: string, student_amount: string, group: string, date_interval: string, all: string): Data {

  return { student_count, student_amount, group, date_interval, all }
}

const rows = [
  createData('6 ta', '300 000', 'Frontend 030', '12.03.2024 / 12.04.2024', '1 200 000'),
]

const TableStickyHeader = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.group}>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default TableStickyHeader
