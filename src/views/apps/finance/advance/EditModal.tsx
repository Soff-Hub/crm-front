import LoadingButton from '@mui/lab/LoadingButton';
import { Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import AmountInput, { revereAmount } from 'src/@core/components/amount-input';
import { useAppDispatch, useAppSelector } from 'src/store';
import { createAdvance, getAdvanceList, setOpenCreateModal, setOpenEdit } from 'src/store/apps/finance/advanceSlice';
import { IAdvanceFormState } from 'src/types/apps/finance';
import * as Yup from 'yup';

export default function EditModal() {
    const [loading, setLoading] = useState<boolean>(false)
    const { isEditId, advanceList, formikState, employee } = useAppSelector(state => state.advanceSlice)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    useEffect(() => {
        if (advanceList) {
            const selectedItem = advanceList.results.find(item => item.id == isEditId);
            if (selectedItem) {
                for (const [key, value] of Object.entries(selectedItem)) {
                    formik.setFieldValue(key, value);
                }
            }
        }
    }, [isEditId, advanceList]);


    const validationSchema = Yup.object({
        employee: Yup.string().required("Xodimni tanlang"),
        amount: Yup.string().required("Summani kiriting"),
        description: Yup.string().required("Izoh kiriting"),
        date: Yup.string().required("Sanani kiriting")
    });

    const formik = useFormik({
        initialValues: formikState,
        validationSchema,
        onSubmit: async (values: Partial<IAdvanceFormState>) => {
            setLoading(true)
            const response = await dispatch(createAdvance({ ...values, amount: revereAmount(values.amount || "") }))
            if (response.meta.requestStatus == "rejected") {
                formik.setErrors(response.payload)
            } else {
                toast.success("Avans yangilandi")
                dispatch(setOpenCreateModal(false))
                formik.resetForm()
                await dispatch(getAdvanceList())
            }
            setLoading(false)
        }
    });

    function onClose() {
        dispatch(setOpenCreateModal(false))
        dispatch(setOpenEdit(null))
        formik.resetForm()
    }

    return (
        <Dialog open={!!isEditId} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>{t("Avans berish")}</DialogTitle>
            <DialogContent sx={{ minWidth: '320px' }}>
                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px 0' }}>
                    <FormControl fullWidth>
                        <InputLabel size='small' id='user-view-language-label'>{t("Xodim")}</InputLabel>
                        <Select
                            size='small'
                            label={t("Xodim")}
                            id='user-view-language'
                            labelId='user-view-language-label'
                            name='employee'
                            error={!!formik.errors.employee && formik.touched.employee}
                            value={formik.values.employee || null}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            {employee?.map((item) => <MenuItem key={item.id} value={item.id}>{item.first_name}</MenuItem>)}
                        </Select>
                        {!!formik.errors.employee && formik.touched.employee && <FormHelperText error>{formik.errors.employee}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth>
                        <AmountInput
                            size='small'
                            label="Summa"
                            name='amount'
                            error={!!formik.errors.amount && formik.touched.amount}
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {!!formik.errors.amount && formik.touched.amount && <FormHelperText error>{formik.errors.amount}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            size='small'
                            label="Izoh"
                            multiline
                            rows={4}
                            name='description'
                            error={!!formik.errors.description && formik.touched.description}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {!!formik.errors.description && formik.touched.description && <FormHelperText error>{formik.errors.description}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            size='small'
                            label="Sana"
                            name='date'
                            type='date'
                            error={!!formik.errors.date && formik.touched.date}
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {!!formik.errors.date && formik.touched.date && <FormHelperText error>{formik.errors.date}</FormHelperText>}
                    </FormControl>
                    <LoadingButton type='submit' variant='contained' loading={loading}>
                        Yangilash
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}