import {
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
      xs: 1.3,
      title: t("Guruhlar"),
      dataIndex: 'group',
      render: (group: {
        group_data: {
          id: number
          name: string
        }
        start_at: string
      }[]) => group.map((item, i) => (
        <Typography fontSize={12} key={i}>
          {item.start_at} {" - "}
          {item.group_data.name}
        </Typography>
      ))
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
      render: (balance: string) => `${+balance} so'm`
    },
    {
      xs: 0.7,
      title: t("Status"),
      dataIndex: 'status',
      render: (status: string) => <Chip label={t(status)} size="small" variant='outlined' color={status === 'active' ? 'success' : status === 'archive' ? 'error' : 'warning'} />
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
    dispatch(fetchStudentsList(queryParams))


    return () => {
      dispatch(clearStudentParams(null))
    }
  }, [])



  return (
    <div>
      <StudentsPageHeader />

      <StudentsFilter />

      <DataTable loading={isLoading} columns={columns} data={students} rowClick={rowClick} />
      {studentsCount > 10 && !isLoading && <Pagination defaultPage={queryParams?.page || 1} count={Math.ceil(studentsCount / 10)} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(page)} />}

      <CreateStudentModal />
      <EditStudentModal />
    </div >
  )
}
