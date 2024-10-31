import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchCRMPayments, setOpenModal, updatePaymentModal } from 'src/store/apps/c-panel';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-hot-toast';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1,
    p: 4,
};

export default function TransitionsModal({ id }: { id: string }) {
    const { open } = useAppSelector(state => state.cPanelSlice)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [isLoading, setLoading] = useState(false)

    const validationSchema = Yup.object({
        status: Yup.string().nullable().required(t("To'lovni holatini tanlang") as string),
    });

    const formik = useFormik({
        initialValues: {
            status: null,
        },
        validationSchema,
        onSubmit: async (values: Partial<any>) => {
            setLoading(true)
            const response = await dispatch(updatePaymentModal({ id: Number(id), formData: values }))
            if (response.meta.requestStatus == "rejected") {
                if (typeof response.payload !== "string") {
                    formik.setErrors(response.payload)
                } else toast.error(t("To'lovni tahrirlab bo'lmadi") as string)
            } else {
                toast.success(t("To'lov yuborildi") as string)
                handleClose()
                await dispatch(fetchCRMPayments(""))
            }
            setLoading(false)
        }
    });

    const handleClose = () => {
        formik.resetForm()
        dispatch(setOpenModal(null))
    }
    console.log(formik.errors);
    console.log(formik.values);


    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open == id}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}            >
            <Fade in={open == id}>
                <Box sx={style}>
                    <form onSubmit={formik.handleSubmit}>
                        <Typography mb={2} variant='h6'>{t("To'lovni tahrirlash")}</Typography>
                        <FormControl fullWidth>
                            <InputLabel size='small' id='user-view-language-label'>{t("Tariflar")}</InputLabel>
                            <Select
                                size='small'
                                name='status'
                                label={t('Tariflar')}
                                id='user-view-language'
                                labelId='user-view-language-label'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.status || ""}
                                error={!!formik.errors.status && !!formik.touched.status}
                            >
                                <MenuItem value={"moderation"}>{t("Tasdiqlanmagan")}</MenuItem>
                                <MenuItem value={"approved"}>{t("Qabul qilingan")}</MenuItem>
                                <MenuItem value={"cancelled"}>{t("Bekor qilingan")}</MenuItem>
                            </Select>
                            <FormHelperText error={!!formik.errors.status && !!formik.touched.status}>{!!formik.errors.status && !!formik.touched.status && formik.errors.status}</FormHelperText>
                        </FormControl>
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <LoadingButton type='submit' sx={{ mt: 2 }} loading={isLoading} variant="contained">{t("Saqlash")}</LoadingButton>
                        </Box>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
}