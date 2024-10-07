//@ts-nocheck
import {
  Box,
  Button,
  Pagination,
  Typography
} from '@mui/material';
import { ReactNode, useContext, useEffect } from 'react';
import IconifyIcon from 'src/@core/components/icon';
import DataTable from 'src/@core/components/table';
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchCoursesList, setOpenCreateSms, updateParams } from 'src/store/apps/settings';
import CourseListRowOptions from 'src/views/apps/settings/courses/CourseListRowOptions';
import CreateCourseDialog from 'src/views/apps/settings/courses/CreateCourseDialog';
import EditCourseDialog from 'src/views/apps/settings/courses/EditCourseDialog';
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header';
import { toast } from 'react-hot-toast';
import { AuthContext } from 'src/context/AuthContext';
import { useRouter } from 'next/router';

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}

export const CustomeDrawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))


export function addPeriodToThousands(number: any) {
  const numStr = String(number)

  const [integerPart, decimalPart] = numStr.split('.')

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  const formattedNumber = decimalPart !== undefined ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart

  return formattedNumber
}

export default function GroupsPage() {
  const { t } = useTranslation()
  const { push } = useRouter()
  const { user } = useContext(AuthContext)

  const dispatch = useAppDispatch()
  const { course_list, is_pending, courseQueryParams } = useAppSelector(state => state.settings)

  useEffect(() => {
    if (!user?.role.includes('ceo') && !user?.role.includes('admin')) {
      push("/")
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    const queryString = new URLSearchParams(courseQueryParams).toString()
    dispatch(fetchCoursesList(queryString))
    return () => {
      dispatch(updateParams({ page: 1 }))
    }
  }, [])

  const columns: customTableProps[] = [
    {
      xs: 1,
      title: t('Kurslar'),
      dataIndex: 'name'
    },
    {
      xs: 1.2,
      title: t('Izoh'),
      dataIndex: 'description'
    },
    {
      xs: 0.8,
      title: t('Kurs narxi'),
      dataIndex: 'price',
      render: text => addPeriodToThousands(Number(text) + ' ' + "so'm")
    },
    {
      xs: 1,
      title: t('Filial'),
      dataIndex: 'branch',
      render: (branch: any) => {
        if (branch?.length > 1) {
          return branch?.map((item: any) => <span key={item.id}> {item?.name}, </span>)
        } else {
          return branch?.map((item: any) => <span key={item.id}> {item?.name} </span>)
        }
      }
    },
    {
      xs: 1.5,
      title: t('Kurs davomiyligi (oy)'),
      dataIndex: 'month_duration',
      render: month => <span>{month} oy</span>
    },
    {
      xs: 1,
      title: t('Harakatlar'),
      dataIndex: 'id',
      render: id => <CourseListRowOptions id={+id} />
    }
  ]
  const handlePagination = (page: any) => {
    const queryString = new URLSearchParams({ ...courseQueryParams, page: page }).toString()
    dispatch(fetchCoursesList(queryString))
    dispatch(updateParams({ page }))
  }
  return (
    <div>
      <VideoHeader item={videoUrls.courses} />

      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t('Kurslar')}</Typography>
        <Button
          onClick={() => dispatch(setOpenCreateSms(true))}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi kurs qo'shish")}
        </Button>
      </Box>
      <DataTable loading={is_pending} columns={columns} data={course_list?.results} color />
      {Math.ceil(course_list?.count / 10) > 1 && !is_pending && <Pagination defaultPage={courseQueryParams.page ? Number(courseQueryParams.page) : 1} count={Math.ceil(course_list?.count / 10)} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(page)} />}
      <CreateCourseDialog />

      <EditCourseDialog />
    </div>
  )
}
