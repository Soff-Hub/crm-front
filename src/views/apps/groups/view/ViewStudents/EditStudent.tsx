import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Select,
  TextField,
  Typography
} from '@mui/material'
import api from 'src/@core/utils/api'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { getAttendance, getDays, getStudents, setGettingAttendance } from 'src/store/apps/groupDetails'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import { useTranslation } from 'react-i18next'

export default function EditStudent({
  student,
  id,
  activate,
  setActivate,
  status
}: {
  student: any
  id: string
  activate: boolean
  setActivate: (status: boolean) => void
  status: string
}) {
  const { studentsQueryParams, queryParams, isLesson } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  const [isLoading, setLoading] = useState(false)
  const { query } = useRouter()
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: { added_at: student.added_at, status, lesson_count: student.lesson_count },
    validationSchema: () =>
      Yup.object({
        added_at: Yup.string(),
        status: Yup.string(),
        lesson_count: Yup.string()
      }),
    onSubmit: async values => {
      setLoading(true)
      try {
        await api.patch(`common/group-student-update/${id}`, values)
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

  return (
    <Dialog open={activate} onClose={() => setActivate(false)}>
      <DialogContent sx={{ minWidth: '350px' }}>
        <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>O'quvchini tahrirlash</Typography>
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Alert severity='error'>
            <AlertTitle>{t('Eslatma')}</AlertTitle>
            O'quvchi qoshilgan sana tahrirlansa, o'quvchining barcha <br /> qarzdorliklari o'chirilib qayta yaratiladi{isLesson ? " va to'lovgacha qolgan darslar soni ham o'zgaradi" : ''}
          </Alert>
          {isLesson && (
            <FormControl>
              <TextField
                size='small'
                name='lesson_count'
                value={formik.values.lesson_count}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label={'Qolgan darslar'}
              />
            </FormControl>
          )}
          <FormControl>
            <TextField
              error={!!formik.errors.added_at && !!formik.touched.added_at}
              name='added_at'
              type='date'
              value={formik.values.added_at}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label={"Qo'shilgan sana"}
              size='small'
            />
            {!!formik.errors.added_at && !!formik.touched.added_at && (
              <FormHelperText error>{`${formik.errors.added_at}`}</FormHelperText>
            )}
          </FormControl>
          {/* <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
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
              error={!!formik.errors.status && formik.touched.status}
            >
              <MenuItem value={'active'}>Aktiv</MenuItem>
              <MenuItem value={'new'}>Sinov darsi</MenuItem>
              <MenuItem value={'archive'}>Arxiv</MenuItem>
              <MenuItem value={'frozen'}>Muzlatish</MenuItem>
            </Select>
            <FormHelperText error>{formik.errors.status}</FormHelperText>
          </FormControl> */}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Button onClick={() => setActivate(false)} size='small' variant='outlined' color='error'>
              bekor qilish
            </Button>
            <LoadingButton loading={isLoading} type='submit' size='small' variant='contained'>
              Saqlash
            </LoadingButton>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
