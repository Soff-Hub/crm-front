import {
  Box,
  Button,
  IconButton,
  Pagination,
  Typography,
} from '@mui/material';
import { ReactNode, useEffect } from 'react';
import IconifyIcon from 'src/@core/components/icon';
import DataTable from 'src/@core/components/table';
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import RowOptions from 'src/views/apps/mentors/RowOptions';
import AddMentorsModal, { TeacherAvatar } from 'src/views/apps/mentors/AddMentorsModal';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchTeachersList, setOpenEdit, setTeacherData } from 'src/store/apps/mentors';
import EditTeacherModal from 'src/views/apps/mentors/EditTeacherModal';
import SubLoader from 'src/views/apps/loaders/SubLoader';

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
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


export default function GroupsPage() {

  // ** Hooks
  const { t } = useTranslation()
  const { push } = useRouter()
  const dispatch = useAppDispatch()

  // Stored Data
  const { teachers, teachersCount, openEdit, teacherData, isLoading } = useAppSelector(state => state.mentors)

  // ** Main functions
  const onClose = () => {
    dispatch(setOpenEdit(null))
  }

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t("ID"),
      dataIndex: 'index'
    },
    {
      xs: 0.4,
      title: t('Image'),
      dataIndex: 'index',
      render: () => <TeacherAvatar skin='light' color={'info'} variant='rounded' sx={{ width: 33, height: 33 }}>
        <IconifyIcon icon={'et:profile-male'} />
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
    dispatch(fetchTeachersList())

    return () => {
      dispatch(setOpenEdit(null))
    }
  }, [])

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
      {teachersCount > 1 && <Pagination defaultPage={1} count={teachersCount} variant="outlined" shape="rounded" />}

      <Drawer open={openEdit === 'create'} hideBackdrop anchor='right' variant='persistent' onClose={onClose}>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t("O'qituvchi qo'shish")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <IconifyIcon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
        <AddMentorsModal />
      </Drawer>

      <Drawer open={openEdit === 'edit'} hideBackdrop anchor='right' variant='persistent' onClose={onClose}>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t("O'qituvchi malumotlarini tahrirlash")}
          </Typography>
          <IconButton
            onClick={() => (onClose(), dispatch(setTeacherData(undefined)))}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <IconifyIcon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
        <Box width={'100%'}>
          {teacherData ? <EditTeacherModal initialValues={teacherData} /> : <Box marginTop={40}><SubLoader /></Box>}
        </Box>
      </Drawer>
    </div>
  )
}
