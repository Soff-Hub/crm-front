import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  Fade,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import { formatDateTime } from 'src/@core/utils/date-formatter'
import { formatCurrency } from 'src/@core/utils/format-currency'
import showResponseError from 'src/@core/utils/show-response-error'
import { customTableProps } from 'src/pages/groups'
import * as Yup from 'yup'
import { getStudents, studentsUpdateParams } from 'src/store/apps/groupDetails';
import { useAppDispatch, useAppSelector } from 'src/store'
import { ModalTypes } from './ViewStudents/UserViewStudentsList'
import useBranches from 'src/hooks/useBranch'



export const getFormattedDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  let month: any = today.getMonth() + 1
  let day: any = today.getDate()

  // Ay va kunni ikki raqamli sifatida ko'rsatish uchun tekshirish
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return `${year}-${month}-${day}`
}

export interface ExamType {
  id: number
  title: string
  max_score: number
  min_score: number
  date: string
}

const UserViewBilling = () => {
  const { push,query } = useRouter()
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const [error, setError] = useState<any>({})
  const [open, setOpen] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [editData, setEditData] = useState<any>()
  const [exams, setExams] = useState<ExamType[]>([])
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [openLeft, setOpenLeft] = useState<boolean>(false)
  const { groupData, studentsQueryParams, isGettingStudents } = useAppSelector(state => state.groupDetails)
  const { getBranches, branches } = useBranches()
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [modalRef, setModalRef] = useState<'sms' | 'note' | 'export' | null>(null)

  const getExams = async () => {
    try {
      const resp = await api.get('common/group/students/' + query.id)
      setExams(resp.data?.response)
    } catch (err) {
      console.log(err)
    }
  }



  const handleEditOpen = async (id: any) => {
    const findedItem: any = await exams.find((el: any) => el.student.id === id)
    await setEditData(findedItem.student)
    setOpen('edit')
  }

  const handleDeleteOpen = async (id: any) => {
    setEditData(id)
    setOpen('delete')
  }

  const handleClose = () => {
    setLoading(false)
    setEditData(null)
    setOpen(null)
  }
 

  const handleDelete = async () => {
    setLoading(true)
    try {
      await api.delete(`common/personal-payment/${editData}`)
      await getExams()
      await dispatch(studentsUpdateParams({ status: 'active,new' }))
      const queryString = new URLSearchParams(studentsQueryParams).toString()
      await dispatch(getStudents({ id: query.id, queryString: queryString }))
      handleClose()
    } catch (err: any) {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (values: any) => {
    setLoading(true)
    try {
      await api.post('common/personal-payment/', { ...values, group: query.id, student: Number(editData.id) })
      await getExams()
      handleClose()
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  const columns: customTableProps[] = [
    {
      xs: 0.03,
      title: t('#'),
      dataIndex: 'index'
    },
    {
      xs: 0.25,
      title: t('first_name'),
      dataIndex: 'student',
      render: (student: any) => student.first_name
    },
    {
      xs: 0.2,
      title: t('Chegirma soni'),
      dataIndex: 'student',
      render: (student: any) => student.personal_amount?.discount_count || "bo'sh"
    },
    {
      xs: 0.2,
      title: t('Berilgan sana'),
      dataIndex: 'student',
      render: (student: any) =>
        student.personal_amount?.created_at ? formatDateTime(student.personal_amount?.created_at) : "bo'sh"
    },
    {
      xs: 0.3,
      title: t('Izoh'),
      dataIndex: 'student',
      render: (student: any) => student.personal_amount?.description || "bo'sh"
    },
    {
      xs: 0.2,
      title: t('Chegirmadagi kurs narxi'),
      dataIndex: 'student',
      render: (student: any) =>
        student.personal_amount ? `${formatCurrency(student.personal_amount?.amount)}` : "yo'q"
    },
    {
      xs: 0.12,
      title: t('Amallar'),
      dataIndex: 'student',
      render: (student: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {student?.personal_amount ? (
            <IconifyIcon
              icon='mdi:delete'
              fontSize={20}
              onClick={() => handleDeleteOpen(student?.personal_amount?.id)}
            />
          ) : (
            <IconifyIcon icon='mdi:add' fontSize={20} onClick={() => handleEditOpen(student.id)} />
          )}
        </div>
      )
    }
  ]

  const validationSchema = Yup.object().shape({
    amount: Yup.number().required(t("To'ldirish majburiy") as string),
    discount_count: Yup.string().required(t("To'ldirish majburiy") as string),
    description: Yup.string().required(t("To'ldirish majburiy") as string)
  })

  const formik: any = useFormik({
    initialValues: {
      amount: 0,
      discount_count: '0',
      description: ''
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      try {
        await api.post('common/personal-payment/', { ...values, group: query.id, student: Number(editData.id) })
        await dispatch(studentsUpdateParams({ status: 'active,new' }))
        const queryString = new URLSearchParams(studentsQueryParams).toString()
        await dispatch(getStudents({ id: query.id, queryString: queryString }))
        await getExams()
        
        handleClose()
      } catch (err: any) {
        showResponseError(err.response.data, setError)
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    if (query?.id) {
      getExams()
    }
  }, [query.id])

  useEffect(() => {
    if (open !== 'edit') {
      formik.resetForm()
    }
  }, [open])

  return (
    <Box className='demo-space-y'>
      <DataTable maxWidth='100%' minWidth='450px' data={exams} columns={columns} />

      <Drawer open={open === 'edit'} anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            width: isMobile ? '320px' : '400px'
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t("O'quvchiga chegirma yarating")}
          </Typography>
          <IconButton
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
            onClick={handleClose}
          >
            <IconifyIcon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
     
        {editData && (
          <form
            onSubmit={formik.handleSubmit}
            style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <FormControl>
              <TextField
                size='small'
                label={t('Chegirmadagi kurs narxi')}
                type='number'
                name='amount'
                error={!!formik.errors.amount && !!formik.touched.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.amount}
              />
              {!!formik.errors.amount && !!formik.touched.amount && (
                <FormHelperText error>{formik.errors.amount}</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <InputLabel
                error={!!formik.errors.discount_count && !!formik.touched.discount_count}
                size='small'
                id='sale-count'
              >
                {t('Chegirma soni')}
              </InputLabel>
              <OutlinedInput
                id='sale-count'
                size='small'
                label={t('Chegirma soni')}
                name='discount_count'
                error={!!formik.errors.discount_count && !!formik.touched.discount_count}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.discount_count}
                endAdornment={
                  <Tooltip
                    placement='left'
                    title="Chegirma soni - bu necha oy uchun chegirma amalda bo'lishi hisoblanadi. M-u: 4 sonini kiritsangiz, keyingi 4 oy uchun talabaga chegirma berildi deb hisoblanadi."
                  >
                    <span style={{ fontSize: '20px', fontWeight: 700, cursor: 'pointer' }}>?</span>
                  </Tooltip>
                }
              />
              {!!formik.errors.discount_count && !!formik.touched.discount_count && (
                <FormHelperText error>{formik.errors.discount_count}</FormHelperText>
              )}
            </FormControl>

            <FormControl>
              <TextField
                size='small'
                multiline
                rows={4}
                label={t('Izoh')}
                name='description'
                error={!!formik.errors.description && !!formik.touched.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {!!formik.errors.description && !!formik.touched.description && (
                <FormHelperText error>{formik.errors.description}</FormHelperText>
              )}
            </FormControl>

            <LoadingButton loading={loading} variant='outlined' type='submit'>
              {t('Saqlash')}
            </LoadingButton>
          </form>
        )}
      </Drawer>

      <Dialog open={open === 'delete'}>
        <DialogContent sx={{ padding: '40px' }}>
          <Typography fontSize={26}>Rostdan ham o'chirmqochimisiz?</Typography>
          <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <LoadingButton color='primary' variant='contained' onClick={handleClose}>
              Bakor qilish
            </LoadingButton>
            <LoadingButton loading={loading} color='error' variant='outlined' onClick={() => handleDelete()}>
              {' '}
              Ha O'chirish
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default UserViewBilling
