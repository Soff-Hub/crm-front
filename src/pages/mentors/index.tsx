'use client'
import { Box, Button, Chip, FormControlLabel, Pagination, Switch, Typography } from '@mui/material'
import { ReactNode, useContext, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchTeachersList, updateParams ,setOpenEdit, setOpenSms} from 'src/store/apps/mentors'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { videoUrls } from 'src/@core/components/video-header/video-header'
import dynamic from 'next/dynamic'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import useSMS from 'src/hooks/useSMS'
import { ModalTypes, SendSMSModal } from 'src/views/apps/students/view/UserViewLeft'
import { fetchSmsList } from 'src/store/apps/settings'

const RowOptions = dynamic(() => import('src/views/apps/mentors/RowOptions'))
const TeacherAvatar = dynamic(() => import('src/views/apps/mentors/AddMentorsModal').then(mod => mod.TeacherAvatar))
const TeacherEditDialog = dynamic(() => import('src/views/apps/mentors/TeacherEditDialog'))
const TeacherCreateDialog = dynamic(() => import('src/views/apps/mentors/TeacherCreateDialog'))
const VideoHeader = dynamic(() => import('src/@core/components/video-header/video-header'))
const DataTable = dynamic(() => import('src/@core/components/table'))

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}

export default function GroupsPage() {
  const { t } = useTranslation()
  const { push } = useRouter()
  const dispatch = useAppDispatch()
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
    const [error, setError] = useState<any>({})
  const router = useRouter()
  const { smsTemps, getSMSTemps } = useSMS()
  const { teachers, teachersCount, queryParams, isLoading,openSms } = useAppSelector(state => state.mentors)
  const studentIds = teachers.map(student => student.id)
 const handleEditClickOpen = (value: ModalTypes) => {
    dispatch(setOpenSms(value))
  }
  const handleEditClose = () => {
    setError({})
    dispatch(setOpenSms(null))
  }
  const date = new Date().toLocaleDateString()

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index'
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
      xs: 1.7,
      title: t('first_name'),
      dataIndex: 'first_name'
    },
    {
      xs: 1.7,
      title: t('phone'),
      dataIndex: 'phone'
    },
    {
      xs: 1.7,
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
      xs: 1.7,
      title: t('Foiz ulush (%)'),
      dataIndex: 'percentage',
      render: per => `${per} %`
    },
    {
      xs: 1.7,
      title: t('birth_date'),
      dataIndex: 'birth_date'
    },
    {
      xs: 1.7,
      title: t('Ishga olingan sana'),
      dataIndex: 'activated_at'
    },
    {
      xs: 1,
      dataIndex: 'id',
      title: '',
      // title: <Button onClick={() => push("/employee-attendance")} variant='outlined'>{t("Davomat")}</Button>,
      render: (actions) => <RowOptions id={actions} status={queryParams?.status}  />
    }
  ]

  const rowClick = (id: any) => {
    console.log(id);
    
    push(`/mentors/view/security?id=${id}`)
  }


  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      router.push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    const queryString = new URLSearchParams({
      ...queryParams,
      page: String(queryParams.page),
      status: String(queryParams.status)
    }).toString()
    dispatch(fetchTeachersList(queryString))

    return () => {
      dispatch(setOpenEdit(null))
    }
  }, [])

  const handlePagination = async (page: number) => {
    dispatch(updateParams({ page }))
    const queryString = new URLSearchParams({ ...queryParams, page: String(page) }).toString()
    await dispatch(fetchTeachersList(queryString))
  }

  const handleChangeStatus = async (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(updateParams({ status: checked ? 'archive' : 'active', page: 1 }))
    const queryString = new URLSearchParams({ status: checked ? 'archive' : 'active', page: '1' }).toString()
    await dispatch(fetchTeachersList(queryString))
  }
  
  useEffect(() => {
    dispatch(fetchSmsList())
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.teachers} />
      <Box
        className='groups-page-header'
        sx={{
          display: 'flex',
          flexWrap:'wrap',
          // flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'start' : 'center',
          justifyContent: 'space-between',
          margin: '10px 0',
          gap: '10px',
        }}
        py={2}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            // flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '5px' : '10px',
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'}>{t('Mentorlar')}</Typography>
          <Chip label={`${teachersCount || 0}`} variant='outlined' color='primary' size='medium' />
          <FormControlLabel
            control={<Switch onChange={handleChangeStatus} />}
            checked={queryParams.status === 'archive'}
            label={t('archive')}
            sx={{ marginLeft: isMobile ? '0' : '10px' }}
          />
        </Box>
        <Box
          sx={{
            width:isMobile ? '100%':'auto',
            display: 'flex',
            gap: isMobile ? '10px' : '20px',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Button
            onClick={() => {
              getSMSTemps();
              handleEditClickOpen('sms');
            }}
            variant='outlined'
            color='warning'
            fullWidth={isMobile}
            size='small'
            startIcon={<IconifyIcon icon='material-symbols-light:sms-outline' />}
          >
            {t('Sms yuborish')}
          </Button>
          <Button
            onClick={() => dispatch(setOpenEdit('create'))}
            variant='contained'
            size='small'
            fullWidth={isMobile}
            startIcon={<IconifyIcon icon='ic:baseline-plus' />}
          >
            {t("Yangi qo'shish")}
          </Button>
        </Box>
      </Box>
      <DataTable loading={isLoading} columns={columns} data={teachers} rowClick={rowClick} />
      {Math.ceil(teachersCount / 10) > 1 && !isLoading && (
        <Pagination
          defaultPage={Number(queryParams.page)}
          count={Math.ceil(teachersCount / 10)}
          variant='outlined'
          shape='rounded'
          onChange={(e: any, page) => handlePagination(page)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
          }}
        />
      )}
      <TeacherCreateDialog />
      <TeacherEditDialog />
      <SendSMSModal
        handleEditClose={handleEditClose}
        openEdit={openSms}
        smsTemps={smsTemps}
        setOpenEdit={setOpenSms}
        usersData={studentIds}
      />
    </div>
  )
}
