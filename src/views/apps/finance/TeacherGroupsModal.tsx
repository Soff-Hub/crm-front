import {
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Typography
} from '@mui/material'
import EmptyContent from 'src/@core/components/empty-content'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setCalculatedSalary } from 'src/store/apps/finance'
import { GroupFinance } from 'src/types/apps/finance'
import { ExpandMore } from '@mui/icons-material'
import { useState } from 'react'
import api from 'src/@core/utils/api'
import { DeleteIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import SubLoader from '../loaders/SubLoader'
import UserSuspendDialog from '../mentors/view/UserSuspendDialog'

const headerStyle = { color: '#000', fontWeight: 'bold' }
const bodyStyle = { borderRight: '1px solid #e2e8f0 !important', padding: '10px !important', textAlign: 'center' }

interface GroupStudentsType {
  allowed_lessons: number
  attended_lessons: number
  condition: number
  date: string
  fines_count: number
  first_name: string
  id: number
  original_amount: number
}

export default function TeacherGroupsModal() {
  const { calculatedSalary } = useAppSelector(state => state.finance)
  const dispatch = useAppDispatch()
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [groupStudents, setGroupStudents] = useState<GroupStudentsType[] | null>(null)
  const { query } = useRouter()
  const [loading, setLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [studentId, setStudentId] = useState<number | null>(null)
  async function getGroupsStudents(id: number) {
    setLoading(true)
    await api
      .get(`finance/calculated-salary/group/${id}/?date=${query?.slug}`)
      .then(res => {
        setGroupStudents(res.data)
      })
      .catch((err: any) => {
        console.log(err)
        toast.error(err.response.data.msg)
      })
    setLoading(false)
  }

  async function handleDelete() {
    if (studentId) {
      await api
        .delete(`finance/calculated-salary/destroy/${studentId}/`)
        .then(res => {
          toast.success("O'quvchi o'chirildi")
          if (openDropdown) {
            getGroupsStudents(openDropdown)
          }
        })
        .catch(err => {
          console.log(err)
          toast.error(err.response.data.msg)
        })
    }
  }

  const toggleDropdown = (id: number) => {
    if (openDropdown !== id) {
      getGroupsStudents(id)
    }

    setOpenDropdown(openDropdown === id ? null : id)
  }

  return (
    <Modal
      open={!!calculatedSalary}
      onClose={() => {
        dispatch(setCalculatedSalary(null)), setOpenDropdown(null)
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          minWidth: 800,
          maxWidth: '90%'
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
            <TableHead sx={{ padding: '10px 0' }}>
              <TableRow>
                <TableCell sx={headerStyle}>Guruhi</TableCell>
                <TableCell sx={headerStyle}>O'quvchilar soni</TableCell>
                <TableCell sx={headerStyle}>Darslar soni</TableCell>
                <TableCell sx={headerStyle}>O'tilgan darslar soni</TableCell>
                <TableCell sx={headerStyle}>Jarimalar soni</TableCell>
                <TableCell sx={headerStyle}>Kurs narxi</TableCell>
                <TableCell sx={headerStyle}>O'quvchilardan to'lov</TableCell>
                <TableCell sx={headerStyle}>O'qituvchi ulushi</TableCell>
                <TableCell sx={headerStyle}>Hisoblangan sana</TableCell>
                <TableCell sx={headerStyle}></TableCell>
              </TableRow>
            </TableHead>
            {calculatedSalary?.length ? (
              <TableBody>
                {calculatedSalary?.map((item: GroupFinance, index: number) => (
                  <>
                    <TableRow
                      key={index}
                      onClick={() => toggleDropdown(item?.obj_id)}
                      sx={{ '&:last-child td, &:last-child th': { border: 0, padding: '10px 0' } }}
                    >
                      <TableCell sx={bodyStyle}>{item.group_name} </TableCell>
                      <TableCell sx={bodyStyle}>{item.students_count}</TableCell>
                      <TableCell sx={bodyStyle}>{item.allowed_lessons} </TableCell>
                      <TableCell sx={bodyStyle}>{item.attended_lessons} </TableCell>
                      <TableCell sx={bodyStyle}>{item.fines_count}</TableCell>
                      <TableCell sx={bodyStyle}>{formatCurrency(item.course_price)} UZS</TableCell>
                      <TableCell sx={bodyStyle}>{formatCurrency(item.original_amount)} UZS</TableCell>
                      <TableCell sx={bodyStyle}>{formatCurrency(item.condition)} UZS</TableCell>
                      <TableCell sx={bodyStyle}>{item.calculated_date}</TableCell>

                      {item.obj_id && (
                        <TableCell>
                          <IconButton>
                            <ExpandMore className={openDropdown !== item.obj_id ? 'rotate-180' : ''} />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                    {loading ? (
                      <Typography width={'100%'} textAlign={'center'}>
                        Yuklanmoqda...
                      </Typography>
                    ) : openDropdown && groupStudents?.length == 0 ? (
                      <EmptyContent />
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <Collapse in={openDropdown === item?.obj_id} timeout='auto' unmountOnExit>
                            <Table size='small'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Id</TableCell>
                                  <TableCell>FIO</TableCell>
                                  <TableCell>Darslar</TableCell>
                                  <TableCell>Chegirma</TableCell>
                                  <TableCell>To'langan summa</TableCell>
                                  <TableCell>O'qituvchi ulushi</TableCell>
                                  <TableCell>O'chirish</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {groupStudents?.map((student, index) => (
                                  <TableRow key={student.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{student.first_name}</TableCell>
                                    <TableCell>
                                      {student.attended_lessons}/{student.allowed_lessons}
                                    </TableCell>
                                    <TableCell>
                                      {student.fines_count ? `${student.fines_count.toLocaleString()} UZS` : "Yo'q"}
                                    </TableCell>
                                    <TableCell>{student.original_amount.toLocaleString()} UZS</TableCell>
                                    <TableCell>{student.condition.toLocaleString()} UZS</TableCell>
                                    <TableCell>
                                      <IconButton
                                        color='error'
                                        onClick={() => {
                                          setOpenDeleteModal(true), setStudentId(student.id)
                                        }}
                                      >
                                        <TrashIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyContent />
                </TableCell>
              </TableRow>
            )}
          </Table>
        </TableContainer>
        <UserSuspendDialog open={openDeleteModal} setOpen={setOpenDeleteModal} handleOk={handleDelete} />
      </Box>
    </Modal>
  )
}
