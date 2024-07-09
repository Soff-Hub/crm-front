// @ts-nocheck

import {
    Box,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
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
import { CreateTeacherDto, UpdateTeacherDto } from 'src/types/apps/mentorsTypes';
import { useEffect, useRef, useState } from 'react';
import { TeacherAvatar } from './AddMentorsModal';
import { editEmployee, fetchEmployees, setEmployeeData } from 'src/store/apps/settings';
import PhoneInput from 'src/@core/components/phone-input';
import { formatPhoneNumber, reversePhone } from 'src/@core/components/phone-input/format-phone-number';
import { disablePage } from 'src/store/apps/page';
import toast from 'react-hot-toast';

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

export default function EditEmployeeForm() {
    const { employeeData } = useAppSelector(state => state.settings)
    // ** Hooks 
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const profilePhoto: any = useRef(null)

    // ** States
    const [loading, setLoading] = useState<boolean>(false)
    const [image, setImage] = useState<any>(null)

    const initialValues = {
        first_name: employeeData.first_name,
        phone: formatPhoneNumber(employeeData.phone),
        birth_date: employeeData.birth_date,
        activated_at: employeeData.activated_at,
        gender: employeeData.gender,
        image: employeeData.image,
        is_fixed_salary: employeeData.is_fixed_salary,
        percentage: employeeData.percentage,
        amount: employeeData.amount,
        branches: employeeData.branches.filter((el: any) => el.exists).map((el: any) => Number(el.id)),
        roles: employeeData.roles.filter((el: any) => el.exists).map((el: any) => Number(el.id))
    }

    const validationSchema = () => {
        return Yup.object().shape(
            {
                first_name: Yup.string().required("Ismingizni kiriting"),
                phone: Yup.string().required("Telefon raqam kiriting"),
                birth_date: Yup.string().nullable(),
                activated_at: Yup.string().required("Ishga olingan sanani kiriting"),
                gender: Yup.string().required("Jinsini tanlang"),
                is_fixed_salary: Yup.string().required("Jinsini tanlang"),
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
                branches: Yup.array(Yup.number()).required("Kamida bitta filial tanlang"),
                roles: Yup.array(Yup.number()).required("Kamida bitta rol tanlang"),

            },
            ["amount", "percentage"]
        );
    };


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: UpdateTeacherDto) => {
            setLoading(true)
            dispatch(disablePage(true))
            const newValues = new FormData()

            for (const [key, value] of Object.entries(values)) {
                if (!['image'].includes(key)) {
                    newValues.append(key, key === 'phone' ? reversePhone(value) : value)
                }
            }

            if (image) {
                newValues.append('image', image)
            }

            const resp = await dispatch(editEmployee({
                data: newValues,
                id: employeeData?.id
            }))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                toast.success("O'zgarishlar muvaffaqiyatli saqlandi")
                await dispatch(fetchEmployees())
                dispatch(setEmployeeData(null))
                formik.resetForm()
                setImage(null)
            }
            setLoading(false)
            dispatch(disablePage(false))
        }
    });



    const handleCheckboxChange = (event: React.SyntheticEvent, checked: boolean) => {
        formik.setFieldValue("is_fixed_salary", checked)
        formik.setFieldValue("amount", 0)
        formik.setFieldValue("percentage", 0)
    }

    useEffect(() => {
        return () => {
            formik.resetForm
            dispatch(setEmployeeData(null))
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
                    <TextField label={t("first_name")} name='first_name' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.first_name} error={!!formik.errors.first_name} />
                    <FormHelperText error={!!formik.errors.first_name}>{formik.errors.first_name}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <InputLabel error={!!formik.errors.phone && formik.touched.phone}>{t("phone")}</InputLabel>
                    <PhoneInput
                        label={t("phone")}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        error={!!formik.errors.phone && formik.touched.phone}
                    />
                    <FormHelperText error>
                        {(!!formik.errors.phone && formik.touched.phone) && formik.errors.phone}
                    </FormHelperText>
                </FormControl>


                <FormControl sx={{ width: '100%' }}>
                    <TextField type='date' label={t("birth_date")} name='birth_date' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birth_date} error={!!formik.errors.birth_date} />
                    <FormHelperText error={!!formik.errors.birth_date}>{formik.errors.birth_date}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                    <TextField
                        type='date'
                        label={"Ishga olingan sana"}
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
                <FormControlLabel
                    name="is_fixed_salary"
                    checked={formik.values.is_fixed_salary}
                    onChange={handleCheckboxChange}
                    onBlur={formik.handleBlur}
                    control={<Checkbox />}
                    label="O'zgarmas oylik sifatida"
                />
                <Box sx={{ display: "flex", gap: "20px" }}>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            type='number'
                            label={"Foiz ulushi"}
                            name='percentage'
                            disabled={formik.values.is_fixed_salary}
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
                        <TextField
                            type='number'
                            label={"Oylik ish haqi"}
                            name='amount'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!formik.values.is_fixed_salary}
                            value={formik.values.amount}
                            error={!!formik.errors.amount && formik.touched.amount} />
                        <FormHelperText error>
                            {(!!formik.errors.amount && formik.touched.amount) && formik.errors.amount}
                        </FormHelperText>
                    </FormControl>
                </Box>

                <FormControl fullWidth>
                    <InputLabel id='user-view-language-label'>{t('branch')}</InputLabel>
                    <Select
                        label={t('branch')}
                        multiple
                        id='user-view-language'
                        labelId='user-view-language-label'
                        name='branches'
                        defaultValue={[]}
                        error={!!formik.errors.branches}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.branches}
                    >
                        {
                            employeeData.branches.map((branch: any, index: number) => <MenuItem key={index} value={branch.id}>{branch.name}</MenuItem>)
                        }
                    </Select>
                    {!!formik.errors.branches && <FormHelperText error>{formik.errors.branches}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id='user-view-language-label'>{t('roles_list')}</InputLabel>
                    <Select
                        label={t('roles_list')}
                        multiple
                        id='user-view-language'
                        labelId='user-view-language-label'
                        name='roles'
                        defaultValue={[]}
                        error={!!formik.errors.roles}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.roles}
                    >
                        {
                            employeeData.roles.map((branch: any, index: number) => <MenuItem key={index} value={branch.id}>{branch.name}</MenuItem>)
                        }
                    </Select>
                    {!!formik.errors.roles && <FormHelperText error>{formik.errors.roles}</FormHelperText>}
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
