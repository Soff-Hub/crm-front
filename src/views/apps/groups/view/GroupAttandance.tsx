'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import { DatePicker } from '@mui/lab'
import dayjs from 'dayjs'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'

interface Student {
  id: number
  name: string
  attendance: 'attend' | 'not_come' | null
  description: string
  grade: string
}

export default function AttendanceTable({ attendance }: any) {
  const [students, setStudents] = useState(attendance)
  
  const handleAttendanceChange = async (data: {
    id: number
    is_available: string
    group: string | number
    date: any
  }) => {
    const payload = {
      ...data,
      is_available: data.is_available === 'attend' ? true : data.is_available === 'not_come' ? false : null
    }
    
   setStudents(students.students)
    await api
      .patch(`common/attendance/update/${data?.id}/`, payload)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        toast.error(err.response?.data.msg?.[0] || "Saqlab bo'lmadi qayta urinib ko'ring")
      })
  }

  // const handleDescriptionChange = (id: number, description: string) => {
  //   setStudents(students.map(student => (student.id === id ? { ...student, description } : student)))
  // }

  // const handleGradeChange = (id: number, grade: string) => {
  //   setStudents(students.map(student => (student.id === id ? { ...student, grade } : student)))
  // }

  // const handleSave = () => {
  //   console.log('Saving attendance:', students)
  // }

  return (
    <div className='container mt-4'>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Ism</b>
              </TableCell>
              <TableCell>
                <b>Davomati</b>
              </TableCell>
              <TableCell>
                <b>Izoh (kelmagan bo'lsa)</b>
              </TableCell>
              <TableCell>
                <b>Baho</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.students.map((student: any) => (
              <TableRow key={student.id}>
                <TableCell>{student.first_name}</TableCell>
                <TableCell>
                  <FormControl fullWidth size='small'>
                    <InputLabel id={`attendance-label-${student.id}`}>Davomat</InputLabel>
                    <Select
                      labelId={`attendance-label-${student.id}`}
                      value={
                        student.attendance[0]?.is_available
                          ? 'attend'
                          : student.attendance[0]?.is_available === false
                          ? 'not_come'
                          : ''
                      }
                      label='Davomat'
                      onChange={e =>
                        handleAttendanceChange({
                          id: student.attendance[0]?.id,
                          is_available: e.target.value,
                          group: student.attendance[0]?.group,
                          date: student.attendance[0]?.date
                        })
                      }
                    >
                      <MenuItem value='attend'>Keldi</MenuItem>
                      <MenuItem value='not_come'>Kelmagan</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    placeholder='Kelmagani uchun izoh'
                    value={student.attendance.description}
                    // onChange={e => handleDescriptionChange(student.id, e.target.value)}
                    disabled={student.attendance.is_available == 'attend'}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    placeholder='Baho kiriting'
                    value={student.grade}
                    // onChange={e => handleGradeChange(student.id, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='text-center mt-4'>
        <Button variant='primary'>Davomatni saqlash</Button>
      </div>
    </div>
  )
}
