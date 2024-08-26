// @ts-nocheck

import { Box, Drawer, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import { useAppDispatch, useAppSelector } from 'src/store';
import { editCourse, setOpenEditCourse } from 'src/store/apps/settings';
import CourseAmounts from './CourseAmounts';
import { fetchCoursesList } from 'src/store/apps/settings';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { disablePage } from 'src/store/apps/page';
import toast from 'react-hot-toast';
import { revereAmount } from 'src/@core/components/amount-input';
import { useEffect, useState } from 'react';
import EditCourseForm from './EditCourseForm';
import { CourseFormValues } from './CreateCourseDialog';


export default function EditCourseDialog() {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)
    const { openEditCourse, course_list } = useAppSelector(state => state.settings)

    useEffect(() => {
        formik.setFieldValue("lessons_count", String(course_list?.lessons_count || ""))
        openEditCourse && formik.setValues(openEditCourse)
    }, [openEditCourse])

    const initialValues = {
        name: '',
        price: '000',
        month_duration: '',
        description: '',
        color: "#ffffff",
        course_costs: []
    }


    const validationSchema = Yup.object({
        name: Yup.string().required("Kurs nomini kiriting"),
        month_duration: Yup.number().required("Kurs davomiyligini kiriting (Oy)"),
        description: Yup.string(),
        lessons_count: Yup.string()
            .test(
                'lessons-count-required',
                "Oylik to'lov uchun darslar sonini kiriting",
                function (value) {
                    const { course_list } = this.parent;
                    return course_list?.is_lesson_count ? !!value : true;
                }
            ),
        color: Yup.string(),
        course_costs: Yup.array().of(
            Yup.object().shape({
                order: Yup.number()
                    .min(1, t("Oyni kiriting") as string)
                    .required(t("Oyni kiriting") as string),
                price: Yup.number()
                    .min(1, t("Kurs narxini kiriting") as string)
                    .required(t("Kurs narxini kiriting") as string),
            })
        ),
    });



    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values: CourseFormValues) => {
            dispatch(disablePage(true))
            setLoading(true)
            const resp = await dispatch(editCourse({ ...values, price: revereAmount(`${values?.price}`) }))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
                setLoading(false)
            } else {
                dispatch(setOpenEditCourse(null))
                toast.success("O'zgarishlar muvaffaqiyatli saqlandi")
                formik.resetForm()
                await dispatch(fetchCoursesList())
            }
            setLoading(false)
            dispatch(disablePage(false))
        }
    })
    console.log(formik.errors);

    return (
        <Drawer open={!!openEditCourse} hideBackdrop anchor='right' variant='persistent'>
            <Box sx={{ display: "flex", height: "100%" }}>
                {formik.values.course_costs.length > 0 && <CourseAmounts formik={formik} />}
                <Box sx={{ width: "400px" }}>
                    <Heading />
                    {openEditCourse && <EditCourseForm loading={loading} formik={formik} />}
                </Box>
            </Box>
        </Drawer>
    )
}


function Heading() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const setOpenAddGroup = () => dispatch(setOpenEditCourse(null))

    return (
        <Box
            className='customizer-header'
            sx={{
                position: 'relative',
                p: theme => theme.spacing(3.5, 5),
                borderBottom: theme => `1px solid ${theme.palette.divider}`
            }}
        >
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                {t("Kursni yangilash")}
            </Typography>
            <IconButton
                onClick={setOpenAddGroup}
                sx={{
                    right: 20,
                    top: '50%',
                    position: 'absolute',
                    color: 'text.secondary',
                    transform: 'translateY(-50%)'
                }}
            >
                <IconifyIcon icon='mdi:close' fontSize={20} />
            </IconButton>
        </Box>
    )
}