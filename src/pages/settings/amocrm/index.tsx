import React from 'react'
import { Button, Box, TextField, Typography } from '@mui/material'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'

const AmoCrmPage = () => {

  const initialValues = {
    secretKey: '',
    integrationId: '',
    authorizationCode: '',
    subDomain: ''
  }

  const validationSchema = Yup.object({
    secretKey: Yup.string().required('Secret Key is required'),
    integrationId: Yup.string().required('Integration ID is required'),
    authorizationCode: Yup.string().required('Authorization Code is required'),
    subDomain: Yup.string().required('Sub Domain is required')
  })

  return (
    <>
                      <VideoHeader item={videoUrls.amocrm} />
       <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    mt={4} 
    sx={{
      backgroundColor: 'white',
      width: '50%',
      borderRadius: 2,
      maxHeight: '100vh',
      padding: 3,
      margin: '0 auto',  
    }}
    >
      <Box padding={10}><img width={400} height={50} src='/images/pages/amo-crm.jpg' alt="Amo CRM" /></Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          console.log('Form submitted', values)
        }}
      >
        {() => (
          <Form style={{ width: '100%', maxWidth: 600 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Field
                name="secretKey"
                label="Secret Key"
                variant="outlined"
                component={TextField}
                fullWidth
              />
              <ErrorMessage name="secretKey">
                {msg => <div style={{ color: 'red', fontSize: '12px' }}>{msg}</div>}
              </ErrorMessage>

              <Field
                name="integrationId"
                label="Integration ID"
                variant="outlined"
                component={TextField}
                fullWidth
              />
              <ErrorMessage name="integrationId">
                {msg => <div style={{ color: 'red', fontSize: '12px' }}>{msg}</div>}
              </ErrorMessage>

              <Field
                name="authorizationCode"
                label="Authorization Code"
                variant="outlined"
                component={TextField}
                fullWidth
              />
              <ErrorMessage name="authorizationCode">
                {msg => <div style={{ color: 'red', fontSize: '12px' }}>{msg}</div>}
              </ErrorMessage>

              <Field
                name="subDomain"
                label="Sub domain"
                variant="outlined"
                component={TextField}
                fullWidth
              />
              <ErrorMessage name="subDomain">
                {msg => <div style={{ color: 'red', fontSize: '12px' }}>{msg}</div>}
              </ErrorMessage>
            </Box>

            <Box display="flex" justifyContent="flex-end" paddingBottom={5} paddingTop={5} mt={2}>
              <Button type="submit" variant='outlined' color="primary">
                Saqlash
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
    </>
   
  )
}

export default AmoCrmPage
