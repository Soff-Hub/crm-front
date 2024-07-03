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

export default function AddNote() {
    const [isLoading, setLoading] = useState(false)
    const { openEdit, students } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const formik = useFormik({
        initialValues: {
            description: ""
        },
        validationSchema: () => Yup.object({
            description: Yup.string().required("Xabar kiriting")
        }),
        onSubmit: async (values) => {
            setLoading(true)

        }
    })

    return (
        <Dialog
            open={openEdit === 'notes'}
            onClose={() => dispatch(handleEditClickOpen(null))}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                Yangi eslatma yarating
            </DialogTitle>
            <DialogContent>
                <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit} >
                    <FormControl fullWidth>
                        <TextField
                            rows={4}
                            multiline
                            label="Eslatma..."
                            name='description'
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.description && formik.touched.description}
                        />
                        <FormHelperText error>{!!formik.errors.description && formik.touched.description && formik.errors.description}</FormHelperText>
                    </FormControl>

                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <LoadingButton loading={isLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
                            {t("Saqlash")}
                        </LoadingButton>
                        <Button variant='outlined' type='button' color='secondary' onClick={() => dispatch(handleEditClickOpen(null))}>
                            {t("Bekor Qilish")}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}
