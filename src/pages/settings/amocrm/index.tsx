import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Button, Box, TextField } from '@mui/material'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import api from 'src/@core/utils/api'
import { Loader } from 'rsuite'
import SubLoader from 'src/views/apps/loaders/SubLoader'

const AmoCrmPage = () => {
  const [loading, setLoading] = useState(false)
  const [pageLoader, setPageLoader] = useState(false)
  // Initial form values
  const initialValues = {
    client_secret: '',
    client_id: '',
    auth_code: '',
    subdomain: ''
  }

  async function getAmoCrmData() {
    setPageLoader(true)
    await api
      .get('/amocrm/data/')
      .then(res => {
        formik.setValues(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    setPageLoader(false)
  }

  useEffect(() => {
    getAmoCrmData()
  }, [])

  // Validation Schema
  const validationSchema = Yup.object({
    client_secret: Yup.string().required('Secret Key is required'),
    client_id: Yup.string().required('Integration ID is required'),
    auth_code: Yup.string().required('Authorization Code is required'),
    subdomain: Yup.string().required('Sub Domain is required')
  })

  // Formik hook for form management
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async values => {
      setLoading(true)
      await api
        .post('/amocrm/init-tokens/', values)
        .then(res => {
          console.log(res)
          console.log('Form Submitted:', values)
          setLoading(false)
          toast.success('Tekshiruvdan otdingiz')
        })
        .catch(err => {
          if (err.response.data.msg) {
            toast.error(err.response.data.msg)
          } else {
            formik.setErrors(err.response.data)
          }
          setLoading(false)
        })
    }
  })

  return pageLoader == true ? (
    <SubLoader />
  ) : (
    <>
      <VideoHeader item={videoUrls.amocrm} />
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        sx={{
          backgroundColor: 'white',
          width: '50%',
          borderRadius: 2,
          maxHeight: '100vh',
          padding: 3,
          margin: '0 auto'
        }}
      >
        <form onSubmit={formik.handleSubmit} style={{ width: '100%', maxWidth: 600 }}>
          <Box display='flex' alignItems='center' justifyContent='center' padding={10}>
            <img width={400} height={50} src='/images/pages/amo-crm.jpg' alt='Amo CRM' />
          </Box>
          <Box display='flex' flexDirection='column' gap={2}>
            {/* Secret Key */}
            <TextField
              fullWidth
              label='Secret Key'
              name='client_secret'
              variant='outlined'
              value={formik.values.client_secret}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.client_secret && Boolean(formik.errors.client_secret)}
              helperText={formik.touched.client_secret && formik.errors.client_secret}
            />

            {/* Integration ID */}
            <TextField
              fullWidth
              label='Integration ID'
              name='client_id'
              variant='outlined'
              value={formik.values.client_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.client_id && Boolean(formik.errors.client_id)}
              helperText={formik.touched.client_id && formik.errors.client_id}
            />

            {/* Authorization Code */}
            <TextField
              fullWidth
              label='Authorization Code'
              name='auth_code'
              variant='outlined'
              value={formik.values.auth_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.auth_code && Boolean(formik.errors.auth_code)}
              helperText={formik.touched.auth_code && formik.errors.auth_code}
            />

            {/* Sub Domain */}
            <TextField
              fullWidth
              label='Sub Domain'
              name='subdomain'
              variant='outlined'
              value={formik.values.subdomain}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subdomain && Boolean(formik.errors.subdomain)}
              helperText={formik.touched.subdomain && formik.errors.subdomain}
            />
          </Box>

          {/* Submit Button */}
          <Box display='flex' justifyContent='flex-end' paddingBottom={5} paddingTop={5} mt={2}>
            <Button type='submit' variant='outlined' color='primary' disabled={loading}>
              {loading ? 'Jarayonda...' : 'Saqlash'}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  )
}

export default AmoCrmPage
