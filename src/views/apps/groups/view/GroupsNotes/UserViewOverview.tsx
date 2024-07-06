// ** MUI Imports
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, TextField } from '@mui/material'


// ** Types

// ** Demo Component Imports
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import Form from 'src/@core/components/form'
import { useEffect, useState } from 'react'
import StudentsNotesList from './StudentNotesList'
import api from 'src/@core/utils/api'
import showResponseError from 'src/@core/utils/show-response-error'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import EmptyContent from 'src/@core/components/empty-content'
import SubLoader from '../../../loaders/SubLoader'


// interface ItemTypes {
//   data: {
//     id: number
//     created_at: string
//     description: string
//     current_user: string | null
//   }[]
// }



const UserViewOverview = () => {

  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<null | any[]>(null)
  const setError = (val: any) => {
    console.log(val);
  }
  const { query } = useRouter()

  const getNotes = async () => {
    setLoading(true)
    try {
      const resp = await api.get('common/group-description/list/' + query.id)
      setData(resp.data.results)
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
    }
  }

  const handleAddNote = async (value: any) => {
    setLoading(true)
    try {
      await api.post('common/group-description/create/', { group: query.id, ...value })
      setLoading(false)
      getNotes()
      setOpen(false)
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  useEffect(() => {
    (async function () {
      await getNotes()
    })()
  }, [])

  return (
    <Box>
      <Box sx={{ width: '100%', display: 'flex' }}>
        <Button startIcon={<IconifyIcon icon='ic:baseline-add' />} onClick={() => setOpen(true)} sx={{ marginLeft: 'auto' }} variant='contained' size='small'>{t('Yangi eslatma')}</Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading ? <SubLoader /> :
          data && data?.length > 0 ? data?.map((el: any) => (
            <Card key={el.id} sx={{ maxWidth: '450px' }}>
              <CardContent>
                <StudentsNotesList getNotes={getNotes} setOpenEdit={setOpen} comment={el} />
              </CardContent>
            </Card>

          )) : <EmptyContent />
        }

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
                  label={t("Kiriting...")}
                  name='body'
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
    </Box>
  )
}

export default UserViewOverview
