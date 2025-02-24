import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText
  } from '@mui/material'
  import { useEffect, useState } from 'react'
  import { useTranslation } from 'react-i18next'
  import { Formik, Form } from 'formik'
  import * as Yup from 'yup'
  import api from 'src/@core/utils/api'
  import toast from 'react-hot-toast'
  
  export function AddStudentModal({
    openModal,
    setOpenModal,
    id
  }: {
    openModal: boolean
    setOpenModal: (status: boolean) => void
    id: number | string
  }) {
    const { t } = useTranslation()
    const [branches, setBranches] = useState([])
  
    async function getBranches() {
      api.get(`/owner/tenant/branches/${id}/`).then(res => {
        setBranches(res.data)
      })
    }
  
    useEffect(() => {
      if (openModal) {
        getBranches()
      }
    }, [openModal])
  
    const validationSchema = Yup.object().shape({
      branches: Yup.array().min(1, t('Filialni tanlang') || 'Filialni tanlang'),
      file: Yup.mixed()
        .required(t('Fayl yuklang') || 'Fayl yuklang')
        .test('fileFormat', t('Faqat .xlsx, .xls yoki .csv yuklash mumkin')||'Faqat .xlsx, .xls yoki .csv yuklash mumkin', (value: any) => {
          if (!value) return false
          return ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(value.type)
        })
    })
  
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
      const formData = new FormData()
      formData.append('branches', values.branches.join(','))
      formData.append('file', values.file)
  
  
      await api
        .post(`/owner/tenant/students/import/${id}`, formData)
        .then(res => {
          setOpenModal(false)
          toast.success("Fayl muvaffaqiyatli yuklandi")
        })
        .catch((err: any) => {
          toast.error(err.response?.data?.msg || "Xatolik yuz berdi")
        })
  
      setSubmitting(false)
    }
  
    return (
      <Dialog fullWidth onClose={() => setOpenModal(false)} open={openModal}>
        <DialogTitle>{t("Talaba qo'shish")}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ branches: [], file: null }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
              <Form>
                {/* Filial tanlash */}
                <FormControl sx={{ marginTop: 3 }} fullWidth error={touched.branches && !!errors.branches}>
                  <InputLabel id='branch-label'>{t('Filial')}</InputLabel>
                                <Select
                                    label="Filial"
                    labelId='branch-label'
                    multiple
                    name='branches'
                    value={values.branches}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {branches.map((branch: any) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.branches && errors.branches && <FormHelperText>{errors.branches}</FormHelperText>}
                </FormControl>
  
                {/* Fayl yuklash */}
                <FormControl sx={{ marginTop: 3 }} fullWidth error={touched.file && !!errors.file}>
                  <input
                    type='file'
                    name='file'
                    accept='.xlsx,.xls,.csv'
                    onChange={(event: any) => setFieldValue('file', event.target.files[0])}
                    onBlur={handleBlur}
                  />
                  {touched.file && errors.file && <FormHelperText>{errors.file}</FormHelperText>}
                </FormControl>
  
                {/* Tugmalar */}
                <DialogActions sx={{ marginTop: 3 }}>
                  <Button variant='outlined' onClick={() => setOpenModal(false)}>
                    {t('Bekor qilish')}
                  </Button>
                  <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                    {t('Yuborish')}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    )
  }  