import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import useResponsive from 'src/@core/hooks/useResponsive'
import { formatCurrency } from 'src/@core/utils/format-currency'
import getMontName from 'src/@core/utils/gwt-month-name'
import usePayment from 'src/hooks/usePayment'
import { customTableProps } from 'src/pages/groups'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail, fetchStudentPayment } from 'src/store/apps/students'
import StudentPaymentEditForm from './StudentPaymentEdit'
import { AuthContext } from 'src/context/AuthContext'
import { Icon } from '@iconify/react'
import useBranches from 'src/hooks/useBranch'
import { ModalTypes } from './UserViewLeft'
import useSMS from 'src/hooks/useSMS'
import StudentPaymentForm from './StudentPaymentForm'

// Rasm yuklab olish misoli
export async function downloadImage(filename: string, url: string) {
  await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'fileName'
      a.style.position = 'fixed'
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })
    .catch(console.error)
}

const UserViewSecurity = ({ groupData }: any) => {
  const { t } = useTranslation()
  const { query, push } = useRouter()
  const { isMobile } = useResponsive()
  const [edit, setEdit] = useState<any>(null)
  const [deleteId, setDelete] = useState<any>(null)
  const [loading, setLoading] = useState<any>(null)
  const [amount, setAmount] = useState<any>('')
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user } = useContext(AuthContext)
  const { payments, isLoading } = useAppSelector(state => state.students)
  const [modalRef, setModalRef] = useState<'sms' | 'note' | 'export' | null>(null)
  const [openLeft, setOpenLeft] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [activate, setActivate] = useState<boolean>(false)
  const { smsTemps, getSMSTemps } = useSMS()
  const { studentData } = useAppSelector(state => state.students)

  const { deletePayment } = usePayment()

  const { getBranches, branches } = useBranches()

  const handleEditClickOpen = (value: ModalTypes) => {
    if (value === 'payment') {
      getBranches()
    }
    setOpenEdit(value)
  }

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleEdit = (id: any) => {
    setAmount(payments.find((el: any) => el.id === id)?.amount)
    setEdit(payments.find((el: any) => el.id === id))
  }

  const handleClose = (value: 'none' | 'left' | 'payment' | 'notes' | 'sms' | 'export') => {
    setAnchorEl(null)
    if (value === 'notes') setModalRef('note')
    else if (value === 'sms') setModalRef('sms')
    else if (value === 'export') setModalRef('export')
    else if (value === 'payment') push(`/students/view/security/?student=${query.id}`)
    else if (value === 'left') {
      setOpenLeft(true)
    }
  }

  const handleDownload = async (id: number | string) => {
    setLoading(true)
    const subdomain = location.hostname.split('.')
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? process.env.NEXT_PUBLIC_TEST_BASE_URL
            : subdomain.length < 3
            ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
            : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`
        }/common/generate-check/${id}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      setLoading(false)
      const data = await response.blob()
      const blobUrl = URL.createObjectURL(data)

      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = `check-${id}.pdf` // set a name for the downloaded file
      document.body.appendChild(downloadLink)
      downloadLink.click() // Trigger the download
      document.body.removeChild(downloadLink)
    } catch (error) {
      setLoading(false)
      console.error('Download error:', error)
    }
  }

  const handlePrint = async (id: number | string) => {
    const subdomain = location.hostname.split('.')
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? process.env.NEXT_PUBLIC_TEST_BASE_URL
            : subdomain.length < 3
            ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
            : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`
        }/common/generate-check/${id}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      const data = await response.blob()
      const blobUrl = URL.createObjectURL(data)
      const printFrame: HTMLIFrameElement | null = document.getElementById('printFrame') as HTMLIFrameElement
      if (printFrame) {
        printFrame.src = blobUrl
        printFrame.onload = function () {
          if (printFrame.contentWindow) {
            printFrame.contentWindow?.print()
          }
        }
      }
    } catch (error) {
      console.error('Print error:', error)
    }
  }

  async function getReceipt(id: any) {
    setLoading(id)
    try {
      await handlePrint(id)
    } catch (err) {
      console.log(err)
    }
    setLoading(null)
  }

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'id'
    },
    {
      xs: 0.6,
      title: t('Sana'),
      dataIndex: 'payment_date'
    },
    {
      xs: 0.6,
      title: t('Turi'),
      dataIndex: 'condition',
      renderItem: item => (
        <Chip
          size='small'
          label={item?.condition !== 'debt' ? "To'landi" : 'Qarzdorlik'}
          color={item?.condition !== 'debt' ? 'success' : Number(item?.amount) === 0 ? 'secondary' : 'error'}
        />
      )
    },
    {
      xs: 0.7,
      title: t('Summa'),
      dataIndex: 'amount',
      render: amount =>
        Number(amount) <= 0 ? `${formatCurrency(Number(amount) * -1)} UZS` : `${formatCurrency(amount)} UZS`
    },
    {
      xs: 1,
      title: t('Guruh'),
      dataIndex: 'group_name'
    },
    {
      xs: 1,
      title: t('Izoh'),
      dataIndex: 'description'
    },
    {
      xs: 0.8,
      title: t("To'lov turi"),
      dataIndex: 'payment_type_name'
    },
    {
      xs: 1,
      title: t('Qabul qildi'),
      dataIndex: 'admin'
    },
    {
      xs: 0.2,
      title: t('Amallar'),
      dataIndex: 'amount',
      renderId: (id, src) => (
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <IconifyIcon onClick={() => handleEdit(id)} icon='mdi:pencil-outline' fontSize={20} />
          {Number(src) <= 0 ? (
            ''
          ) : (
            <IconifyIcon onClick={() => setDelete(id)} icon='mdi:delete-outline' fontSize={20} />
          )}
          {Number(src) < 0 ? (
            ''
          ) : loading === id ? (
            <IconifyIcon icon={'la:spinner'} fontSize={20} />
          ) : isMobile ? (
            <IconifyIcon onClick={() => handleDownload(id)} icon={`ph:receipt-light`} fontSize={20} />
          ) : (
            <IconifyIcon onClick={() => getReceipt(id)} icon={`ph:receipt-light`} fontSize={20} />
          )}
        </Box>
      )
    }
  ]

  const onHandleDelete = async () => {
    setLoading(true)
    await deletePayment(deleteId)
    setLoading(false)
    setDelete(false)
    await dispatch(fetchStudentPayment(query?.student))
    await dispatch(fetchStudentDetail(Number(query?.student)))
  }

  useEffect(() => {
    dispatch(fetchStudentPayment(query?.student))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box className='demo-space-y'>
      {groupData && groupData.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {groupData.map((group: any) => (
            <Box key={group.id} sx={{ position: 'relative' }}>
              <Typography
                id='fade-button'
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                sx={{
                  position: 'absolute',
                  top: 15,
                  right: 465,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={!(user?.role.length === 1 && user?.role.includes('teacher')) ? handleClick : undefined}
              >
                <IconifyIcon icon={'charm:menu-kebab'} fontSize={11} />
              </Typography>

              <Menu
                id='fade-menu'
                MenuListProps={{
                  'aria-labelledby': 'fade-button'
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose('none')}
                TransitionComponent={Fade}
              >
                <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  onClick={async () => handleEditClickOpen('payment')}
                >
                  <Icon fontSize={'20px'} icon={'ic:baseline-payments'} />
                  {t("To'lov")}
                </MenuItem>
                <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  onClick={() => handleClose('export')}
                >
                  <Icon fontSize={'20px'} icon={'tabler:status-change'} />
                  {t("Boshqa guruhga ko'chirishsh")}
                </MenuItem>
                <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  onClick={() => handleClose('left')}
                >
                  <Icon fontSize={'20px'} icon={'material-symbols:group-remove'} />
                  {t('Guruhdan chiqarish')}
                </MenuItem>
                {/* <MenuItem
          sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          onClick={() => (dispatch(setOpenLeadModal(studentStatusId)), handleClose('none'))}
        >
          <Icon fontSize={'20px'} icon={'mdi:leads'} />
          {t('Lidlarga qaytarish')}
        </MenuItem> */}
                {/* <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  onClick={() => handleClose('notes')}
                >
                  <Icon fontSize={'20px'} icon={'material-symbols:note-alt'} />
                  {t('Eslatma')} +
                </MenuItem>
                <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  onClick={() => (handleClose('sms'), getSMSTemps())}
                >
                  <Icon fontSize={'20px'} icon={'ic:baseline-message'} />
                  {t('Xabar (sms)')} +
                </MenuItem> */}
                <MenuItem
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  onClick={() => (setActivate(true), handleClose('none'))}
                >
                  <Icon fontSize={'20px'} icon={'ri:file-edit-fill'} />
                  {t('Tahrirlash')}
                </MenuItem>
              </Menu>
              <StudentPaymentForm student_id={query.id} openEdit={openEdit} setOpenEdit={setOpenEdit} />

              <Link
                href={`/groups/view/security/?id=${group.group_data.id}&month=${getMontName(null)}`}
                style={{ textDecoration: 'none' }}
              >
                <Box sx={{ display: 'flex', gap: '20px' }}>
                  <Card sx={{ width: isMobile ? '100%' : '50%' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', margin: '0', py: '10px' }}>
                      <Chip
                        label={`${formatCurrency(group.group_data.balance)} so'm`}
                        size='small'
                        variant='outlined'
                        color={group.group_data.balance >= 0 ? 'success' : 'error'}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={`${t(group.status)}`}
                          size='small'
                          variant='outlined'
                          color={
                            group.status === 'active'
                              ? 'success'
                              : group.status === 'new'
                              ? 'warning'
                              : group.status === 'frozen'
                              ? 'secondary'
                              : 'error'
                          }
                        />
                      </Box>
                    </CardContent>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <Typography sx={{ fontSize: '12px' }}>{group.group_data.name}</Typography>
                        <Typography sx={{ fontSize: '12px' }}>{group.course.name}</Typography>
                        <Typography sx={{ fontSize: '12px' }}>{group.teacher.first_name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                        <Typography sx={{ fontSize: '12px' }}>
                          {group.added_at} / {group.deleted_at}
                        </Typography>
                        <Typography sx={{ fontSize: '12px' }}>Juft kunlar - {group.start_at}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      ) : (
        <EmptyContent />
      )}

      <Typography sx={{ my: 3, fontSize: '20px' }}>{t("To'lov tarixi")}</Typography>
      <DataTable
        color
        loading={isLoading}
        maxWidth='100%'
        minWidth='450px'
        data={payments.map(el => ({
          ...el,
          color: Number(el.amount) >= 0 ? 'transparent' : 'rgba(227, 18, 18, 0.1)',
          is_debtor: Number(el.amount) >= 0
        }))}
        columns={columns}
      />

      <iframe src='' id='printFrame' style={{ height: 0 }}></iframe>

      <StudentPaymentEditForm openEdit={edit} setOpenEdit={setEdit} />

      <Dialog
        open={deleteId}
        onClose={() => setDelete(null)}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 350, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          To'lovni o'chirishni tasdiqlang
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={() => setDelete(null)}>{t('Bekor qilish')}</Button>
            <LoadingButton variant='outlined' color='error' onClick={onHandleDelete} loading={loading}>
              {t("O'chirish")}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
      {/* <EditStudent status={status} student={student} id={activeId} activate={activate} setActivate={setActivate} />
      <AddNote id={query.id} modalRef={modalRef} setModalRef={setModalRef} />
      <SentSMS smsTemps={smsTemps} id={query.id} modalRef={modalRef} setModalRef={setModalRef} />
      <ExportStudent id={studentStatusId} modalRef={modalRef} setModalRef={setModalRef} /> */}
    </Box>
  )
}

export default UserViewSecurity
