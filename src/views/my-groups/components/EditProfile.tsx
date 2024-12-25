import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { revereAmount } from 'src/@core/components/amount-input';
import { today } from 'src/@core/components/card-statistics/kanban-item';
import api from 'src/@core/utils/api';
import * as Yup from 'yup';


interface PropsType {
    isOpen: boolean;
    setEdit: (isOpen: boolean) => void;
}
export default function EditProfile({ isOpen, setEdit }: PropsType) {
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)

    const validationSchema = Yup.object({
        amount: Yup.string().required(t("Summani kiriting") as string),
        description: Yup.string().required(t("Izoh kiriting") as string),
        date: Yup.string().required(t("Sanani kiritish majburiy") as string)
    });

    const initialValues = {
        amount: '',
        description: '',
        date: today
    }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await api.post(`finance/expense/create/`, { ...values, amount: revereAmount(values.amount), expense_category: 12 })
            } catch (err: any) {
                if (err?.response?.data) {
                    formik.setErrors(err?.response?.data)
                }
                console.log(err)
            }
            setLoading(false)
        }
    });

    return (
        <Dialog
            open={isOpen}
            onClose={
                () => setEdit(false)
            }
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [2, 3] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.3rem !important' }}>
                {t("Ma'lumotlarini tahrirlash")}
            </DialogTitle>
            <DialogContent>
                <form
                    style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '15px' }}
                    onSubmit={() => null}
                >
                    <FormControl fullWidth>
                        <TextField
                            size='small'
                            label={t("Ism va familya")}
                            multiline
                            name='description'
                            error={!!formik.errors.description && formik.touched.description}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {!!formik.errors.description && formik.touched.description && <FormHelperText error>{formik.errors.description}</FormHelperText>}
                    </FormControl>

                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button variant='outlined' type='button' color='secondary' onClick={() => setEdit(false)}>
                            {t("Bekor qilish")}
                        </Button>
                        <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                            {t("Saqlash")}
                        </LoadingButton>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}
