import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
  Typography
} from '@mui/material'
import Status from 'src/@core/components/status'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import IconifyIcon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import Link from 'next/link'
import { formatDateTime } from 'src/@core/utils/date-formatter'
import { useRouter } from 'next/router'
import { AuthContext } from 'src/context/AuthContext'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import useSMS from 'src/hooks/useSMS'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import * as Yup from 'yup'

import {
  getAttendance,
  getDays,
  getStudents,
  setGettingAttendance,
  setOpenLeadModal,
  studentsUpdateParams
} from 'src/store/apps/groupDetails'
import SubLoader from '../../../loaders/SubLoader'
import useDebounce from 'src/hooks/useDebounce'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import SentSMS from './SentSMS'
import AddNote from './AddNote'
import EditStudent from './EditStudent'
import EmptyContent from 'src/@core/components/empty-content'
import ExportStudent from './ExportStudent'
import MergeToDepartment from './MergeForm'
import { Icon } from '@iconify/react'
import { formatCurrency } from 'src/@core/utils/format-currency'
import StudentPaymentForm from 'src/views/apps/students/view/StudentPaymentForm'
import useBranches from 'src/hooks/useBranch'
import { useFormik } from 'formik'
import useResponsive from 'src/@core/hooks/useResponsive'

interface StudentType {
  id: number | string
  student: {
    first_name: string
    phone: string
    balance: number
    added_at: string
    lesson_count: null | number
    deleted_at: string
    activated_at: string
    created_at: string
    comment: {
      comment: string
      user: string
      created_at: string
    }
    id: string
    status: string
  }
}

interface ItemTypes {
  item: StudentType
  index: any
  status?: any
  activeId?: any
  reRender: any
  choices?: string[]
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    width: '300px',
    minHeight: '300px',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))
export type ModalTypes = 'group' | 'withdraw' | 'payment' | 'sms' | 'delete' | 'edit' | 'notes' | 'parent'

export const UserViewStudentsItem = ({ item, index, status, activeId, choices }: ItemTypes) => {
  const { studentsQueryParams, queryParams, openLeadModal } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  const { student, id: studentStatusId } = item
  const {
    first_name,
    phone,
    lesson_count,
    added_at,
    // status: student_status,
    deleted_at,
    balance,
    comment,
    id
  } = student
  const student_status = status
  const { push, query } = useRouter()
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [openLeft, setOpenLeft] = useState<boolean>(false)
  const [activate, setActivate] = useState<boolean>(false)
  const [updateStatusModal, setUpdateStatusModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [modalRef, setModalRef] = useState<'sms' | 'note' | 'export' | null>(null)
  const { smsTemps, getSMSTemps } = useSMS()
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const { t } = useTranslation()
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

  const formik = useFormik({
    initialValues: { status: student_status },
    validationSchema: () =>
      Yup.object({
        status: Yup.string()
      }),
    onSubmit: async values => {
      console.log(values)

      setLoading(true)
      try {
        await api.patch(`common/group-student-update/status/${studentStatusId}/`, { status: values.status })
        toast.success("O'quvchi malumotlari o'zgartirildi", { position: 'top-center' })
        setLoading(false)
        setActivate(false)
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

  const handleLeft = async () => {
    setLoading(true)
    try {
      await api.delete(`common/group-student-delete/${studentStatusId}/`)
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

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '10px 10px 0.5fr 1fr 20px', alignItems: 'center', gap: 2 }}>
      <Typography sx={{ width: '20px' }}>{index}.</Typography>
      <Status
        color={
          status == 'active' ? 'success' : status == 'new' ? 'warning' : status == 'frozen' ? 'secondary' : 'error'
        }
      />
      {!(user?.role.length === 1 && user?.role.includes('teacher')) ? (
        <HtmlTooltip
          title={
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Box>
                  <Typography fontSize={12}>{first_name}</Typography>
                  <Typography variant='body2' fontSize={12}>
                    {t(status)}
                  </Typography>
                </Box>
                <Typography variant='body2' fontSize={10}>{`( ID: ${activeId} )`}</Typography>
              </Box>
              <Box py={1} borderTop={'1px solid #c3cccc'}>
                <Typography variant='body2' fontSize={12}>
                  {t('phone')}
                </Typography>
                <Typography fontSize={12}>{phone}</Typography>
              </Box>
              <Box py={1} borderTop={'1px solid #c3cccc'}>
                <Typography variant='body2' fontSize={12}>
                  {t('Balans')}
                </Typography>
                <Typography fontSize={12}>{`${balance} so'm`}</Typography>
              </Box>
              {lesson_count != 0 ? (
                <Box py={1} borderTop={'1px solid #c3cccc'}>
                  <Typography variant='body2' fontSize={12}>
                    {t("To'lovgacha qolgan darslar")}
                  </Typography>
                  <Typography fontSize={12}>{`${lesson_count} ta`}</Typography>
                </Box>
              ) : (
                ''
              )}
              {studentsQueryParams.status == 'archive' ? (
                <Box py={1} borderTop={'1px solid #c3cccc'}>
                  <Typography variant='body2' fontSize={12}>
                    {t("Talaba qo'shilgan va o'chirilgan sana")}
                  </Typography>
                  <Typography fontSize={12}>
                    {added_at} / {deleted_at}
                  </Typography>
                </Box>
              ) : (
                <Box py={1} borderTop={'1px solid #c3cccc'}>
                  <Typography variant='body2' fontSize={12}>
                    {t("Talaba qo'shilgan sana")}
                  </Typography>
                  <Typography fontSize={12}>{added_at}</Typography>
                </Box>
              )}
              {comment && (
                <Box py={1} borderTop={'1px solid #c3cccc'}>
                  <Typography variant='body2' fontSize={12}>
                    {t('Eslatma')}
                  </Typography>
                  <Typography fontSize={12} fontStyle={'italic'}>
                    {comment.comment}
                  </Typography>
                  <Typography fontSize={12} variant='body2'>{`${comment.user} ${formatDateTime(
                    comment.created_at
                  )}`}</Typography>
                </Box>
              )}
            </Box>
          }
        >
          <Link href={`/students/view/security/?student=${id}`} style={{ textDecoration: 'underline', color: 'gray' }}>
            <Typography sx={{ cursor: 'pointer' }} fontSize={10}>
              {first_name}
            </Typography>
          </Link>
        </HtmlTooltip>
      ) : (
        <Typography sx={{ cursor: 'pointer' }} fontSize={7}>
          {first_name}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '100%' }}>
        <Typography fontSize={8} flexGrow={1} textAlign={'start'} mr={3}>
          {phone}
        </Typography>

        <div className='cursor:pointer' onClick={() => setUpdateStatusModal(true)}>
          <Box sx={{ textAlign: 'start', mr: 3 }}>
            {student_status === 'active' ? (
              <Chip
                label={student_status}
                color='success'
                variant='outlined'
                size='small'
                sx={{ fontWeight: 500, fontSize: '9px', padding: 0 }}
              />
            ) : student_status === 'archive' ? (
              <Chip
                label={student_status}
                color='error'
                variant='outlined'
                size='small'
                sx={{ fontWeight: 500, fontSize: '9px', padding: 0 }}
              />
            ) : student_status === 'in_progress' ? (
              <Chip
                label={student_status}
                color='info'
                variant='outlined'
                size='small'
                sx={{ fontWeight: 500, fontSize: '9px', padding: 0 }}
              />
            ) : (
              <Chip
                label={student_status}
                color='warning'
                variant='outlined'
                size='small'
                sx={{ fontWeight: 500, fontSize: '9px', padding: 0 }}
              />
            )}
          </Box>
        </div>
        {!isMobile && (
          <Box sx={{ textAlign: 'start', mr: 8 }}>
            {Number(balance) < 0 ? (
              <Chip
                label={`${formatCurrency(+balance)} so'm`}
                color='error'
                variant='outlined'
                size='small'
                sx={{ fontWeight: 500, fontSize: '9px', padding: 0 }}
              />
            ) : (
              <Chip
                label={`${formatCurrency(+balance)} so'm`}
                color='success'
                variant='outlined'
                size='small'
                sx={{ fontWeight: 500, fontSize: '9px', padding: 0 }}
              />
            )}
          </Box>
        )}
      </Box>
      <Typography
        sx={{ ml: 3 }}
        fontSize={11}
        id='fade-button'
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        style={{ cursor: 'pointer' }}
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
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: '7px' }} onClick={() => handleClose('export')}>
          <Icon fontSize={'20px'} icon={'tabler:status-change'} />
          {t("Boshqa guruhga ko'chirishsh")}
        </MenuItem>
        <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: '7px' }} onClick={() => handleClose('left')}>
          <Icon fontSize={'20px'} icon={'material-symbols:group-remove'} />
          {student_status == 'archive' ?
            t("Ba'zadan chiqarish"):
             t('Guruhdan chiqarish')  
          }
        </MenuItem>
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          onClick={() => (dispatch(setOpenLeadModal(studentStatusId)), handleClose('none'))}
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
      <StudentPaymentForm student_id={id} openEdit={openEdit} setOpenEdit={setOpenEdit} />

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
        open={openLeadModal == studentStatusId}
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
          <MergeToDepartment studentId={String(studentStatusId)} />
        </DialogContent>
      </Dialog>
      <Dialog open={updateStatusModal} onClose={() => setUpdateStatusModal(false)}>
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
                {choices?.map(el => (
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
              <Button onClick={() => setUpdateStatusModal(false)} size='small' variant='outlined' color='error'>
                {t('Bekor qilish')}
              </Button>
              <LoadingButton loading={loading} type='submit' size='small' variant='contained'>
                {t('Tasdiqlash')}
              </LoadingButton>
            </Box>
          </DialogContent>
        </form>
      </Dialog>
      <EditStudent status={status} student={student} id={activeId} activate={activate} setActivate={setActivate} />
      <AddNote id={id} modalRef={modalRef} setModalRef={setModalRef} />
      <SentSMS smsTemps={smsTemps} id={id} modalRef={modalRef} setModalRef={setModalRef} />
      <ExportStudent id={studentStatusId} modalRef={modalRef} setModalRef={setModalRef} />
    </Box>
  )
}

export default function UserViewStudentsList() {
  const { students, studentsQueryParams, isGettingStudents } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const debounce = useDebounce(search, 500)
  const { query } = useRouter()

  useEffect(() => {
    ;(function () {
      const queryString = new URLSearchParams({ ...studentsQueryParams, search: debounce }).toString()
      dispatch(getStudents({ id: query.id, queryString: queryString }))
      dispatch(studentsUpdateParams({ search: debounce }))
    })()
  }, [debounce])
  console.log(students);
  

  return (
    <Box>
      <TextField
        onChange={e => setSearch(e.target.value)}
        autoComplete='off'
        placeholder={t('Qidirish')}
        size='small'
        fullWidth
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: '10px', gap: '5px' }}>
        {isGettingStudents ? (
          <SubLoader />
        ) : students?.length ? (
          students?.map((el: any, index: any) => (
            <UserViewStudentsItem
              reRender={() => {}}
              key={el.id}
              activeId={el.id}
              item={el}
              choices={el?.choices}
              index={index + 1}
              status={el.status}
            />
          ))
        ) : (
          <Box sx={{ paddingX: '50px' }}>
            <EmptyContent />
          </Box>
        )}
      </Box>
    </Box>
  )
}
