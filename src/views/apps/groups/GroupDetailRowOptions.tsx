import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { MouseEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import api from 'src/@core/utils/api'
import useBranches from 'src/hooks/useBranch'
import useSMS from 'src/hooks/useSMS'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  getAttendance,
  getDays,
  getStudents,
  setGettingAttendance,
  setOpenLeadModal,
  setUpdateStatusModal
} from 'src/store/apps/groupDetails'
import { disablePage } from 'src/store/apps/page'
import {
  deleteStudent,
  fetchStudentDetail,
  fetchStudentsList,
  setGroupChecklist,
  updateStudent
} from 'src/store/apps/students'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import StudentPaymentForm from '../students/view/StudentPaymentForm'
import { LoadingButton } from '@mui/lab'
import MergeToDepartment from './view/ViewStudents/MergeForm'
import EditStudent from './view/ViewStudents/EditStudent'
import AddNote from './view/ViewStudents/AddNote'
import SentSMS from './view/ViewStudents/SentSMS'
import ExportStudent from './view/ViewStudents/ExportStudent'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'

type Props = {
  id: number
}

export type ModalTypes = 'group' | 'withdraw' | 'payment' | 'sms' | 'delete' | 'edit' | 'notes' | 'parent'

export default function GroupDetailRowOptions({ id }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { push, query } = useRouter()
  const { students, studentsQueryParams, isGettingStudents, queryParams, openLeadModal, updateStatusModal } =
    useAppSelector(state => state.groupDetails)

  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()
  const [modalRef, setModalRef] = useState<'sms' | 'note' | 'export' | null>(null)
  const [openLeft, setOpenLeft] = useState<boolean>(false)
  const { smsTemps, getSMSTemps } = useSMS()
  const [student, setStudent] = useState<any | null>(null)

  useEffect(() => {
    setStudent(students?.find(item => item.id == id))
  }, [])

  const dispatch = useAppDispatch()

  const rowOptionsOpen = Boolean(anchorEl)
  const { getBranches, branches } = useBranches()
  const [activate, setActivate] = useState<boolean>(false)

  const handleClose = (value: 'none' | 'left' | 'payment' | 'notes' | 'sms' | 'export') => {
    setAnchorEl(null)
    if (value === 'notes') setModalRef('note')
    else if (value === 'sms') setModalRef('sms')
    else if (value === 'export') setModalRef('export')
    else if (value === 'payment') push(`/students/view/security/?student=${id}`)
    else if (value === 'left') {
      setOpenLeft(true)
    }
  }
  const handleEditClickOpen = (value: ModalTypes) => {
    if (value === 'payment') {
      getBranches()
    }
    setOpenEdit(value)
  }

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLeft = async () => {
    if (student?.student?.balance < 0) {
      toast.error("Qarzdor o'quvchini guruhdan chetlatib bo'lmaydi")
    } else {
      setLoading(true)

      try {
        await api.delete(`common/group-student-delete/${student?.id}/`)
        toast.success("O'quvchi guruhdan chetlatildi", { position: 'top-center' })
        setLoading(false)
        const queryString = new URLSearchParams(studentsQueryParams).toString()
        const queryStringAttendance = new URLSearchParams(queryParams).toString()
        await dispatch(getStudents({ id: query.id, queryString: queryString }))
        dispatch(setGettingAttendance(true))
        if (query.month && query?.id) {
          await dispatch(
            getAttendance({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
              group: query?.id,
              queryString: queryStringAttendance
            })
          )
        }
        dispatch(setGettingAttendance(false))
      } catch (err: any) {
        console.error(err)
        toast.error(err.response.data.msg)
        setLoading(false)
      }
      setOpenLeft(false)
    }
  }

  const handleActive = async () => {
    setLoading(true)
    dispatch(disablePage(true))
    await dispatch(updateStudent({ id, status: 'active' }))
    dispatch(disablePage(false))
    toast.success("O'quvchi muvaffaqiyatli aktivlashtirildi")
    await dispatch(fetchStudentsList({ status: 'archive' }))
    setLoading(false)
  }

  async function getGroups() {
    await api
      .get(`common/group-check-list/?student=${student?.student?.id}`)
      .then(res => dispatch(setGroupChecklist(res.data)))
      .catch(error => console.error(error))
  }

  async function submitDelete() {
    setLoading(true)
    dispatch(disablePage(true))
    await api
      .delete(`student/destroy/${id}/`)
      .then(res => {
        toast.success("O'quvchi muvaffaqiyatli o'chirildi")
        dispatch(fetchStudentsList({ status: queryParams.status }))
      })
      .catch(err => {
        toast.error(err.response.data.msg || "O'quvchini o'chirib bo'lmadi")
        console.error(err)
      })

    dispatch(disablePage(false))
    setLoading(false)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <IconifyIcon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        id='fade-menu'
        MenuListProps={{
          'aria-labelledby': 'fade-button'
        }}
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={() => handleClose('none')}
        TransitionComponent={Fade}
      >
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          onClick={async () => {
            handleEditClickOpen('payment'), getGroups()
          }}
        >
          <Icon fontSize={'20px'} icon={'ic:baseline-payments'} />
          {t("To'lov")}
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: '7px' }} onClick={() => handleClose('export')}>
          <Icon fontSize={'20px'} icon={'tabler:status-change'} />
          {t("Boshqa guruhga ko'chirishsh")}
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: '7px' }} onClick={() => handleClose('left')}>
          <Icon fontSize={'20px'} icon={'material-symbols:group-remove'} />
          {student?.status == 'archive' ? t("Ba'zadan chiqarish") : t('Guruhdan chiqarish')}
        </MenuItem>
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          onClick={() => (dispatch(setOpenLeadModal(student?.id)), handleClose('none'))}
        >
          <Icon fontSize={'20px'} icon={'mdi:leads'} />
          {t('Lidlarga qaytarish')}
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: '7px' }} onClick={() => handleClose('notes')}>
          <Icon fontSize={'20px'} icon={'material-symbols:note-alt'} />
          {t('Eslatma')} +
        </MenuItem>
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          onClick={() => (handleClose('sms'), getSMSTemps())}
        >
          <Icon fontSize={'20px'} icon={'ic:baseline-message'} />
          {t('Xabar (sms)')} +
        </MenuItem>
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          onClick={() => (setActivate(true), handleClose('none'))}
        >
          <Icon fontSize={'20px'} icon={'ri:file-edit-fill'} />
          {t('Tahrirlash')}
        </MenuItem>
      </Menu>
      <StudentPaymentForm
        student_id={student?.student?.id}
        active_id={student?.id}
        group={query.id}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <Dialog open={openLeft} onClose={() => setOpenLeft(false)}>
        <DialogContent sx={{ maxWidth: '350px' }}>
          <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>
            {t("O'quvchini guruhdan chetlatishni tasdiqlang")}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Button onClick={() => setOpenLeft(false)} size='small' variant='outlined' color='error'>
              {t('Bekor qilish')}
            </Button>
            <LoadingButton loading={loading} onClick={handleLeft} size='small' variant='contained'>
              {t('Tasdiqlash')}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={openLeadModal} onClose={() => (dispatch(setOpenLeadModal(null)), handleClose('none'))}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '20px', textAlign: 'center' }}>{t("Lidlar bo'limga qo'shish")}</Typography>
          <IconifyIcon
            icon={'material-symbols:close'}
            onClick={() => (dispatch(setOpenLeadModal(null)), handleClose('none'))}
          />
        </DialogTitle>
        <DialogContent>
          <MergeToDepartment studentId={String(student?.id)} />
        </DialogContent>
      </Dialog>

      <EditStudent
        status={student?.status}
        student={student?.student}
        id={student?.id}
        activate={activate}
        setActivate={setActivate}
      />
      <AddNote id={student?.student?.id} modalRef={modalRef} setModalRef={setModalRef} />
      <SentSMS smsTemps={smsTemps} id={student?.student?.id} modalRef={modalRef} setModalRef={setModalRef} />
      <ExportStudent id={student?.id} modalRef={modalRef} setModalRef={setModalRef} />
    </>
  )
}
