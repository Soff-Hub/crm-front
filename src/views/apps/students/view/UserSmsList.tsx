// ** MUI Imports
import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'


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
import useSMS from 'src/hooks/useSMS'
import EmptyContent from 'src/@core/components/empty-content'



const UserSmsList = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<null | []>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const { t } = useTranslation()
    const { query } = useRouter()
    const { smsTemps, getSMSTemps } = useSMS()
    const [error, setError] = useState<any>({})
    const [sms, setSMS] = useState<any>('')

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
            await api.post('common/send-message-user/', { users: [Number(query.student)], ...value })
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
                <Button startIcon={<IconifyIcon icon='ic:baseline-add' />} onClick={() => (setOpen(true), getSMSTemps())} sx={{ marginLeft: 'auto' }} variant='contained' size='small'>{t("SMS")}</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {
                    data && data.length ? data.map((el: any) => (
                        <Card sx={{ maxWidth: '450px' }} key={el.id}>
                            <CardContent>
                                <UserViewStudentsItem setOpenEdit={setOpen} key={el.id} item={{ ...el, created_at: el.updated_at }} />
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
                    {t("Xabar yuborish (sms)")}
                </DialogTitle>
                <DialogContent>
                    <Form setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleAddNote} id='dsdsdsds'>
                        <FormControl sx={{ maxWidth: '100%', mb: 3 }} fullWidth>
                            <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Shablonlar")}</InputLabel>
                            <Select
                                size='small'
                                label={t("Shablonlar")}
                                defaultValue=''
                                id='demo-simple-select-outlined'
                                labelId='demo-simple-select-outlined-label'
                                onChange={(e) => setSMS(e.target.value)}
                            >
                                {
                                    smsTemps.map((el: any) => (
                                        <MenuItem value={el.description} sx={{ wordBreak: 'break-word' }}>
                                            <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>
                                                {el.description}
                                            </span>
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            {sms ? <TextField
                                label={t("SMS matni")}
                                multiline rows={4}
                                size='small'
                                name='message'
                                defaultValue={sms}
                                onChange={(e) => setSMS(null)}
                            /> : <TextField
                                label={t("SMS matni")}
                                error={error?.message}
                                multiline rows={4}
                                size='small'
                                name='message'
                            />}
                            <FormHelperText error={error.message}>{error.message?.message}</FormHelperText>
                        </FormControl>


                        <DialogActions sx={{ justifyContent: 'center' }}>
                            <Button variant='outlined' type='button' color='secondary' onClick={() => setOpen(false)}>
                                {t("Bekor qilish")}
                            </Button>
                            <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                                {t("Yuborish")}
                            </LoadingButton>
                        </DialogActions>
                    </Form>
                </DialogContent>
            </Dialog>
        </Box>

    )
}

export default UserSmsList
