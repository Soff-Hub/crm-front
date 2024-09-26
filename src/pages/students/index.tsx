import {
  Box,
  Chip,
  Pagination,
  Typography
} from '@mui/material';
import { ReactNode, useEffect } from 'react';
import DataTable from 'src/@core/components/table';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import StudentsPageHeader from 'src/views/apps/students/StudentsPageHeader';
import StudentsFilter from 'src/views/apps/students/StudentsFilter';
import CreateStudentModal from 'src/views/apps/students/CreateStudentModal';
import EditStudentModal from 'src/views/apps/students/EditStudentModal';
import StudentRowOptions from 'src/views/apps/students/StudentRowOptions';
import { useAppDispatch, useAppSelector } from 'src/store';
import { clearStudentParams, fetchStudentsList, updateStudentParams } from 'src/store/apps/students';
import { formatCurrency } from 'src/@core/utils/format-currency';
import { setOpenEdit } from 'src/store/apps/mentors';
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header';

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: any) => any | undefined
}

export default function GroupsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { students, isLoading, studentsCount, queryParams } = useAppSelector(state => state.students)



  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t("ID"),
      dataIndex: 'index'
    },
    {
      xs: 1.4,
      title: t("first_name"),
      dataIndex: 'first_name'
    },
    {
      xs: 1.1,
      title: t("phone"),
      dataIndex: 'phone'
    },
    {
      xs: 1.5,
      title: t("Guruhlar"),
      dataIndex: 'student_status',
      render: (group: {
        id: number,
        group: number,
        status: string,
        group_name: string,
        lesson_time: string
      }[]) => group.length > 0 ? group.map((item, i) => (
        <Box fontSize={12} key={i} sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          {item.lesson_time} {" - "}
          {item.group_name}
          <Chip label={t(item.status)} size="small" variant='outlined' color={item.status === 'active' ? 'success' : item.status === 'archive' ? 'error' : item.status === 'frozen' ? 'secondary' : 'warning'} />
        </Box>
      )) : <Chip label="Guruhsiz" color="warning" variant='outlined' size='small' sx={{ fontWeight: 700 }} />
    },
    {
      xs: 1.3,
      title: t("O'qituvchilari"),
      dataIndex: 'group',
      render: (group: {
        teacher: {
          id: number | string
          first_name: string
          phone: string
        }
      }[]) => group.map((item) => (
        <Typography fontSize={12} key={item.teacher.id}>
          {item.teacher.first_name}
        </Typography>
      ))
    },
    {
      xs: 0.7,
      title: t("Balans"),
      dataIndex: 'balance',
      render: (balance: string) => Number(balance) < 0 ? <Chip label={`${formatCurrency(+balance)} so'm`} color="error" variant='outlined' size='small' sx={{ fontWeight: 700 }} /> : `${formatCurrency(+balance)} so'm`
    },
    {
      xs: 0.8,
      dataIndex: 'id',
      title: t("Harakatlar"),
      render: actions => <StudentRowOptions id={actions} />
    }
  ]

  const handlePagination = (page: any) => {
    dispatch(fetchStudentsList({ ...queryParams, page }))
    dispatch(updateStudentParams({ page }))
  }

  const rowClick = (id: any) => {
    router.push(`/students/view/security?student=${id}`)
  }

  useEffect(() => {
    return () => {
      dispatch(setOpenEdit(null))
      dispatch(clearStudentParams())
    }
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.students} />
      <StudentsPageHeader />
      <StudentsFilter />
      <DataTable color loading={isLoading} columns={columns} data={[...students.map(el => ({ ...el, color: Number(el.balance) < 0 ? 'rgba(227, 18, 18, 0.1)' : el.payment_status <= 5 && el.payment_status ? 'rgba(237, 156, 64, 0.22)' : '' }))]} rowClick={rowClick} />
      {studentsCount > 10 && !isLoading && <Pagination defaultPage={queryParams?.page || 1} count={Math.ceil(studentsCount / 10)} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(page)} />}
      <CreateStudentModal />
      <EditStudentModal />
    </div >
  )
}
