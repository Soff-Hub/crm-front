"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TextField } from "@mui/material"
import Button from "react-bootstrap/Button"
import "bootstrap/dist/css/bootstrap.min.css"

interface Student {
  id: number
  name: string
  present: boolean
  description: string
}

const initialStudents: Student[] = [
  { id: 1, name: "Alice Johnson", present: false, description: "" },
  { id: 2, name: "Bob Smith", present: false, description: "" },
  { id: 3, name: "Charlie Brown", present: false, description: "" },
  { id: 4, name: "Diana Ross", present: false, description: "" },
  { id: 5, name: "Ethan Hunt", present: false, description: "" },
]

export default function AttendanceTable() {
  const [students, setStudents] = useState<Student[]>(initialStudents)

  const handleAttendanceChange = (id: number, present: boolean) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, present, description: present ? "" : student.description } : student,
      ),
    )
  }

  const handleDescriptionChange = (id: number, description: string) => {
    setStudents(students.map((student) => (student.id === id ? { ...student, description } : student)))
  }

  const handleSave = () => {
    console.log("Saving attendance:", students)
  }

  return (
    <div className="container mt-4">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Student Name</b></TableCell>
              <TableCell><b>Present</b></TableCell>
              <TableCell><b>Description (if absent)</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={student.present}
                    onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Reason for absence"
                    value={student.description}
                    onChange={(e) => handleDescriptionChange(student.id, e.target.value)}
                    disabled={student.present}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="text-center mt-4">
        <Button variant="primary" onClick={handleSave}>
          Save Attendance
        </Button>
      </div>
    </div>
  )
}
