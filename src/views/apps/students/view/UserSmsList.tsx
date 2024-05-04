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



const UserSmsList = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<null | []>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const { query } = useRouter()

    const setError = (val: any) => {
        console.log(val);
    }

    const getSmsList = async () => {
        setLoading(true)
        try {
            const resp = await api.get(`auth/sms-history/${query.student}`)
            setData(resp.data)
            setLoading(false)
            setOpen(false)
        } catch (err: any) {
            if (err?.response?.data) {
                showResponseError(err?.response?.data, setError)
            }
            setLoading(false)
        }
    }


    const handleAddNote = async (value: any) => {
        setLoading(true)
        try {
            await api.post('auth/student/description/', { user: query.student, ...value })
            getSmsList()
            setLoading(false)
            setOpen(false)
        } catch (err: any) {
            showResponseError(err.response.data, setError)
            setLoading(false)
        }
    }

    useEffect(() => {
        getSmsList()
    }, [])

    return (
        <Box>
            <Box sx={{ width: '100%', display: 'flex' }}>
                <Button startIcon={<IconifyIcon icon='ic:baseline-add' />} onClick={() => setOpen(true)} sx={{ marginLeft: 'auto' }} variant='contained' size='small'>Yangi Eslatma</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {
                    data ? data.map((el: any) => (
                        <Card sx={{ maxWidth: '450px' }} key={el.id}>
                            <CardContent>
                                <UserViewStudentsItem setOpenEdit={setOpen} key={el.id} item={el} />
                            </CardContent>
                        </Card>
                    )) : ''
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
                    Yangi eslatma qo'shing
                </DialogTitle>
                <DialogContent>
                    <Form valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleAddNote} id='edit-employee-pay-ddas'>
                        <FormControl fullWidth>
                            <TextField
                                rows={4}
                                multiline
                                label="yozing..."
                                name='description'
                                defaultValue={''}
                            />
                        </FormControl>

                        <DialogActions sx={{ justifyContent: 'center' }}>
                            <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                                {t("Saqlash")}
                            </LoadingButton>
                            <Button variant='outlined' type='button' color='secondary' onClick={() => setOpen(false)}>
                                {t("Bekor Qilish")}
                            </Button>
                        </DialogActions>
                    </Form>
                </DialogContent>
            </Dialog>
        </Box>

    )
}

export default UserSmsList
