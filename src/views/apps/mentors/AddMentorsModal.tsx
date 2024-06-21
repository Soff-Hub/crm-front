import {
    Box,
    Button,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    styled,
    TextField,
} from '@mui/material';
import IconifyIcon from 'src/@core/components/icon';
import FormControl from '@mui/material/FormControl';
import LoadingButton from '@mui/lab/LoadingButton';
import { today } from 'src/@core/components/card-statistics/kanban-item';
import { useTranslation } from 'react-i18next';
import useTeachers from 'src/hooks/useTeachers';
import * as Yup from "yup";
import { useFormik } from 'formik';

export default function AddMentorsModal() {
    const { t } = useTranslation()
    const { createTeacher, getTeachers, loading, deleteTeacher, updateTeacher, setLoading, setTeachersData, teacherData, getTeacherById } = useTeachers()

    const validationSchema = Yup.object({
        first_name: Yup.string().required("Ismingizni kiriting"),
        phone: Yup.string().required("Telefon raqam kiriting"),
        birth_date: Yup.string(),
        gender: Yup.string().required("Jinsini tanlang"),
        image: Yup.string(),
        password: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            first_name: "",
            phone: "",
            birth_date: "",
            gender: "",
            image: "",
            password: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await createTeacher(values)
                await getTeachers()
                // setOpenAddGroup(false)
                formik.resetForm()
            } catch (error: any) {
                // showResponseError(error.response.data, setError)
            }
        }
    });

    const handleAddTeacher = async (values: any) => {
        try {
            await createTeacher(values)
            await getTeachers()
            // setOpenAddGroup(false)
            const form: any = document.getElementById('create-teacher-form')
            form.reset()
        } catch (error: any) {
            // showResponseError(error.response.data, setError)
        }
    }

    console.log(formik.values);
    console.log(formik.errors);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Box width={'100%'}>
            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
                <FormControl sx={{ width: '100%' }}>
                    <TextField label={t("first_name")} name='first_name' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.first_name} error={!!formik.errors.first_name} />
                    <FormHelperText error={!!formik.errors.first_name}>{formik.errors.first_name}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <TextField label={t("phone")} name='phone' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone} error={!!formik.errors.phone} defaultValue={"+998"} />
                    <FormHelperText error={!!formik.errors.phone}>{formik.errors.phone}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <TextField type='date' label={t("birth_date")} name='birth_date' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birth_date} error={!!formik.errors.birth_date} defaultValue={today} />
                    <FormHelperText error={!!formik.errors.birth_date}>{formik.errors.birth_date}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10 }}>
                    <RadioGroup
                        sx={{ display: "flex" }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <FormControlLabel value="female" control={<Radio />} label={t("Ayol")} />
                        <FormControlLabel value="male" control={<Radio />} label={t("Erkak")} />
                    </RadioGroup>
                </FormControl>

                <FormControl fullWidth sx={{ my: 2 }}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        color='warning'
                        startIcon={<IconifyIcon icon={'subway:cloud-upload'} />}
                    >
                        {t("Rasm qo'shish")}
                        <VisuallyHiddenInput name='image' onChange={formik.handleChange} type="file" accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic' />
                    </Button>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <TextField label={t("password")} name='password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} error={!!formik.errors.password} />
                    <FormHelperText error={!!formik.errors.password}>{formik.errors.password}</FormHelperText>
                </FormControl>

                <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
            </form>
        </Box>
    )
}
