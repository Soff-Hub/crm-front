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
import { deleteStudent, fetchStudentDetail, fetchStudentsList, updateStudent } from 'src/store/apps/students'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import StudentPaymentForm from '../students/view/StudentPaymentForm'
import { LoadingButton } from '@mui/lab'
import MergeToDepartment from './view/ViewStudents/MergeForm'
import EditStudent from './view/ViewStudents/EditStudent'
import AddNote from './view/ViewStudents/AddNote'
import SentSMS from './view/ViewStudents/SentSMS'
import ExportStudent from './view/ViewStudents/ExportStudent'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type Props = {
  id: number
}

export type ModalTypes = 'group' | 'withdraw' | 'payment' | 'sms' | 'delete' | 'edit' | 'notes' | 'parent'

export default function GroupDetailRowOptions({ id }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { push, query } = useRouter()
  const { students, studentsQueryParams, isGettingStudents, queryParams, openLeadModal,updateStatusModal } = useAppSelector(
    state => state.groupDetails
  )
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [recoveModal, setRecoveModal] = useState<boolean>(false)
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

  
  
  const formik = useFormik({
    initialValues: { status: updateStatusModal?.status },
    validationSchema: () =>
      Yup.object({
        status: Yup.string()
      }),
    onSubmit: async values => {

      setLoading(true)
      try {
        await api.patch(`common/group-student-update/status/${updateStatusModal?.id}/`, { status: values.status })
        toast.success("O'quvchi malumotlari o'zgartirildi", { position: 'top-center' })
        setLoading(false)
          setActivate(false)
          dispatch(setUpdateStatusModal(null))
        const queryString = new URLSearchParams({ ...studentsQueryParams }).toString()
        const queryStringAttendance = new URLSearchParams(queryParams).toString()
        dispatch(setGettingAttendance(true))
        await dispatch(getStudents({ id: query.id, queryString: queryString }))
        if (query.month && query?.id) {
          await dispatch(
            getAttendance({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
              group: query?.id,
              queryString: queryStringAttendance
            })
          )
          await dispatch(
            getDays({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
              group: query?.id
            })
          )
        }
        dispatch(setGettingAttendance(false))
      } catch (err: any) {
        formik.setErrors(err?.response?.data)
        console.log(err?.response?.data)
        setLoading(false)
      }
    }
  })

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
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleLeft = async () => {
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
      console.log(err)
      toast.error(err.response.data.msg)
      setLoading(false)
    }
    setOpenLeft(false)
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
        console.log(err)
      })

    dispatch(disablePage(false))
    setLoading(false)
    }
    
  useEffect(() => {
    if (updateStatusModal?.status) {
      formik.setFieldValue("status",updateStatusModal?.status)
    }
  }, [updateStatusModal])
  

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
          onClick={async () => handleEditClickOpen('payment')}
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
      <Dialog
        open={openLeadModal}
        onClose={() => (dispatch(setOpenLeadModal(null)), handleClose('none'))}
      >
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
      <Dialog open={updateStatusModal != null} onClose={() => dispatch(setUpdateStatusModal(null))}>
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <DialogContent sx={{ maxWidth: '350px' }}>
            <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>
              {t("O'quvchini statusini ozgartirish")}
            </Typography>

            <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
              <InputLabel size='small' id='demo-simple-select-outlined-label'>
                Status (holati)
              </InputLabel>
              <Select
                size='small'
                label='Status (holati)'
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                name='status'
                error={!!formik.errors.status && !!formik.touched.status}
              >
                {student?.choices?.map((el: any) => (
                  <MenuItem value={el} key={el}>
                    {t(el)}
                  </MenuItem>
                ))}
                {/* <MenuItem value={'new'}>Sinov darsi</MenuItem> */}
                {/* <MenuItem value={'archive'}>Arxiv</MenuItem> */}
                {/* <MenuItem value={'frozen'}>Muzlatish</MenuItem> */}
              </Select>
              <FormHelperText error>{!!formik.errors.status ? `${formik.errors.status}` : ''}</FormHelperText>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Button onClick={() => { dispatch(setUpdateStatusModal(null)),formik.resetForm() }} size='small' variant='outlined' color='error'>
                {t('Bekor qilish')}
              </Button>
              <LoadingButton loading={loading} type='submit' size='small' variant='contained'>
                {t('Tasdiqlash')}
              </LoadingButton>
            </Box>
          </DialogContent>
        </form>
      </Dialog>
      <EditStudent status={student?.status} student={student?.student} id={student?.id} activate={activate} setActivate={setActivate} />
      <AddNote id={student?.student?.id} modalRef={modalRef} setModalRef={setModalRef} />
      <SentSMS smsTemps={smsTemps} id={student?.student?.id} modalRef={modalRef} setModalRef={setModalRef} />
      <ExportStudent id={student?.id} modalRef={modalRef} setModalRef={setModalRef} />
    </>
  )
}
