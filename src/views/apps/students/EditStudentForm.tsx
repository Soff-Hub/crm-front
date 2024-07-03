import React, { useEffect, useState } from 'react'

// ** Components
import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';
import IconifyIcon from 'src/@core/components/icon';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Assets
import { useTranslation } from 'react-i18next';
import { today } from 'src/@core/components/card-statistics/kanban-item';

// ** Packs
import * as Yup from "yup";
import { useFormik } from 'formik';
import { StudentDetailType, UpdateStudentDto } from 'src/types/apps/studentsTypes';
import { createStudent, fetchStudentsList, setOpenEdit, setStudentData, updateStudent } from 'src/store/apps/students';
import { useAppDispatch, useAppSelector } from 'src/store';
import useGroups from 'src/hooks/useGroups';
import useResponsive from 'src/@core/hooks/useResponsive';
import SubLoader from '../loaders/SubLoader';
import PhoneInput from 'src/@core/components/phone-input';
import { reversePhone } from 'src/@core/components/phone-input/format-phone-number';


export default function EditStudentForm() {

    // ** Hooks
    const { t } = useTranslation()
    const error: any = {}
    const dispatch = useAppDispatch()
    const { groups, getGroups } = useGroups()
    const { isMobile } = useResponsive()
    const { studentData } = useAppSelector(state => state.students)

    // ** States
    const [isGroup, setIsGroup] = useState<boolean>(false)
    const [isPassword, setIsPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)


    const validationSchema = Yup.object({
        first_name: Yup.string().required("Ismingizni kiriting"),
        phone: Yup.string().required("Telefon raqam kiriting"),
        birth_date: Yup.string(),
        gender: Yup.string().required("Jinsini tanlang"),
        password: Yup.string(),
    });

    const initialValues: UpdateStudentDto = {
        id: studentData?.id,
        first_name: studentData?.first_name || '',
        phone: studentData?.phone?.replace('+998', '') || '',
        gender: studentData?.gender || 'male',
        birth_date: studentData?.birth_date || null
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (valuess: UpdateStudentDto) => {
            setLoading(true)
            const newVlaues = { ...valuess, phone: reversePhone(valuess.phone) }

            const resp = await dispatch(updateStudent(newVlaues))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                await dispatch(fetchStudentsList())
                dispatch(setOpenEdit(null))
                formik.resetForm()
                setIsGroup(false)
            }
            setLoading(false)
        }
    });

    const { values, errors, touched, handleBlur, handleChange } = formik


    useEffect(() => {

        return () => {
            formik.resetForm()
        }
    }, [])

    return (
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px', minWidth: isMobile ? '330px' : '400px' }}>
            <FormControl sx={{ width: '100%' }}>
                <TextField
                    size='small'
                    label={t("first_name")}
                    name='first_name'
                    error={!!errors.first_name && touched.first_name}
                    value={values.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.first_name && touched.first_name && <FormHelperText error={true}>{errors.first_name}</FormHelperText>}
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
                <InputLabel error={!!errors.phone && touched.phone} htmlFor="outlined-adornment-password">{t('phone')}</InputLabel>
                <PhoneInput
                    id='outlined-adornment-password'
                    label={t("phone")}
                    name='phone'
                    error={!!errors.phone && touched.phone}
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.phone && touched.phone && <FormHelperText error={true}>{errors.phone}</FormHelperText>}
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
                <TextField
                    size='small'
                    label={t("birth_date")}
                    name='birth_date'
                    type='date'
                    error={!!errors.birth_date && touched.birth_date}
                    value={values.birth_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <FormHelperText error={true}>{errors.birth_date}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormLabel>{t('Jinsni tanlang')}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    <Box sx={{ display: "flex", gap: '20px' }}>
                        <FormControlLabel value="male" control={<Radio />} label={t("Erkak")} />
                        <FormControlLabel value="female" control={<Radio />} label={t("Ayol")} />
                    </Box>
                </RadioGroup>
            </FormControl>

            {
                isPassword ? (
                    <FormControl sx={{ width: '100%' }}>
                        <TextField
                            size='small'
                            label={t("password")}
                            name='password'
                            error={!!errors.password && touched.password}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <FormHelperText error={true}>{errors.password}</FormHelperText>
                    </FormControl>
                ) : ''
            }

            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t('Saqlash')}</LoadingButton>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {/* {!isGroup && <Button onClick={async () => (setIsGroup(true), await getGroups())} type='button' variant='outlined' size='small' startIcon={<IconifyIcon icon={'material-symbols:add'} />}>{t("Guruhga qo'shish")}</Button>} */}
                {!isPassword && <Button onClick={() => setIsPassword(true)} type='button' variant='outlined' size='small' color='warning' startIcon={<IconifyIcon icon={'lucide:key-round'} />}>{t("Parol qo'shish")}</Button>}
            </Box>
        </form>
    )
}