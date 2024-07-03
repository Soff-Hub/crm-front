// @ts-nocheck

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Typography,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import IconifyIcon from 'src/@core/components/icon';
import DataTable from 'src/@core/components/table';
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { GroupsFilter } from 'src/views/apps/groups/GroupsFilter';
import useResponsive from 'src/@core/hooks/useResponsive';
import getMontName from 'src/@core/utils/gwt-month-name';
import getLessonDays from 'src/@core/utils/getLessonDays';
import RowOptions from 'src/views/apps/groups/RowOptions';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  fetchGroups,
  getDashboardLessons,
  getMetaData,
  handleOpenAddModal,
  updateParams,
} from 'src/store/apps/groups';
import EditGroupModal from 'src/views/apps/groups/EditGroupModal';
import AddGroupModal from 'src/views/apps/groups/AddGroupModal';
import { useRouter } from 'next/router';

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}

export const TranslateWeekName: any = {
  monday: "Dushanba",
  tuesday: "Seshanba",
  wednesday: "Chorshanba",
  thursday: "Payshanba",
  friday: "Juma",
  saturday: "Shanba",
  sunday: "Yakshanba"
}


export default function GroupsPage() {
  const { groups, isLoading, queryParams, groupCount } = useAppSelector(state => state.groups)
  const dispatch = useAppDispatch()

  const router = useRouter()
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const { isMobile } = useResponsive()

  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t("ID"),
      dataIndex: 'index'
    },
    {
      xs: 1,
      title: t("Guruh nomi"),
      dataIndex: 'name'
    },
    {
      xs: 1,
      title: t("Kurs"),
      dataIndex: 'course_name'
    },
    {
      xs: 1.4,
      title: t("O'qituvchi"),
      dataIndex: 'teacher_name'
    },
    {
      xs: 1,
      title: t("Dars Kunlari"),
      dataIndex: 'week_days',
      render: (week_days: any) => getLessonDays(week_days)
    },
    {
      xs: 1,
      title: t("Dars vaqti"),
      dataIndex: 'start_end_at',
    },
    {
      xs: 1,
      title: t("O'quvchilar soni"),
      dataIndex: 'student_count'
    },
    {
      xs: 0.8,
      title: t("Ochilgan"),
      dataIndex: 'start_date',
      render: (date: string) => date.split('-').reverse().join('/')
    },
    {
      xs: 0.8,
      title: t("Yakunlanadi"),
      dataIndex: 'end_date',
      render: (date: string) => date.split('-').reverse().join('/')
    },
    {
      xs: 0.7,
      title: t("Status"),
      dataIndex: 'status',
      render: (status: string) => <Chip label={t(status)} size="small" variant='outlined' color={status === 'active' ? 'success' : status === 'archive' ? 'error' : 'warning'} />
    },
    {
      xs: 0.4,
      dataIndex: 'id',
      title: t(""),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const handlePagination = (page: string) => {
    dispatch(updateParams({ page: page }))
  }

  const handleOpenModal = async () => {
    dispatch(handleOpenAddModal(true))
    await dispatch(getDashboardLessons())
  }

  const rowClick = (id: any) => {
    router.push(`/groups/view/security?id=${id}&month=${getMontName(null)}`)
  }

  const pageLoad = async () => {
    const queryString = new URLSearchParams({ ...queryParams }).toString()
    await Promise.all([
      dispatch(fetchGroups(queryString)),
      dispatch(getMetaData())
    ])
  }

  useEffect(() => {
    pageLoad()
  }, [])

  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography variant='h5'>{t("Guruhlar")}</Typography>
          {!isLoading && <Chip label={`${groupCount} ta`} variant='outlined' color="primary" />}
        </Box>
        <Button
          onClick={handleOpenModal}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>
      {isMobile && (
        <Button size='small' sx={{ marginLeft: 'auto' }} variant='outlined' onClick={() => setOpen(true)}>
          {t('Filterlash')}
        </Button>
      )}
      {!isMobile && <GroupsFilter isMobile={isMobile} />}
      <DataTable columns={columns} loading={isLoading} data={groups || []} rowClick={rowClick} color />
      {Math.ceil(groupCount / 10) > 1 && isLoading && <Pagination defaultPage={queryParams.page ? Number(queryParams.page) : 1} count={groupCount} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(e.target.value + page)} />}

      <AddGroupModal />
      <EditGroupModal />

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
          <GroupsFilter isMobile={isMobile} />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => setOpen(false)}>{t('Davom etish')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
