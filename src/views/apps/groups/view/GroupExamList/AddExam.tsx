import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Checkbox,
    Drawer,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import IconifyIcon from "src/@core/components/icon";
import useResponsive from "src/@core/hooks/useResponsive";
import api from "src/@core/utils/api";
import { useAppDispatch, useAppSelector } from "src/store";
import { getExams, setOpen } from "src/store/apps/groupDetails";
import { ExamType } from "./GroupExamsList";
import * as Yup from "yup";
import { today } from "src/@core/components/card-statistics/kanban-item";


export default function AddExam() {
    const { open } = useAppSelector(state => state.groupDetails)
    const { query } = useRouter()
    const dispatch = useAppDispatch()
    const [exams2, setExams2] = useState<ExamType[]>([])
    const [loading, setLoading] = useState(false)
    const [reExam, setReExam] = useState(false)
    const [parent, setParent] = useState<any>(null)

    const { isMobile } = useResponsive()
    const { t } = useTranslation()


    const handleClose = () => {
        setLoading(false)
        dispatch(setOpen(null))
        setReExam(false)
        setParent(null)
        formik.resetForm()
    }

    const getExams2 = async () => {
        try {
            const resp = await api.get(`common/exam/parent/${query?.id}`)
            setExams2(resp.data);
        } catch (err) {
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            title: "",
            date: today,
            max_score: "",
            min_score: "",
            parent: null
        },
        validationSchema: () => Yup.object({
            title: Yup.string().required(t("Maydonni to'ldiring") as string),
            date: Yup.string().required(t("Sanani tanlang") as string),
            max_score: Yup.string().required(t("Maydonni to'ldiring") as string),
            min_score: Yup.string().required(t("Maydonni to'ldiring") as string)
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const response = await api.post('common/exam/create/', { ...values, group: Number(query.id) })
                if (response.status == 201) {
                    await dispatch(getExams(query?.id))
                    setParent(null)
                    formik.resetForm()
                    setReExam(false)
                    dispatch(setOpen(null))
                }
            } catch (e: any) {
                formik.setErrors(e?.response.data)
            }
            setLoading(false)
        }
    })

    const setParentItem = (item: any) => {
        formik.setFieldValue("parent", item?.id)
        setParent(item)
    }

    return (
        <Drawer open={open === 'add'} anchor='right' variant='persistent'>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`,
                    width: isMobile ? '320px' : '400px'
                }}
                onClick={handleClose}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {t("Imtixon qo'shish")}
                </Typography>
                <IconButton
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
            <form onSubmit={formik.handleSubmit} style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={reExam} onChange={async () => (!reExam && setParentItem(null), formik.resetForm(), setReExam(!reExam), await getExams2())} />
                    <Typography>{t("Qayta topshirish")}</Typography>
                </label>
                {reExam &&
                    <FormControl fullWidth>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Qaysi imtixon uchun?')}</InputLabel>
                        <Select
                            size='small'
                            label={t("Qaysi imtixon uchun?")}
                            value={formik.values.parent || ""}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            name="parent"
                            error={!!formik.errors.parent && formik.touched.parent}
                            onChange={(e: any) => setParentItem(exams2?.find(el => el.id === e.target.value))}
                        >
                            {
                                exams2.map(exam => <MenuItem value={exam.id}>{exam.title}</MenuItem>)
                            }
                        </Select>
                        <FormHelperText error>{!!formik.errors.parent && formik.touched.parent && formik.errors.parent}</FormHelperText>
                    </FormControl>}
                <FormControl>
                    <TextField
                        size='small'
                        value={formik.values?.title}
                        label={t("Imtixon nomi")}
                        name='title'
                        error={!!formik.errors.title && formik.touched.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error>{!!formik.errors.title && formik.touched.title && formik.errors.title}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField
                        size='small'
                        type="date"
                        label={t("Imtixon sanasi")}
                        name='date'
                        value={formik.values?.date}
                        error={!!formik.errors.date && formik.touched.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error>{!!formik.errors.date && formik.touched.date && formik.errors.date}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField
                        size='small'
                        label={t("O'tish ball")}
                        name='min_score'
                        value={formik.values?.min_score}
                        error={!!formik.errors.min_score && formik.touched.min_score}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error>{!!formik.errors.min_score && formik.touched.min_score && formik.errors.min_score}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField
                        size='small'
                        label={t("Maksimal bal")}
                        name='max_score'
                        value={formik.values?.max_score}
                        error={!!formik.errors.max_score && formik.touched.max_score}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error>{!!formik.errors.max_score && formik.touched.max_score && formik.errors.max_score}</FormHelperText>
                </FormControl>
                <LoadingButton loading={loading} variant="outlined" type="submit">{t('Saqlash')}</LoadingButton>
            </form>
        </Drawer>
    )
}
