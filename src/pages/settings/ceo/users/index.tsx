import { Box, Button, FormControlLabel, IconButton, Menu, Pagination, Switch, Typography } from '@mui/material'
import { MouseEvent, ReactNode, useContext, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import MenuItem from '@mui/material/MenuItem'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import useEmployee from 'src/hooks/useEmployee'
import EmployeeCreateDialog from 'src/views/apps/settings/employees/TeacherCreateDialog'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  editEmployeeStatus,
  fetchEmployees,
  setEmployeeData,
  setEmployeeId,
  setOpenCreateSms,
  setOpenSms,
  updateQueryParams
} from 'src/store/apps/settings'
import EditEmployeeModal from 'src/views/apps/settings/employees/TeacherEditDialog'
import api from 'src/@core/utils/api'
import ButtonGroup from '@mui/material/ButtonGroup'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { AuthContext } from 'src/context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSMS from 'src/hooks/useSMS'
import { SendSMSModal } from 'src/views/apps/students/view/UserViewLeft'
import useResponsive from 'src/@core/hooks/useResponsive'
import ceoConfigs from 'src/configs/ceo'

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}

export default function GroupsPage() {
  // Hooks
  const { t } = useTranslation()
  const { getEmployeeById } = useEmployee()
  const { employees, is_pending, employees_count, queryParams, roles, openSms,employee_id } = useAppSelector(
    state => state.settings
  )

  console.log(openSms);
  const {isMobile} = useResponsive()

  const dispatch = useAppDispatch()
  const { smsTemps, getSMSTemps } = useSMS()
  const { push } = useRouter()
  const { user } = useContext(AuthContext)

  const RowOptions = ({ id }: { id: number | string }) => {
    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const [smallLoading, setSmallLoading] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { smsTemps, getSMSTemps } = useSMS()

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleDelete = () => {
      handleRowOptionsClose()
      setSuspendDialogOpen(true)
    }

    const handleDeleteSubmit = async () => {
      setSmallLoading(true)
      dispatch(disablePage(true))
      try {
        await api.delete(`${ceoConfigs.employee_delete}${id}/`)
        toast.success("Xodim muvaffaqiyatli o'chirildi")
        dispatch(fetchEmployees(queryParams))
      } catch (err: any) {
        if (err?.response?.data) {
          toast.error(err?.response?.data?.msg)
        }
      }
      dispatch(disablePage(false))
      setSmallLoading(false)
    }

    const getUserById = async () => {
      setSmallLoading(true)
      const resp = await getEmployeeById(id)
      dispatch(setEmployeeData(resp))
      setSmallLoading(false)
    }

    const handleChange = async () => {
      setLoading(true)
      const resp = await dispatch(
        editEmployeeStatus({
          data: { status: 'active' },
          id: id
        })
      )

      if (resp.meta.requestStatus === 'rejected') {
        toast.error("Tiklab bo'lmadi")
      } else {
        dispatch(updateQueryParams({ page: 1, status: 'active' }))
        dispatch(fetchEmployees({ ...queryParams, page: 1, status: 'active' }))
        toast.success('Xodim qaytarildi')
      }
      setLoading(false)
      dispatch(disablePage(false))
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <IconifyIcon icon='mdi:dots-vertical' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          {queryParams.status == 'archive' ? (
            <MenuItem disabled={loading} onClick={() => handleChange()} sx={{ '& svg': { mr: 2 } }}>
              {loading ? (
                <Typography>Tiklanmoqda...</Typography>
              ) : (
                <>
                  <IconifyIcon icon='icon-park-outline:return' fontSize={20} />
                  {t('Tiklash')}
                </>
              )}
            </MenuItem>
          ) : (
            <>
              {' '}
              <MenuItem disabled={smallLoading} onClick={getUserById}>
                {smallLoading ? (
                  <Typography>Bajarilmoqda...</Typography>
                ) : (
                  <>
                    <IconifyIcon icon='mdi:pencil-outline' fontSize={20} style={{ marginRight: '4px' }} />
                    {t('Tahrirlash')}
                  </>
                )}
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                {t("O'chirish")}
              </MenuItem>
              <MenuItem
                onClick={() => (dispatch(setEmployeeId(id)), getSMSTemps(), dispatch(setOpenSms('sms')))}
                sx={{ '& svg': { mr: 2 } }}
              >
                <IconifyIcon icon='mdi:sms' fontSize={20} />
                {t('SMS yuborish')}
              </MenuItem>
            </>
          )}
        </Menu>

        <UserSuspendDialog
          loading={smallLoading}
          open={suspendDialogOpen}
          setOpen={setSuspendDialogOpen}
          handleOk={handleDeleteSubmit}
        />
      </>
    )
  }

  const columns: customTableProps[] = [
    {
      xs: 0.1,
      title: t('#'),
      dataIndex: 'index'
    },
    {
      xs: 1,
      title: t('first_name'),
      dataIndex: 'first_name'
    },
    {
      xs: 1,
      title: t('Telefon raqam'),
      dataIndex: 'phone'
    },
    {
      xs: 1,
      title: t('Doimiy oylik'),
      dataIndex: 'amount',
      render: amount => {
        if (!isNaN(Number(amount))) {
          return `${formatCurrency(amount)} UZS`
        } else {
          return '*****'
        }
      }
    },
    {
      xs: 1,
      title: t('Foiz ulush (%)'),
      dataIndex: 'percentage',
      render: per => `${per} %`
    },
    {
      xs: 0.6,
      title: t('Kasbi'),
      dataIndex: 'roles_list',
      render: (roles_list: any) => roles_list.join(', ')
    },
    {
      xs: 0.6,
      title: t('Ishga olingan sana'),
      dataIndex: 'activated_at',
      render: date => <Box sx={{ textAlign: 'center' }}>{date}</Box>
    },
    {
      xs: 0.5,
      dataIndex: 'id',
      title: t(''),
      render: actions => (
        <Box sx={{ textAlign: 'end' }}>
          <RowOptions  id={actions} />
        </Box>
      )
    }
  ]

  const handleFilter = async (value: number | string) => {
    dispatch(updateQueryParams({ role: value }))
    await dispatch(fetchEmployees({ ...queryParams, role: value }))
  }
  const handleChangeStatus = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(updateQueryParams({ status: checked ? 'archive' : 'active', page: '1' }))
    await dispatch(fetchEmployees({ ...queryParams, status: checked ? 'archive' : 'active', page: 1 }))
  }

  const buttons = [
    <Button key={''} onClick={() => handleFilter('')} variant={queryParams.role === '' ? 'contained' : 'outlined'}>
      {t('Barchasi')} - {employees.length}
    </Button>,
    ...roles.map(el => (
      <Button
        key={el.id}
        onClick={() => handleFilter(el.id)}
        variant={queryParams.role === el.id ? 'contained' : 'outlined'}
      >
        {t(el.name)} - {el.count}
      </Button>
    ))
  ]

  const handlePagination = (page: number) => {
    dispatch(updateQueryParams({ page }))
    dispatch(fetchEmployees({ ...queryParams, page: page }))
  }

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    dispatch(fetchEmployees(queryParams))
  }, [])
  const handleEditClose = () => {
    dispatch(setOpenSms(null))
    dispatch(setEmployeeId(null))
  }
  return (
    <div>
      <VideoHeader item={videoUrls.employees} />
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0',width:'100%' }}
        py={2}
      >
        <Typography variant='h5'>{t('Xodimlar')}</Typography>
        <Button
          onClick={() => dispatch(setOpenCreateSms(true))}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>

      <Box
        sx={{
          alignItems: isMobile?'start':'center',
          display: 'flex',
          gap: '10px',
          '& > *': {
            m: 1
          }
        }}
      >
        <ButtonGroup
      size="small"
          aria-label="Small button group"
          sx={{display:'flex',flexDirection:isMobile ? 'column':'row'}}
      orientation={isMobile ? 'vertical' : 'horizontal'} 
      fullWidth={isMobile} 
    >
      {buttons}
    </ButtonGroup>
        <Link href='/settings/ceo/users/attandance-table'>
          <Button variant='contained' size='medium'>
            Xodimlar Davomati
          </Button>
        </Link>
        <FormControlLabel
          control={<Switch checked={queryParams.status == 'archive'} onChange={handleChangeStatus} />}
          label={t('Arxiv')}
        />
      </Box>

      <DataTable loading={is_pending} columns={columns} data={employees} />
      {Math.ceil(employees_count / 10) > 1 && !is_pending && (
        <Pagination
          defaultPage={queryParams.page ? Number(queryParams.page) : 1}
          count={Math.ceil(employees_count / 10)}
          variant='outlined'
          shape='rounded'
          onChange={(_: any, page) => handlePagination(page)}
        />
      )}

      <EmployeeCreateDialog />
      <SendSMSModal
        handleEditClose={handleEditClose}
        openEdit={openSms}
        smsTemps={smsTemps}
        setOpenEdit={setOpenSms}
        usersData={[employee_id]}
      />
      <EditEmployeeModal />
    </div>
  )
}
