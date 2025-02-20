import * as React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'
import * as Yup from 'yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { TextField } from '@mui/material'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: 'none',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1,
  p: 5
}

interface ModalProps {
  isModalOpen: boolean
  setIsModalOpen: (status: boolean) => void
}

const validationSchema = Yup.object().shape({
  old_password: Yup.string().required('Hozirgi parolni kiriting'),
  password1: Yup.string().required('Yangi parolni kiriting'),
  password2: Yup.string()
    .oneOf([Yup.ref('password1'), null], 'Parollar mos kelmadi')
    .required('Parolni qayta kiriting')
})

export default function StudentEditProfileModal({ isModalOpen, setIsModalOpen }: ModalProps) {
  const handleClose = () => setIsModalOpen(false)
  const [loading,setLoading] = React.useState(false)
  return (
    <div>
      {/* <Button onClick={() => setIsModalOpen(true)}>Open modal</Button> */}
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Parolni o'zgartirish
          </Typography>

          <Formik
            initialValues={{ old_password: '', password1: '', password2: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
              try {
                setLoading(true)
                const response = await api.post('auth/change-password/', {
                  old_password: values.old_password,
                  password1: values.password1,
                  password2: values.password2
                })
                setLoading(false)
                resetForm()
                handleClose()
                toast.success("Muvaffaqiyatli o'zgartirildi", {
                  position: 'top-center'
                })
              } catch (error: any) {
                setLoading(false)
                console.error('Failed to change password:', error)
                if (error.response && error.response.data) {
                  setErrors(error.response.data)
                } else {
                  toast.error("Xatolik yuz berdi", {
                    position: 'top-center',
                  })
                }
              } finally {
                setSubmitting(false)
                setLoading(false)
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Box mb={3}>
                  <Field name='old_password'>
                    {({ field }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        size='small'
                        fullWidth
                        placeholder='Hozirgi parolni kiriting'
                        error={touched.old_password && Boolean(errors.old_password)}
                        helperText={touched.old_password && errors.old_password}
                      />
                    )}
                  </Field>
                </Box>
                <Box mb={3}>
                  <Field name='password1'>
                    {({ field }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        size='small'
                        fullWidth
                        placeholder='Yangi parolni kiriting'
                        error={touched.password1 && Boolean(errors.password1)}
                        helperText={touched.password1 && errors.password1}
                      />
                    )}
                  </Field>
                </Box>
                <Box mb={3}>
                  <Field name='password2'>
                    {({ field }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        size='small'
                        fullWidth
                        placeholder='Parolni qayta kiriting'
                        error={touched.password2 && Boolean(errors.password2)}
                        helperText={touched.password2 && errors.password2}
                      />
                    )}
                  </Field>
                </Box>
                <LoadingButton loading={loading}  type='submit' variant='contained' color='primary' fullWidth>
                  Saqlash
                </LoadingButton>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  )
}
