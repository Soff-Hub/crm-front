import {
  Box,
  Button,
  Pagination,
  Typography,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import IconifyIcon from 'src/@core/components/icon';
import DataTable from 'src/@core/components/table';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import RowOptions from 'src/views/apps/mentors/RowOptions';
import { TeacherAvatar } from 'src/views/apps/mentors/AddMentorsModal';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchTeachersList, setOpenEdit } from 'src/store/apps/mentors';
import TeacherEditDialog from 'src/views/apps/mentors/TeacherEditDialog';
import TeacherCreateDialog from 'src/views/apps/mentors/TeacherCreateDialog';

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}

export default function GroupsPage() {

  // ** Hooks
  const { t } = useTranslation()
  const { push } = useRouter()
  const dispatch = useAppDispatch()

  // Stored Data
  const { teachers, teachersCount, isLoading } = useAppSelector(state => state.mentors)
  const [page, setPage] = useState(1)

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t("ID"),
      dataIndex: 'index'
    },
    {
      xs: 0.4,
      title: t('Rasmi'),
      dataIndex: 'image',
      render: (actions) => <TeacherAvatar skin='light' color={'info'} variant='rounded' sx={{ width: 33, height: 33 }}
      >{
          actions ? <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={actions} alt="user" /> :
            <IconifyIcon icon={'et:profile-male'} />
        }
      </TeacherAvatar>

    },
    {
      xs: 1.7,
      title: t("first_name"),
      dataIndex: 'first_name'
    },
    {
      xs: 1.7,
      title: t("phone"),
      dataIndex: 'phone'
    },
    {
      xs: 1.7,
      title: "Doimiy oylik",
      dataIndex: 'amount'
    },
    {
      xs: 1.7,
      title: "KPI asosida(%)",
      dataIndex: 'percentage'
    },
    {
      xs: 1.7,
      title: t("birth_date"),
      dataIndex: 'birth_date'
    },
    {
      xs: 0.4,
      dataIndex: 'id',
      title: t("Harakatlar"),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const rowClick = (id: any) => {
    push(`/mentors/view/security?id=${id}`)
  }

  useEffect(() => {
    dispatch(fetchTeachersList(""))

    return () => {
      dispatch(setOpenEdit(null))
    }
  }, [])

  const handlePagination = async (page: number) => {
    setPage(page)
    await dispatch(fetchTeachersList(new URLSearchParams({ page: String(page) }).toString()))
  }


  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t("Mentorlar")}</Typography>
        <Button
          onClick={() => dispatch(setOpenEdit('create'))}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>
      <DataTable loading={isLoading} columns={columns} data={teachers} rowClick={rowClick} />
      {teachersCount > 1 && !isLoading && <Pagination
        defaultPage={page}
        // page={page}
        count={teachersCount}
        variant="outlined"
        shape="rounded"
        onChange={(e: any, page) => handlePagination(e.target.value + page)}
      />}

      <TeacherCreateDialog />
      <TeacherEditDialog />
    </div>
  )
}
