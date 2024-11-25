//@ts-nocheck
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import { useTranslation } from 'react-i18next';
import { FormHelperText, InputLabel } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppDispatch, useAppSelector } from 'src/store';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'src/@core/components/phone-input';
import api from 'src/@core/utils/api';
import { toast } from 'react-hot-toast';
import { fetchStudentDetail } from 'src/store/apps/students';
import { reversePhone } from 'src/@core/components/phone-input/format-phone-number';

interface IAddParentProps {
    open: "create" | "edit" | null;
    setOpen: (value: "create" | "edit" | null) => void;
}

interface IParentData {
    first_name: string;
    phone: string;
    id?: number;
}

const AddStudentParent = ({ open, setOpen }: IAddParentProps) => {
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    const { studentData } = useAppSelector(state => state.students);
    const dispatch = useAppDispatch();

    const initialValues: IParentData = {
        first_name: '',
        phone: '',
    };

    const validationSchema = Yup.object({
        first_name: Yup.string().required(t("Ismi familyasini kiriting")),
        phone: Yup.string().required(t("Telefon raqamni kiriting")),
    });

    useEffect(() => {
        // if (open) {
        formik.setValues(studentData?.parent_data || initialValues);
        // }
    }, [open, studentData]);

    const handleCreateParent = async (values: IParentData, helpers: FormikHelpers<IParentData>) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/student-parent/create/', { ...values, student: studentData?.id });
            if (response.status === 201) {
                toast.success(t("Muvaffaqiyatli saqlandi"));
                studentData?.id && dispatch(fetchStudentDetail(studentData.id));
                handleClose();
            }
        } catch (err: any) {
            handleError(err, helpers);
        } finally {
            setLoading(false);
        }
    };

    const handleEditParent = async (values: IParentData, helpers: FormikHelpers<IParentData>) => {
        try {
            setLoading(true);
            const response = await api.patch(`auth/student-parent/update/${values.id}/`, { ...values, student: studentData?.id });
            if (response.status === 200) {
                toast.success(t("Muvaffaqiyatli yangilandi"));
                studentData?.id && dispatch(fetchStudentDetail(studentData.id));
                handleClose();
            }
        } catch (err: any) {
            handleError(err, helpers);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err: any, helpers: FormikHelpers<IParentData>) => {
        if (typeof err.response.data === "string") {
            toast.error(err.response.data || t("Saqlab bo'lmadi"));
        } else {
            helpers.setErrors(err.response.data);
        }
    };

    const formik: any = useFormik<IParentData>({
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers) => {
            if (open === "create") {
                await handleCreateParent(values, helpers);
            } else if (open === "edit") {
                await handleEditParent(values, helpers);
            }
        },
    });

    const handleClose = () => {
        formik.resetForm();
        setOpen(null);
    };

    return (
        <Dialog
            open={open === "create" || open === "edit"}
            onClose={handleClose}
            aria-labelledby="user-view-edit"
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [2, 3] } }}
            aria-describedby="user-view-edit-description"
        >
            <DialogTitle id="user-view-edit" sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                {t("Ota-ona ma'lumotini kiriting")}
            </DialogTitle>
            <DialogContent>
                <form style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={formik.handleSubmit}>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            label={t("Ismi familyasi")}
                            name="first_name"
                            error={Boolean(formik.errors.first_name && formik.touched.first_name)}
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            size="medium"
                        />
                        <FormHelperText error>{formik.touched.first_name && formik.errors.first_name}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel error={Boolean(formik.errors.phone && formik.touched.phone)}>{t("Telefon raqami")}</InputLabel>
                        <PhoneInput
                            name="phone"
                            label={t("Telefon raqami")}
                            onChange={(e) => formik.setFieldValue("phone", reversePhone(e.target.value))}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            error={Boolean(formik.errors.phone && formik.touched.phone)}
                            size="medium"
                        />
                        <FormHelperText error>{formik.touched.phone && formik.errors.phone}</FormHelperText>
                    </FormControl>
                    <LoadingButton loading={loading} type="submit" variant="contained">
                        {open == "create" ? t("Saqlash") : t("O'zgartirish")}
                    </LoadingButton>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        {t("Bekor qilish")}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddStudentParent;
