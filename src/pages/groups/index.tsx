//@ts-nocheck
"use client";
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
import { ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  fetchGroups,
  getDashboardLessons,
  getMetaData,
  handleOpenAddModal,
  resetGroupParams,
  updateParams,
} from 'src/store/apps/groups';
import { useRouter } from 'next/router';
import { videoUrls } from 'src/@core/components/video-header/video-header';
import { GroupsFilter } from 'src/views/apps/groups/GroupsFilter';
import getLessonDays from 'src/@core/utils/getLessonDays';
import dynamic from 'next/dynamic';
import getMonthName from 'src/@core/utils/gwt-month-name';
import { AuthContext } from 'src/context/AuthContext';
import { toast } from 'react-hot-toast';

const IconifyIcon = dynamic(() => import('src/@core/components/icon'));
const DataTable = dynamic(() => import('src/@core/components/table'));
const MuiDrawer = dynamic(() => import('@mui/material/Drawer'));
const RowOptions = dynamic(() => import('src/views/apps/groups/RowOptions'));
const EditGroupModal = dynamic(() => import('src/views/apps/groups/EditGroupModal'));
const AddGroupModal = dynamic(() => import('src/views/apps/groups/AddGroupModal'));
const VideoHeader = dynamic(() => import('src/@core/components/video-header/video-header'));

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
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
  const { user } = useContext(AuthContext)
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
      render: (status: string) => <Chip label={t(status)} size="small" variant='filled' color={status === 'active' ? 'success' : status === 'archived' ? 'error' : 'warning'} />
    },
    {
      xs: 0.4,
      dataIndex: 'id',
      title: t(""),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const handlePagination = async (page: string) => {
    dispatch(updateParams({ page }))
    const queryString = new URLSearchParams({ ...queryParams, page }).toString()
    await dispatch(fetchGroups(queryString))
  }

  const handleOpenModal = async () => {
    dispatch(handleOpenAddModal(true))
    await dispatch(getDashboardLessons())
  }

  const rowClick = (id: any) => {
    router.push(`/groups/view/security?id=${id}&month=${getMonthName(null)}`)
  }

  const pageLoad = async () => {
    await Promise.all([
      dispatch(getMetaData())
    ])
  }

  useEffect(() => {
    if (!user?.role.includes('ceo') && !user?.role.includes('admin')) {
      router.push("/")
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    pageLoad()
    return () => {
      dispatch(resetGroupParams())
    }
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.groups} />
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography variant='h5'>{t("Guruhlar")}</Typography>
          {!isLoading && <Chip label={`${groupCount}`} variant='outlined' color="primary" />}
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
        <Button size='small' sx={{ marginLeft: 'auto', width: "100%" }} variant='outlined' onClick={() => setOpen(true)}>
          {t('Filterlash')}
        </Button>
      )}
      {!isMobile && <GroupsFilter isMobile={isMobile} />}
      <DataTable columns={columns} loading={isLoading} data={groups || []} rowClick={rowClick} color text_color/>
      {Math.ceil(groupCount / 10) > 1 && !isLoading && <Pagination defaultPage={queryParams.page ? Number(queryParams.page) : 1} count={Math.ceil(groupCount / 10)} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(page)} />}

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
