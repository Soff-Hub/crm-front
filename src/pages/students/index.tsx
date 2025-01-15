import {
  Box,
  Button,
  Chip,
  MenuItem,
  Pagination,
  Select,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material'


import { ReactNode, useContext, useEffect, useState } from 'react'
import DataTable from 'src/@core/components/table'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import StudentsFilter from 'src/views/apps/students/StudentsFilter'
import CreateStudentModal from 'src/views/apps/students/CreateStudentModal'
import EditStudentModal from 'src/views/apps/students/EditStudentModal'
import StudentRowOptions from 'src/views/apps/students/StudentRowOptions'
import { useAppDispatch, useAppSelector } from 'src/store'
import { clearStudentParams, fetchStudentsList, setStudentId, updateStudentParams } from 'src/store/apps/students'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { setOpenEdit } from 'src/store/apps/students';
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import useResponsive from 'src/@core/hooks/useResponsive'
import IconifyIcon from 'src/@core/components/icon'

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: any) => any | undefined
}

export default function GroupsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { students, isLoading, studentsCount, queryParams,total_debts } = useAppSelector(state => state.students)
  const [page, setPage] = useState<number>(queryParams.page ? Number(queryParams.page) - 1 : 1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(() => Number(localStorage.getItem('rowsPerPage')) || 10)

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index',
      render: index => {
        return `${Number(queryParams?.offset || 0) + Number(index)}`
      }
    },
    {
      xs: 1.4,
      title: t('first_name'),
      dataIndex: 'first_name'
    },
    {
      xs: 1.1,
      title: t('Maktab'),
      dataIndex: 'school',
      render: (school) => {
        return (school ? school :"Maktabi yo'q")
      }
    },
    {
      xs: 1.1,
      title: t('phone'),
      dataIndex: 'phone'
    },
    {
      xs: 1.5,
      title: t('Guruhlar'),
      dataIndex: 'student_status',
      render: (
        group: {
          id: number
          group: number
          status: string
          group_name: string
          lesson_time: string
        }[]
      ) =>
        group.length > 0 ? (
          group.map((item, i) => (
            <Box fontSize={12} key={i} sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              {item.lesson_time} {' - '}
              {item.group_name}
              <Chip
                label={t(item.status)}
                size='small'
                variant='outlined'
                color={
                  item.status === 'active'
                    ? 'success'
                    : item.status === 'archive'
                    ? 'error'
                    : item.status === 'frozen'
                    ? 'secondary'
                    : 'warning'
                }
              />
            </Box>
          ))
        ) : (
          <Chip label='Guruhsiz' color='warning' variant='outlined' size='small' sx={{ fontWeight: 700 }} />
        )
    },
    {
      xs: 1.3,
      title: t("O'qituvchilari"),
      dataIndex: 'group',
      render: (
        group: {
          teacher: {
            id: number | string
            first_name: string
            phone: string
          }
        }[]
      ) =>
        group.map(item => (
          <Typography fontSize={12} key={item.teacher.id}>
            {item.teacher.first_name}
          </Typography>
        ))
    },
    {
      xs: 0.7,
      title: t('Balans'),
      dataIndex: 'balance',
      render: (balance: string) =>
        Number(balance) < 0 ? (
          <Chip
            label={`${formatCurrency(+balance)} so'm`}
            color='error'
            variant='outlined'
            size='small'
            sx={{ fontWeight: 700 }}
          />
        ) : (
          `${formatCurrency(+balance)} so'm`
        )
    },
    {
      xs: 0.8,
      dataIndex: 'id',
      title: t('Harakatlar'),
      render: actions => <StudentRowOptions id={actions} />
    }
  ]
  const handleRowsPerPageChange = async (value: number) => {
    const limit = value
    setRowsPerPage(Number(value))
    localStorage.setItem('rowsPerPage', `${value}`)

    dispatch(updateStudentParams({ limit: value }))
    await dispatch(fetchStudentsList({ ...queryParams, limit: `${value}`, offset: `0` }))
    setPage(0)
  }

  const handlePagination = async (page: string | number) => {
    const adjustedPage: any = (Number(page) - 1) * rowsPerPage
    setPage(Number(page))

    await dispatch(fetchStudentsList({ ...queryParams, limit: String(rowsPerPage), offset: adjustedPage }))
    dispatch(updateStudentParams({ offset: adjustedPage }))
  }

  const pageLoad = async () => {
    if (!queryParams.limit) {
      dispatch(updateStudentParams({ limit: rowsPerPage }))

      await dispatch(fetchStudentsList({ ...queryParams, limit: String(rowsPerPage) }))
    } else {
      await dispatch(fetchStudentsList(queryParams))
    }
  }

  const rowClick = (id: any) => {
    dispatch(setStudentId(id))
    router.push(`/students/view/security?student=${id}`)
  }

  useEffect(() => {
    if (!user?.role.includes('ceo') && !user?.role.includes('admin') && !user?.role.includes('watcher')) {
      router.push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    pageLoad()
    return () => {
      dispatch(setOpenEdit(null))
    }
  }, [])


  

  return (
    <div>
      <VideoHeader item={videoUrls.students} />
      <Box
        className='students-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography variant='h5'>{t("O'quvchilar")}</Typography>
          {!isLoading && <Chip label={`${studentsCount}`} variant='outlined' color='primary' />}
          {!isLoading && queryParams.is_debtor && <Chip label={`${formatCurrency(total_debts)}` + " so'm"} variant='outlined' color='error' />}

        </Box>
        <Button
          onClick={()=>dispatch(setOpenEdit('create'))}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>
      {isMobile && (
        <Button
          size='small'
          sx={{ marginLeft: 'auto', width: '100%' }}
          variant='outlined'
          onClick={() => setOpen(true)}
        >
          {t('Filterlash')}
        </Button>
      )}
      {!isMobile && <StudentsFilter  isMobile={isMobile} />}
      <DataTable
        color
        loading={isLoading}
        columns={columns}
        data={[
          ...students.map(el => ({
            ...el,
            color:
              Number(el.balance) < 0
                ? 'rgba(227, 18, 18, 0.1)'
                : el.payment_status <= 5 && el.payment_status
                ? 'rgba(237, 156, 64, 0.22)'
                : ''
          }))
        ]}
        rowClick={rowClick}
      />
      {studentsCount > 10 && !isLoading && (
        <div className='d-flex'>
          <Pagination
            page={Number(queryParams.offset) ? Number(queryParams.offset) / rowsPerPage + 1 : 1}
            count={Math.ceil(studentsCount / rowsPerPage)}
            variant='outlined'
            shape='rounded'
            onChange={(e: any, page) => handlePagination(page)}
          />
          <Select
            size='small'
            onChange={e => handleRowsPerPageChange(Number(e.target.value))}
            value={rowsPerPage}
            className='page-resize'
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
          </Select>
        </div>
        // <TablePagination
        //   component='div'
        //   count={studentsCount}
        //   page={page}
        //   onPageChange={(e: any, page) => handlePagination(String(page))}
        //   rowsPerPage={rowsPerPage}
        //   onRowsPerPageChange={(e: any) => handleRowsPerPageChange(e)}
        //   rowsPerPageOptions={[5, 10, 25, 50]}
        //   labelDisplayedRows={({ from, to, count }) => {
        //     const adjustedFrom = from === 0 ? 1 : from
        //     const adjustedTo = to === 0 ? 1 : to

        //     return `${adjustedFrom} - ${adjustedTo} of ${count !== -1 ? count : `more than ${adjustedTo}`}`
        //   }}
        // />
      )}
      <CreateStudentModal />
      <EditStudentModal />
      <Dialog fullScreen onClose={() => setOpen(false)} aria-labelledby='full-screen-dialog-title' open={open}>
        <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            {t('Modal title')}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => setOpen(false)}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <StudentsFilter isMobile={isMobile} />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => setOpen(false)}>{t('Davom etish')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
