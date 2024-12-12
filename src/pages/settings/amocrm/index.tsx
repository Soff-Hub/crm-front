import React, { useState } from 'react'
import { useFormik } from 'formik'
import { Button, Box, TextField } from '@mui/material'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'

const AmoCrmPage = () => {
  const [loading, setLoading] = useState(false)

  // Initial form values
  const initialValues = {
    secretKey: '',
    integrationId: '',
    authorizationCode: '',
    subDomain: ''
  }

  // Validation Schema
  const validationSchema = Yup.object({
    secretKey: Yup.string().required('Secret Key is required'),
    integrationId: Yup.string().required('Integration ID is required'),
    authorizationCode: Yup.string().required('Authorization Code is required'),
    subDomain: Yup.string().required('Sub Domain is required')
  })

  // Formik hook for form management
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async values => {
      // setLoading(true)
      // Perform submission logic here, e.g., API call
      console.log('Form Submitted:', values)

      // Simulate success or error response
      // const response = await someApiCall(values)
      // if (response.success) {
      //     toast.success('Data saved successfully')
      // } else {
      //     toast.error('Error saving data')
      // }

      // setLoading(false)
    }
  })

  return (
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
            <Box display="flex" alignItems='center' justifyContent='center' padding={10}>
              <img width={400} height={50} src='/images/pages/amo-crm.jpg' alt='Amo CRM' />
            </Box>
          <Box display='flex' flexDirection='column' gap={2}>
            {/* Secret Key */}
            <TextField
              fullWidth
              label='Secret Key'
              name='secretKey'
              variant='outlined'
              value={formik.values.secretKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.secretKey && Boolean(formik.errors.secretKey)}
              helperText={formik.touched.secretKey && formik.errors.secretKey}
            />

            {/* Integration ID */}
            <TextField
              fullWidth
              label='Integration ID'
              name='integrationId'
              variant='outlined'
              value={formik.values.integrationId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.integrationId && Boolean(formik.errors.integrationId)}
              helperText={formik.touched.integrationId && formik.errors.integrationId}
            />

            {/* Authorization Code */}
            <TextField
              fullWidth
              label='Authorization Code'
              name='authorizationCode'
              variant='outlined'
              value={formik.values.authorizationCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.authorizationCode && Boolean(formik.errors.authorizationCode)}
              helperText={formik.touched.authorizationCode && formik.errors.authorizationCode}
            />

            {/* Sub Domain */}
            <TextField
              fullWidth
              label='Sub Domain'
              name='subDomain'
              variant='outlined'
              value={formik.values.subDomain}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.subDomain && Boolean(formik.errors.subDomain)}
              helperText={formik.touched.subDomain && formik.errors.subDomain}
            />
          </Box>

          {/* Submit Button */}
          <Box display='flex' justifyContent='flex-end' paddingBottom={5} paddingTop={5} mt={2}>
            <Button type='submit' variant='outlined' color='primary' disabled={loading}>
              {loading ? 'Loading...' : 'Save'}
            </Button>
          </Box>
        </form>
      </Box>
    </>
  )
}

export default AmoCrmPage
