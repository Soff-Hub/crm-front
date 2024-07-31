import LoadingButton from '@mui/lab/LoadingButton';
import api from 'src/@core/utils/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    FormControl,
    FormHelperText,
    TextField,
    Typography,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';


export default function AddNote({ id, modalRef, setModalRef }: { id: string, modalRef: string | null, setModalRef: any }) {
    const [isLoading, setLoading] = useState(false)
    const { t } = useTranslation()
    const formik = useFormik({
        initialValues: { description: "" },
        validationSchema: () => Yup.object({
            description: Yup.string().required(t("Maydonni to'ldiring") as string)
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const response = await api.post('auth/student/description/', { user: id, ...values })
                if (response.status == 200) {
                    toast.success(t("Eslatma qo'shildi") as string)
                }
                setLoading(false)
                setModalRef(null)
                formik.resetForm()
            } catch (err: any) {
                formik.setErrors(err.response.data)
                setLoading(false)
                // showResponseError(err.response.data, setError)
            }
        }
    })

    return (
        <Dialog open={modalRef === 'note'} onClose={() => { formik.resetForm(), setModalRef(null) }}>
            <DialogContent sx={{ minWidth: '350px' }}>
                <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>Yangi eslatma yaratish</Typography>
                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <FormControl>
                        <TextField
                            name='description'
                            rows={4}
                            multiline
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            error={!!formik.errors.description && formik.touched.description} label={"Izoh"} size='small'
                        />
                        <FormHelperText error>{!!formik.errors.description && formik.touched.description && formik.errors.description}</FormHelperText>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Button onClick={() => { formik.resetForm(), setModalRef(null) }} size='small' variant='outlined' color='error'>Bekor qilish</Button>
                        <LoadingButton loading={isLoading} type='submit' size='small' variant='contained'>Saqlash</LoadingButton>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}
