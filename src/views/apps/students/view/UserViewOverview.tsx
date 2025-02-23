// ** MUI Imports
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'


// ** Types

// ** Demo Component Imports
import { UserViewStudentsItem } from './UserViewStudentsList'
import IconifyIcon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import Form from 'src/@core/components/form'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import showResponseError from 'src/@core/utils/show-response-error'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentComments, fetchStudentDetail } from 'src/store/apps/students'
import EmptyContent from 'src/@core/components/empty-content'


interface ItemTypes {
  data: {
    id: number
    created_at: string
    message: string
    current_user: string | null
  }[]
}



const UserViewOverview = ({ data }: ItemTypes) => {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()
  const { query } = useRouter()
  const dispatch = useAppDispatch()
  const { studentData,comments } = useAppSelector(state => state.students)

  const setError = (val: any) => {
    console.log(val);
  }
  
  

  const handleAddNote = async (value: any) => {
    setLoading(true)
    try {
      await api.post('student/description/', { user: query.student, ...value })
      await dispatch(fetchStudentDetail(studentData?.id || 1))
      await dispatch(fetchStudentComments(query.student))
      setLoading(false)
      setOpen(false)
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }
  useEffect(() => {
    dispatch(fetchStudentComments(query.student))
  }, [])
  
  

  return (
    <Box>
      <Box sx={{ width: '100%', display: 'flex' }}>
        <Button startIcon={<IconifyIcon icon='ic:baseline-add' />} onClick={() => setOpen(true)} sx={{ marginLeft: 'auto' }} variant='contained' size='small'>{t('Yangi eslatma')}</Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {
          comments && comments.length ? comments.map((el:any) => (
            <Card sx={{ maxWidth: '450px' }} key={el.id}>
              <CardContent>
                <UserViewStudentsItem setOpenEdit={setOpen} key={el.id} item={el} />
              </CardContent>
            </Card>
          )) : <EmptyContent />
        }
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t("Yangi eslatma qo'shing")}
        </DialogTitle>
        <DialogContent>
          <Form valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleAddNote} id='edit-employee-pay-ddas'>
            <FormControl fullWidth>
              <TextField
                rows={4}
                multiline
                label={t("Izoh")}
                name='description'
                defaultValue={''}
              />
            </FormControl>

            <DialogActions sx={{ justifyContent: 'center' }}>
              <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                {t("Saqlash")}
              </LoadingButton>
              <Button variant='outlined' type='button' color='secondary' onClick={() => setOpen(false)}>
                {t("Bekor qilish")}
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>
    </Box>

  )
}

export default UserViewOverview
