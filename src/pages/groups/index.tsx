'use client'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TablePagination,
  Typography
} from '@mui/material'
import { ReactNode, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchGroups,
  getDashboardLessons,
  getMetaData,
  handleOpenAddModal,
  resetGroupParams,
  updateParams
} from 'src/store/apps/groups'
import { useRouter } from 'next/router'
import { videoUrls } from 'src/@core/components/video-header/video-header'
import { GroupsFilter } from 'src/views/apps/groups/GroupsFilter'
import getLessonDays from 'src/@core/utils/getLessonDays'
import dynamic from 'next/dynamic'
import getMonthName from 'src/@core/utils/gwt-month-name'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import GroupChangeBranchModal from 'src/views/apps/groups/GroupChangeBranchModal'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from 'src/@core/utils/api'
import { LoadingButton } from '@mui/lab'
import ceoConfigs from 'src/configs/ceo'

const IconifyIcon = dynamic(() => import('src/@core/components/icon'))
const DataTable = dynamic(() => import('src/@core/components/table'))
const MuiDrawer = dynamic(() => import('@mui/material/Drawer'))
const RowOptions = dynamic(() => import('src/views/apps/groups/RowOptions'))
const EditGroupModal = dynamic(() => import('src/views/apps/groups/EditGroupModal'))
const AddGroupModal = dynamic(() => import('src/views/apps/groups/AddGroupModal'))
const VideoHeader = dynamic(() => import('src/@core/components/video-header/video-header'))

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  renderItem?: (source: any) => any | undefined
  render?: (source: string) => any | undefined
  renderId?: (id: any, source: any) => any | undefined
}

export const TranslateWeekName: any = {
  monday: 'Dushanba',
  tuesday: 'Seshanba',
  wednesday: 'Chorshanba',
  thursday: 'Payshanba',
  friday: 'Juma',
  saturday: 'Shanba',
  sunday: 'Yakshanba'
}

export default function GroupsPage() {
  const { groups, isLoading, queryParams, groupCount } = useAppSelector(state => state.groups)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const { isMobile } = useResponsive()
  const [page, setPage] = useState<number>(queryParams.page ? Number(queryParams.page) - 1 : 0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(() => Number(localStorage.getItem('rowsPerPage')) || 10)
  const [loading, setLoading] = useState(false)
  const [updateStatusModal, setUpdateStatusModal] = useState(false)
  const [groupStatus, setGroupStatus] = useState<string | null>(null)
  const [group_id, setGroupId] = useState<number | null>(null)
  const [groupChoices, setGroupChoices] = useState([])

  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t('ID'),
      dataIndex: 'index'
    },
    {
      xs: 1,
      title: t('Guruh nomi'),
      dataIndex: 'name'
    },
    {
      xs: 1,
      title: t('Kurs'),
      dataIndex: 'course_name'
    },
    {
      xs: 1.4,
      title: t("O'qituvchi"),
      dataIndex: 'teacher_name'
    },
    {
      xs: 1,
      title: t('Dars Kunlari'),
      dataIndex: 'week_days',
      render: (week_days: any) => t(getLessonDays(week_days))
    },
    {
      xs: 1,
      title: t('Dars vaqti'),
      dataIndex: 'start_end_at'
    },
    {
      xs: 1,
      title: t("O'quvchilar soni"),
      dataIndex: 'student_count'
    },
    {
      xs: 0.8,
      title: t('Ochilgan'),
      dataIndex: 'start_date',
      render: (date: string) => date.split('-').reverse().join('/')
    },
    {
      xs: 0.8,
      title: t('Yakunlanadi'),
      dataIndex: 'end_date',
      render: (date: string) => date.split('-').reverse().join('/')
    },
    {
      xs: 0.7,
      title: t('Status'),
      dataIndex: 'status_data',

      render: (status: any) => (
        <Box
          sx={{
            cursor: 'pointer',
            pointerEvents: status?.status === 'archived' ? 'auto' : 'pointer' // Ensure clicks work for all statuses
          }}
          onClick={() => {
            if (status?.status !== 'archived') {
              setGroupStatus(status?.status)
              setUpdateStatusModal(true)
              setGroupId(status?.id)
            } else {
              console.log('Archived status clicked, but no action triggered.')
            }
          }}
        >
          <Chip
            label={t(status?.status)}
            size='small'
            variant='filled'
            color={status?.status === 'active' ? 'success' : status?.status === 'archived' ? 'error' : 'warning'}
          />
        </Box>
      )
    },
    {
      xs: 0.4,
      dataIndex: 'id',
      title: t(''),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const handleRowsPerPageChange = async (value: number) => {
    const limit = value

    setRowsPerPage(Number(value))
    localStorage.setItem('rowsPerPage', `${value}`)

    await dispatch(fetchGroups({ ...queryParams, limit: value, offset: `0` }))
    dispatch(updateParams({ limit: value }))
    setPage(0)
  }

  const handlePagination = async (page: string | number) => {
    const adjustedPage: any = (Number(page) - 1) * rowsPerPage
    setPage(Number(page))

    await dispatch(fetchGroups({ ...queryParams, limit: rowsPerPage, offset: adjustedPage }))
    dispatch(updateParams({ offset: adjustedPage }))
  }

  const handleOpenModal = async () => {
    dispatch(handleOpenAddModal(true))
    await dispatch(getDashboardLessons(''))
  }

  const rowClick = (id: any) => {
    router.push(`/groups/view/security?id=${id}&month=${getMonthName(null)}`)
  }

  const pageLoad = async () => {
    if (!queryParams.limit) {
      dispatch(updateParams({ limit: rowsPerPage }))

      await dispatch(fetchGroups({ ...queryParams }))
    } else {
      await dispatch(fetchGroups({ ...queryParams }))
    }
    await dispatch(getMetaData())
  }

  const formik = useFormik({
    initialValues: { status: groupStatus },
    validationSchema: () =>
      Yup.object({
        status: Yup.string().nullable().required('Status kiritilishi shart')
      }),
    onSubmit: async values => {
      setLoading(true)
      const response = await api.patch(ceoConfigs.groups_updateStatus + group_id, values)
      if (response.status == 200) {
        toast.success("Status o'zgartirildi")
        await dispatch(fetchGroups({ ...queryParams }))
        setUpdateStatusModal(false)
        setLoading(false)
      } else {
        toast('Xatolik')
      }
      setLoading(false)
    }
  })

  useEffect(() => {
    const group = groups?.find((item: any) => item.id == group_id)
    if (group) {
      setGroupChoices(group.choices)
    }
  }, [group_id])

  useEffect(() => {
    formik.setFieldValue('status', groupStatus)
  }, [groupStatus])

  useEffect(() => {
    const initializePage = async () => {
      if (
        !user?.role.includes('ceo') &&
        !user?.role.includes('admin') &&
        !user?.role.includes('watcher') &&
        !user?.role.includes('marketolog')
      ) {
        router.push('/')
        toast.error('Sahifaga kirish huquqingiz yoq!')
      }
      await pageLoad()
    }

    initializePage()

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
          <Typography variant='h5'>{t('Guruhlar')}</Typography>
          {!isLoading && <Chip label={`${groupCount}`} variant='outlined' color='primary' />}
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
        <Button
          size='small'
          sx={{ marginLeft: 'auto', width: '100%' }}
          variant='outlined'
          onClick={() => setOpen(true)}
        >
          {t('Filterlash')}
        </Button>
      )}
      
      {!isMobile && <GroupsFilter isMobile={isMobile} />}
      <DataTable columns={columns} loading={isLoading} data={groups || []} rowClick={rowClick} color text_color />
      {Math.ceil(groupCount / 10) > 1 && !isLoading && (
        <div className='d-flex'>
          <Pagination
            page={Number(queryParams.offset) ? Number(queryParams.offset) / rowsPerPage + 1 : 1}
            count={Math.ceil(groupCount / 10)}
            variant='outlined'
            shape='rounded'
            onChange={(e: any, page) => handlePagination(String(page))}
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
      )}

      <AddGroupModal />
      <EditGroupModal />
      <GroupChangeBranchModal />

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
      <Dialog open={updateStatusModal} onClose={() => setUpdateStatusModal(false)}>
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <DialogContent sx={{ maxWidth: '350px' }}>
            <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>
              {t("O'quvchini statusini ozgartirish")}
            </Typography>

            <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
              {/* <InputLabel size='small' id='demo-simple-select-outlined-label'>
                Status (holati)
              </InputLabel> */}
              <Select
                size='small'
                placeholder='Status (holati)'
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                name='status'
                error={!!formik.errors.status && !!formik.touched.status}
              >
                {/* <MenuItem value={'active'}>Aktiv</MenuItem>
                <MenuItem value={'frozen'}>Muzlatish</MenuItem> */}
                {groupChoices?.map(el => (
                  <MenuItem value={el} key={el}>
                    {t(el)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{!!formik.errors.status ? `${formik.errors.status}` : ''}</FormHelperText>
            </FormControl>
            <DialogActions>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                <Button
                  onClick={() => {
                    setUpdateStatusModal(false), formik.resetForm(), setGroupStatus(null)
                  }}
                  size='small'
                  variant='outlined'
                  color='error'
                >
                  {t('Bekor qilish')}
                </Button>
                <LoadingButton loading={loading} type='submit' size='small' variant='contained'>
                  {t('Tasdiqlash')}
                </LoadingButton>
              </Box>
            </DialogActions>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  )
}
