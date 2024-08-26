// @ts-nocheck

import { Box, Drawer, IconButton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenCreateSms } from 'src/store/apps/settings'
import CourseAmounts from './CourseAmounts'
import { createGroup, fetchCoursesList } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import { revereAmount } from 'src/@core/components/amount-input'
import CreateCourseForm from './CreateCourseForm'
import { useEffect, useState } from 'react'

export type CourseFormValues = {
    name: string,
    price: string,
    month_duration: string,
    description: string,
    color: string,
    lessons_count?: string,
    course_costs: Array<{ order: number, price: number }>
};

export default function CreateCourseDialog() {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)

    const { openCreateSms, course_list } = useAppSelector(state => state.settings)

    useEffect(() => {
        formik.setFieldValue("lessons_count", String(course_list?.lessons_count || 0))
    }, [course_list?.is_lesson_count, openCreateSms])


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
            const resp = await dispatch(createGroup({ ...values, price: revereAmount(values.price) }))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                toast.success('Kurs yaratildi')
                formik.resetForm()
                dispatch(setOpenCreateSms(null))
                await dispatch(fetchCoursesList())
            }
            setLoading(false)
            dispatch(disablePage(false))
        }
    })
    console.log(formik.errors);

    return (
        <Drawer open={openCreateSms} hideBackdrop anchor='right' variant='temporary'>
            <Box sx={{ display: "flex", height: "100%", minWidth: "0" }}>
                {formik.values.course_costs.length > 0 && <CourseAmounts formik={formik} />}
                <Box sx={{ width: "400px" }}>
                    <Heading />
                    {openCreateSms && <CreateCourseForm loading={loading} formik={formik} />}
                </Box>
            </Box>
        </Drawer>
    )
}


function Heading() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const setOpenAddGroup = () => dispatch(setOpenCreateSms(null))

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
                {t("Kurs qo'shish")}
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