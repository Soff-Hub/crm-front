import MenuItem from '@mui/material/MenuItem'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { fetchGroupChecklist, fetchGroups } from 'src/store/apps/groups'
import { today } from 'src/@core/components/card-statistics/kanban-item'
import { getAttendance, getStudents, setGettingAttendance } from 'src/store/apps/groupDetails'
import { useRouter } from 'next/router'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'

export default function ExportStudent({
  id,
  modalRef,
  setModalRef
}: {
  id: any
  modalRef: string | null
  setModalRef: any
}) {
  const [isLoading, setLoading] = useState(false)
  const { groupChecklist } = useAppSelector(state => state.groups)
  const { groupData } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { query } = useRouter()

  const [isDiscount, setIsDiscount] = useState<boolean>(false)

  const formik: any = useFormik({
    initialValues: { new_group: '', fixed_price: '0' },
    validationSchema: () =>
      Yup.object({
        // added_at: Yup.string().required(t("Maydonni to'ldiring") as string),
        new_group: Yup.string().required(t("Maydonni to'ldiring") as string),
        fixed_price: Yup.number().required("To'ldiring")
      }),
    onSubmit: async values => {
      setLoading(true)
      try {
        const discountConfig = {
          discount_amount: values?.fixed_price,
          discount_count: 100,
          discount_description: 'kurs oxirigacha',
          groups: [values?.new_group],
          student: id,
          is_discount: isDiscount
        }

        const response = await api.post('common/group-student/export/', {
          ...values,
          group_student: id,
          ...discountConfig
        })
        if (response.status == 201) {
          toast.success(t("O'quvchi guruhga ko'chirildi") as string)
          await dispatch(getStudents({ id: groupData?.id, queryString: '' }))
          dispatch(setGettingAttendance(true))
          if (query.month && query?.id) {
            await dispatch(
              getAttendance({
                date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
                group: query?.id,
                queryString: ''
              })
            )
          }
          dispatch(setGettingAttendance(false))
        }
        setLoading(false)
        setModalRef(null)
      } catch (err: any) {
        formik.setErrors(err.response.data)
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    if (modalRef === 'export' && !groupChecklist?.length) {
      dispatch(fetchGroupChecklist())
    }
  }, [modalRef])

  return (
    <Dialog
      open={modalRef === 'export'}
      onClose={() => setModalRef(null)}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t("O'quvchini boshqa guruhga ko'chirish")}
      </DialogTitle>
      <DialogContent>
        <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit}>
          <FormControl sx={{ maxWidth: '100%', mb: 3 }} fullWidth>
            <InputLabel
              error={!!formik.errors.new_group && formik.touched.new_group}
              size='small'
              id='demo-simple-select-outlined-label'
            >
              Yangi guruh
            </InputLabel>
            <Select
              error={!!formik.errors.new_group && formik.touched.new_group}
              size='small'
              label={t('Yangi guruh')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              name='new_group'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.new_group}
            >
              {groupChecklist
                ?.filter(el => el.id !== groupData?.id)
                ?.map((el: any) => (
                  <MenuItem value={el.id} sx={{ wordBreak: 'break-word' }}>
                    <span style={{ maxWidth: '250px', wordBreak: 'break-word' }}>
                      {el.name}{' '}
                      {`[${el.start_at?.split(':').slice(0, 2).join(':')} - ${el.end_at
                        ?.split(':')
                        .slice(0, 2)
                        .join(':')}]`}
                    </span>
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText error>
              {!!formik.errors.new_group && formik.touched.new_group && formik.errors.new_group}
            </FormHelperText>
          </FormControl>

          {/* {formik.values?.new_group && (
            <Box className='w-100'>
              {isDiscount && (
                <div>
                  <TextField
                    size='small'
                    label={t('Alohida narx')}
                    name='fixed_price'
                    type='number'
                    error={!!formik.errors.fixed_price && formik.touched.fixed_price}
                    value={formik.values.fixed_price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                  />
                  <FormHelperText className='mb-2' error={true}>
                    {formik.errors.fixed_price}
                  </FormHelperText>
                </div>
              )}

              <Button
                onClick={() => setIsDiscount(!isDiscount)}
                type='button'
                variant='outlined'
                size='small'
                color='warning'
              >
                {isDiscount ? "Alohida narxni o'chirish" : 'Alohida narx kiritish'}
              </Button>
            </Box>
          )} */}

          {/* <FormControl sx={{ maxWidth: '100%', mb: 3 }} fullWidth>
                        <InputLabel error={!!formik.errors.status && formik.touched.status} size='small' id='demo-simple-select-outlined-label'>Guruhdagi holati</InputLabel>
                        <Select
                            error={!!formik.errors.status && formik.touched.status}
                            size='small'
                            label={t("Guruhdagi holati")}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            name='status'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.status}
                        >
                            {
                                ['new', 'active', 'frozen'].map((el: any) => (
                                    <MenuItem value={el} sx={{ wordBreak: 'break-word' }}>
                                        {el === 'new' ? t('test') : t(el)}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText error>{!!formik.errors.status && formik.touched.status && formik.errors.status}</FormHelperText>
                    </FormControl>


                    <FormControl fullWidth>
                        <TextField
                            label={t("Qo'shilgan sanasi")}
                            error={!!formik.errors.added_at && formik.touched.added_at}
                            value={formik.values.added_at}
                            size='small'
                            name='added_at'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type='date'
                        />
                        <FormHelperText error>{!!formik.errors.added_at && formik.touched.added_at && formik.errors.added_at}</FormHelperText>
                    </FormControl> */}

          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' type='button' color='secondary' onClick={() => setModalRef(null)}>
              {t('Bekor Qilish')}
            </Button>
            <LoadingButton loading={isLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
              {t('Saqlash')}
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
