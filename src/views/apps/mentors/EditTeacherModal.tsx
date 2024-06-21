import {
    Box,
    FormControlLabel,
    FormHelperText,
    FormLabel,
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
import * as Yup from "yup";
import { useFormik } from 'formik';
import { useAppDispatch } from 'src/store';
import { fetchTeachersList, updateTeacher } from 'src/store/apps/mentors';
import { UpdateTeacherDto } from 'src/types/apps/mentorsTypes';
import { useRef, useState } from 'react';
import { TeacherAvatar } from './AddMentorsModal';

export const VisuallyHiddenInput = styled('input')({
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

interface EditTeacherModalProps {
    initialValues: UpdateTeacherDto
}

export default function EditTeacherModal({ initialValues }: EditTeacherModalProps) {

    // ** Hooks 
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const profilePhoto: any = useRef(null)

    // ** States
    const [loading, setLoading] = useState<boolean>(false)
    const [image, setImage] = useState<any>(null)

    const validationSchema = Yup.object({
        first_name: Yup.string().required("Ismingizni kiriting"),
        phone: Yup.string().required("Telefon raqam kiriting"),
        birth_date: Yup.string(),
        gender: Yup.string().required("Jinsini tanlang"),
        // image: Yup.string(),
        password: Yup.string(),
    });

    

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: UpdateTeacherDto) => {
            setLoading(true)
            const newValues = new FormData()

            for (const [key, value] of Object.entries(values)) {
                if (!['image'].includes(key)) {
                    newValues.append(key, value)
                }   
            }

            if (image) {
                newValues.append('image', image)
            }


            const resp = await dispatch(updateTeacher({
                data: newValues,
                id: initialValues.id
            }))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                await dispatch(fetchTeachersList())
                formik.resetForm()
                setImage(null)
            }
            setLoading(false)
        }
    });

    return (
        <Box width={'100%'}>
            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>

                <TeacherAvatar onClick={() => profilePhoto?.current?.click()} skin='light' color={'info'} variant='rounded' sx={{ cursor: 'pointer', margin: '0 auto 10px' }}>
                    {profilePhoto.current?.files?.[0] || formik.values?.image ?
                        <img
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            src={
                                image ? URL.createObjectURL(image) : formik.values?.image ? formik.values?.image : ''} alt="" /> :
                        <IconifyIcon fontSize={40} icon={'material-symbols-light:add-a-photo-outline'} />
                    }
                    <VisuallyHiddenInput
                        ref={profilePhoto} name='image'
                        onChange={(e) => setImage(e.target?.files?.[0])}
                        type="file" accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic' />
                </TeacherAvatar>

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

                <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormLabel>{t('Jinsni tanlang')}</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <Box sx={{ display: "flex", gap: '20px' }}>
                            <FormControlLabel value="male" control={<Radio />} label={t("Erkak")} />
                            <FormControlLabel value="female" control={<Radio />} label={t("Ayol")} />
                        </Box>
                    </RadioGroup>
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
