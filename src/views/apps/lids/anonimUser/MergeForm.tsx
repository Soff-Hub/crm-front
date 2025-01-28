import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchAmoCrmPipelines,
  fetchDepartmentList,
  updateAmoCrmStudent,
  updateDepartmentStudent
} from 'src/store/apps/leads'
import toast from 'react-hot-toast'

type Props = {
  item: any
  reRender: any
  is_amocrm?: boolean
  open: any
  setOpen:(val:any)=>void
}

export default function MergeToDepartment({ setOpen,open, is_amocrm, item, reRender }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { loading, leadData, pipelines } = useAppSelector(state => state.leads)
  const [department, setDepartment] = useState<any>(null)

  const validationSchema = Yup.object({
    department: Yup.number().required("Bo'limni tanlang")
  })

  const initialValues: {
    department: number | null
  } = {
    department: null
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      const action =
        open === 'merge-to'
          ? is_amocrm
            ? updateDepartmentStudent({
                is_amocrm,
                id: item.id,
                data: { department: values.department, lead_id: item.id }
              })
            : updateDepartmentStudent({
                is_amocrm,
                id: item.id,
                data: { ...values }
              })
          : updateAmoCrmStudent({
              is_amocrm,
              id: item.id,
              data: { department: values.department, lead_id: item.id }
            })

      if (action) {
        const resp = await dispatch(action)
        if (resp.meta.requestStatus === 'rejected') {
          formik.setErrors(resp.payload)
        } else {
          toast.success('Muvaffaqiyatli kochirildi')
           setOpen(null)
          await dispatch(fetchAmoCrmPipelines({}))
          await dispatch(fetchDepartmentList())

          formik.resetForm()
        }
      }
    }
  })

  const { values, errors, touched, handleBlur, handleChange } = formik

  useEffect(() => {
    return () => {
      formik.resetForm()
    }
  }, [])

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        minWidth: '280px',
        maxWidth: '350px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '5px'
      }}
    >
      <FormControl fullWidth>
        <InputLabel>{t("Bo'lim")}</InputLabel>
        <Select label={t("Bo'lim")} defaultValue={''} onChange={e => setDepartment(e.target.value)}>
          {open == 'merge-to'
            ? leadData?.map((el: any) => (
                <MenuItem key={el.id} value={el.id}>
                  {el.name}
                </MenuItem>
              ))
            : pipelines.map((el: any) => (
                <MenuItem key={el.id} value={el.id}>
                  {el.name}
                </MenuItem>
              ))}
        </Select>
      </FormControl>

      {department && (
        <FormControl fullWidth>
          <InputLabel error={!!errors.department && touched.department}>{t("Bo'lim")}</InputLabel>
          <Select
            label={t("Bo'lim")}
            name='department'
            error={!!errors.department && touched.department}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.department}
          >
            {open == 'merge-to'
              ? leadData
                  ?.find((item: any) => item.id === department)
                  ?.children?.map((el: any) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  ))
              : pipelines
                  .find((item: any) => item.id === department)
                  ?.children?.map((el: any) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  ))}
          </Select>
          {!!errors.department && touched.department && <FormHelperText error>{errors.department}</FormHelperText>}
        </FormControl>
      )}

      <LoadingButton loading={loading} type='submit' variant='outlined'>
        {t("Ko'chirish")}
      </LoadingButton>
    </form>
  )
}
