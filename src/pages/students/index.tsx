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
import { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import DataTable from 'src/@core/components/table'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import StudentsFilter from 'src/views/apps/students/StudentsFilter'
import CreateStudentModal from 'src/views/apps/students/CreateStudentModal'
import EditStudentModal from 'src/views/apps/students/EditStudentModal'
import StudentRowOptions from 'src/views/apps/students/StudentRowOptions'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentsList, resetStudentsState, setStudentId, updateStudentParams } from 'src/store/apps/students'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { setOpenEdit } from 'src/store/apps/students'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import useResponsive from 'src/@core/hooks/useResponsive'
import IconifyIcon from 'src/@core/components/icon'
import ExcelStudents from 'src/@core/components/excelButton/ExcelStudents'
import { TeacherAvatar } from 'src/views/apps/mentors/AddMentorsModal'

export type customTableProps = {
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
  const { students, isLoading, studentsCount, queryParams, total_debts } = useAppSelector(state => state.students)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const queryString = new URLSearchParams({ ...queryParams } as Record<string, string>).toString()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index',
      render: index => `${Number(queryParams?.offset || 0) + Number(index)}`
    },
    {
      xs: 0.4,
      title: t('Rasm'),
      dataIndex: 'image',
      render: actions => (
        <TeacherAvatar skin='light' color={'info'} variant='rounded' sx={{ width: 33, height: 33 }}>
          {actions ? (
            <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={actions} alt='user' />
          ) : (
            <IconifyIcon icon={'et:profile-male'} />
          )}
        </TeacherAvatar>
      )
    },
    {
      xs: 1.4,
      title: t('first_name'),
      dataIndex: 'first_name'
    },
    {
      xs: 1.1,
      title: t('Baho'),
      dataIndex: 'gpa',
      render: gpa => {
        return gpa ? (
          <Chip
            sx={{
              color: Number(gpa) >= 4 ? 'green' : Number(gpa) >= 3 ? 'orange' : 'red',
              borderColor: Number(gpa) >= 4 ? 'green' : Number(gpa) >= 3 ? 'orange' : 'red'
            }}
            variant='outlined'
            color='info'
            label={gpa}
          />
        ) : (
          "Bahosi yo'q"
        )
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
          teacher_name: string
        }[]
      ) =>
        group.length > 0 ? (
          group.map((item, i) => (
            <Box fontSize={12} key={i} sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              {`${item.lesson_time} - ${item.group_name} - ${item.teacher_name}`}
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
          <Chip
            label={`${formatCurrency(+balance)} so'm`}
            color='success'
            variant='outlined'
            size='small'
            sx={{ fontWeight: 700 }}
          />
        )
    },
    {
      xs: 0.8,
      dataIndex: 'id',
      title: t('Harakatlar'),
      render: actions => <StudentRowOptions id={actions} />
    }
  ]

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Tanlangan fayl:', file)
      // Fayl yuklash funksiyasini shu yerda ishlatish mumkin
    }
  }

  const handleRowsPerPageChange = async (value: number) => {
    setRowsPerPage(value)

    dispatch(updateStudentParams({ limit: value, offset: 0 }))
    await dispatch(fetchStudentsList({ ...queryParams, limit: String(value), offset: '0' }))
  }

  const handlePagination = async (page: string | number) => {
    const adjustedPage: any = (Number(page) - 1) * rowsPerPage
    await dispatch(fetchStudentsList({ ...queryParams, limit: String(rowsPerPage), offset: adjustedPage }))
    dispatch(updateStudentParams({ offset: adjustedPage }))
  }

  const rowClick = (id: any) => {
    dispatch(setStudentId(id))
    router.push(`/students/view/security?student=${id}`)
  }

  useEffect(() => {
    const initialize = async () => {
      if (!user?.role.includes('ceo') && !user?.role.includes('admin') && !user?.role.includes('watcher')) {
        router.push('/')
        toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
        return
      }

      const initialParams = {
        ...queryParams,
        offset: '0',
        limit: String(rowsPerPage)
      }

      dispatch(updateStudentParams({ offset: 0, limit: rowsPerPage }))
      await dispatch(fetchStudentsList(initialParams))
    }

    initialize()

    return () => {
      dispatch(resetStudentsState())
      dispatch(updateStudentParams({ offset: 0 }))
      dispatch(setOpenEdit(null))
    }
  }, [])

  useEffect(() => {
    const resetPagination = async () => {
      dispatch(updateStudentParams({ offset: 0 }))
      await dispatch(fetchStudentsList({ ...queryParams, limit: String(rowsPerPage), offset: '0' }))
    }

    resetPagination()

    return () => {
      dispatch(updateStudentParams({ offset: 0 }))
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
          {!isLoading && queryParams.is_debtor && (
            <Chip label={`${formatCurrency(total_debts)}` + " so'm"} variant='outlined' color='error' />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* <>
            <input type='file' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
            <Button onClick={handleClick} variant='outlined' size='small'>
              {t("O'quvchilarni import qilish")}
            </Button>
          </> */}
          <Button
            onClick={() => dispatch(setOpenEdit('create'))}
            variant='contained'
            size='small'
            startIcon={<IconifyIcon icon='ic:baseline-plus' />}
          >
            {t("Yangi qo'shish")}
          </Button>
        </Box>
      </Box>

      {isMobile && (
        <Box>
          <Button
            size='small'
            sx={{ marginLeft: 'auto', width: '100%', marginBottom: 2 }}
            variant='outlined'
            onClick={() => setOpen(true)}
          >
            {t('Filterlash')}
          </Button>
          <ExcelStudents size='small' url='/student/offset-list/' queryString={queryString} />
        </Box>
      )}

      {!isMobile && <StudentsFilter isMobile={isMobile} />}

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
          </Select>
        </div>
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
