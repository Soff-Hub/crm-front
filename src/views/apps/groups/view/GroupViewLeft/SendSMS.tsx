import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from 'src/@core/utils/api';
import { useAppDispatch, useAppSelector } from 'src/store';
import { handleEditClickOpen } from 'src/store/apps/groupDetails';

// ** MUI Imports
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function SendSMS() {
    const [isLoading, setLoading] = useState(false)
    const { openEdit, smsTemps, students } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const formik = useFormik({
        initialValues: {
            message: ""
        },
        validationSchema: () => Yup.object({
            message: Yup.string().required("Xabar kiriting")
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await api.post(`common/send-message-user/`, {
                    users: students?.map((el: any) => Number(el.student.id)),
                    message: values.message
                })
                toast.success(`SMS muvaffaqiyatli jo'natildi!`, {
                    position: 'top-center'
                })
                dispatch(handleEditClickOpen(null))
                setLoading(false)
            } catch {
                setLoading(false)
            }
        }
    })

    return (
        <Dialog
            open={openEdit == 'send-sms'}
            onClose={() => dispatch(handleEditClickOpen(null))}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                {t("Barcha o'quvchilarga SMS yuboring")}
            </DialogTitle>
            <DialogContent>
                <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit}>
                    <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Shablonlar")}</InputLabel>
                        <Select
                            size='small'
                            label={t("Shablonlar")}
                            defaultValue=''
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            onChange={(e) => formik.setFieldValue("message", e.target.value)}
                        >
                            {
                                smsTemps?.map((el: any) => (
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
                        <TextField
                            name='message'
                            multiline
                            rows={4}
                            label={t("SMS matni")}
                            size='small'
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.message && formik.touched.message}
                        />
                        <FormHelperText error>{formik.errors.message && formik.touched.message && formik.errors.message}</FormHelperText>
                    </FormControl>

                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <LoadingButton loading={isLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
                            {t("Saqlash")}
                        </LoadingButton>
                        <Button variant='outlined' type='button' color='secondary' onClick={() => dispatch(handleEditClickOpen(null))}>
                            {t("Bekor qilish")}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}
