// @ts-nocheck
import {
    Box,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    InputLabel,
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
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchTeachersList, updateTeacher } from 'src/store/apps/mentors';
import { UpdateTeacherDto } from 'src/types/apps/mentorsTypes';
import { useEffect, useRef, useState } from 'react';
import { TeacherAvatar } from './AddMentorsModal';
import PhoneInput from 'src/@core/components/phone-input';
import { formatPhoneNumber, reversePhone } from 'src/@core/components/phone-input/format-phone-number';
import { disablePage } from 'src/store/apps/page';
import toast from 'react-hot-toast';
import AmountInput, { revereAmount } from 'src/@core/components/amount-input';

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

export default function EditTeacherModal() {
    const { teacherData } = useAppSelector(state => state.mentors)
    // ** Hooks 
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const profilePhoto: any = useRef(null)

    // ** States
    const [loading, setLoading] = useState<boolean>(false)
    const [image, setImage] = useState<any>(null)


    const initialValues: UpdateTeacherDto = {
        first_name: teacherData?.first_name,
        phone: formatPhoneNumber(teacherData?.phone),
        birth_date: teacherData?.birth_date,
        activated_at: teacherData?.activated_at,
        gender: teacherData?.gender,
        lesson_amount:teacherData?.lesson_amount,
        image: teacherData?.image,
        // is_fixed_salary: teacherData?.is_fixed_salary,
        password: "",
        percentage: teacherData?.percentage,
        amount: teacherData?.amount
    }

    const validationSchema = () => {
        return Yup.object().shape(
            {
                first_name: Yup.string().required("Ismingizni kiriting"),
                phone: Yup.string().required("Telefon raqam kiriting"),
                birth_date: Yup.string().nullable(),
                activated_at: Yup.string().required("Ishga olingan sanani kiriting"),
                gender: Yup.string().required("Jinsini tanlang"),
                // is_fixed_salary: Yup.string().required("Jinsini tanlang"),
                // image: Yup.string(),
                password: Yup.string(),
                amount: Yup.string().when("percentage", {
                    is: (kpiPercentage: string) => !kpiPercentage || kpiPercentage.trim() === "",
                    then: Yup.string().required("To'ldiring(Foiz kiritilmasa)."),
                }),
                percentage: Yup.string().when("amount", {
                    is: (fixedSalary: string) => !fixedSalary || fixedSalary.trim() === "",
                    then: Yup.string().required("To'ldiring(O'zgarmas oylik kiritilmasa)"),
                }),

            },
            ["amount", "percentage"]
        );
    };


    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: UpdateTeacherDto) => {
            setLoading(true)
            dispatch(disablePage(true))
            const newValues = new FormData()

            for (const [key, value] of Object.entries({ ...values, amount: revereAmount(values.amount) })) {
                if (!['image'].includes(key)) {
                    if (key == "password" && value == "") {
                    }
                    else if (key === 'phone') {
                        newValues.append(key, reversePhone(value))
                    } else newValues.append(key, value)
                }
            }

            if (image) {
                newValues.append('image', image)
            }


            const resp = await dispatch(updateTeacher({
                data: newValues,
                id: teacherData?.id
            }))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                await dispatch(fetchTeachersList(''))
                formik.resetForm()
                setImage(null)
                toast.success("O'qituvchi muvaffaiyatli tahrirlandi")
            }
            setLoading(false)
            dispatch(disablePage(false))
        }
    });

    useEffect(() => {
        if (teacherData) {
            for (const [key, value] of Object.entries(teacherData)) {
                formik.setFieldValue(key, value);
            }
        }
    }, [teacherData]);

    const handleCheckboxChange = (event: React.SyntheticEvent, checked: boolean) => {
        formik.setFieldValue("is_fixed_salary", checked)
        formik.setFieldValue("amount", 0)
        formik.setFieldValue("percentage", 0)
    }

    useEffect(() => {

        return () => {
            formik.resetForm()
        }
    }, [])

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
                    <TextField label={t("first_name")} name='first_name' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.first_name} error={!!formik.errors.first_name && formik.touched.first_name} />
                    <FormHelperText error>
                        {(!!formik.errors.first_name && formik.touched.first_name) && formik.errors.first_name}
                    </FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <InputLabel error={!!formik.errors.phone && formik.touched.phone} htmlFor="login-input">{t('phone')}</InputLabel>
                    <PhoneInput
                        label={t("phone")}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        error={!!formik.errors.phone && formik.touched.phone}
                        size='medium'
                    />
                    <FormHelperText error>
                        {(!!formik.errors.phone && formik.touched.phone) && formik.errors.phone}
                    </FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <TextField type='date' label={t("birth_date")} name='birth_date' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birth_date} error={!!formik.errors.birth_date && formik.touched.birth_date} />
                    <FormHelperText error>
                        {(!!formik.errors.birth_date && formik.touched.birth_date) && formik.errors.birth_date}
                    </FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <TextField
                        type='date'
                        label={t("Ishga olingan sana")}
                        name='activated_at'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.activated_at}
                        error={!!formik.errors.activated_at && formik.touched.activated_at}
                    />
                    <FormHelperText error>
                        {(!!formik.errors.activated_at && formik.touched.activated_at) && formik.errors.activated_at}
                    </FormHelperText>
                </FormControl>
                {/* <FormControlLabel
                    name="is_fixed_salary"
                    checked={formik.values.is_fixed_salary}
                    onChange={handleCheckboxChange}
                    onBlur={formik.handleBlur}
                    control={<Checkbox />}
                    label={t("O'zgarmas oylik sifatida")}
                /> */}
                <Box sx={{ display: "flex", gap: "20px" }}>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            type='number'
                            label={t("Foiz ulushi")}
                            name='percentage'
                            // disabled={formik.values.is_fixed_salary}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.percentage}
                            error={!!formik.errors.percentage && formik.touched.percentage}
                            defaultValue={today} />
                        <FormHelperText error>
                            {(!!formik.errors.percentage && formik.touched.percentage) && formik.errors.percentage}
                        </FormHelperText>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <AmountInput
                            label={t("Oylik ish haqi")}
                            name='amount'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            // disabled={!formik.values.is_fixed_salary}
                            value={formik.values.amount}
                            error={!!formik.errors.amount && formik.touched.amount} />
                        <FormHelperText error>
                            {(!!formik.errors.amount && formik.touched.amount) && formik.errors.amount}
                        </FormHelperText>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <AmountInput
                            label={t("Darslar soni")}
                            name='lesson_amount'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            // disabled={!formik.values.is_fixed_salary}
                            value={formik.values.lesson_amount || 0}
                            error={!!formik.errors.lesson_amount && formik.touched.lesson_amount} />
                        <FormHelperText error>
                            {(!!formik.errors.lesson_amount && formik.touched.lesson_amount) && formik.errors.lesson_amount}
                        </FormHelperText>
                    </FormControl>
                </Box>

                <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormLabel>{t('Jinsini tanlang')}</FormLabel>
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
