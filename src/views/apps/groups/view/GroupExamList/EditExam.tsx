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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import IconifyIcon from "src/@core/components/icon";
import useResponsive from "src/@core/hooks/useResponsive";
import api from "src/@core/utils/api";
import { useAppDispatch, useAppSelector } from "src/store";
import { getExams, setOpen } from "src/store/apps/groupDetails";
import { ExamType } from "./GroupExamsList";
import * as Yup from "yup";


export default function EditExam() {
    const { open, editData, exams } = useAppSelector(state => state.groupDetails)
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
        setParent(null)
        formik.resetForm()
        setReExam(false)
    }

    const getExams2 = async () => {
        try {
            const resp = await api.get(`common/exam/parent/${query?.id}`)
            setExams2(resp.data);
        } catch (err) {
            console.log(err)
        }
    }

    const formik: any = useFormik({
        initialValues: {
            title: "",
            date: "",
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
                const response = await api.patch('common/exam/update/' + editData.id, { ...values, group: Number(query.id) })
                if (response.status == 200) {
                    await dispatch(getExams(query?.id))
                    formik.resetForm()
                    setParent(null)
                    setReExam(false)
                    dispatch(setOpen(null))
                }
            } catch (e: any) {
                console.log(e?.response.data);
                formik.setErrors(e?.response.data)
            }
            setLoading(false)
        }
    })

    const setParentItem = (item: any) => {
        formik.setFieldValue('parent', item?.id || null)
        setParent(item)
    }

    useEffect(() => {
        formik.setValues(editData)
        if (editData?.parent) {
            setReExam(true)
            setParent(editData?.parent)
            getExams2()
        }
    }, [editData])

    return (
        <Drawer open={open === 'edit'} anchor='right' variant='persistent'>
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
                    {t("Imtixon yangilash")}
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
            {<form onSubmit={formik.handleSubmit} style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={reExam} onChange={async () => (!reExam && setParentItem(null), setReExam(!reExam), await getExams2())} />
                    <Typography>{t("Qayta topshirish")}</Typography>
                </label>
                {reExam &&
                    <FormControl fullWidth>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Qaysi imtixon uchun?')}</InputLabel>
                        <Select
                            size='small'
                            label={t("Qaysi imtixon uchun?")}
                            value={parent?.id || editData?.parent}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            name="parent"
                            onChange={(e: any) => setParentItem(exams2?.find(el => el.id === e.target.value))}
                        >
                            {
                                exams2.map(exam => <MenuItem key={exam.id} value={exam.id}>{exam.title}</MenuItem>)
                            }
                        </Select>
                    </FormControl>}
                <FormControl>
                    <TextField
                        size='small'
                        label={t("Imtixon nomi")}
                        name='title'
                        error={!!formik.errors.title && !!formik.touched.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.title}
                    />
                    <FormHelperText error>{!!formik.errors.title && !!formik.touched.title}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField
                        size='small'
                        type="date"
                        label={t("Imtixon sanasi")}
                        name='date'
                        value={formik.values?.date}
                        error={!!formik.errors.date && !!formik.touched.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error>{!!formik.errors.date && !!formik.touched.date}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField
                        size='small'
                        label={t("O'tish ball")}
                        name='min_score'
                        value={formik.values?.min_score}
                        error={!!formik.errors.min_score && !!formik.touched.min_score}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error>{!!formik.errors.min_score && !!formik.touched.min_score}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField
                        size='small'
                        label={t("Maksimal bal")}
                        name='max_score'
                        value={formik.values?.max_score}
                        error={!!formik.errors.max_score && !!formik.touched.max_score}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormHelperText error>{!!formik.errors.max_score && !!formik.touched.max_score}</FormHelperText>
                </FormControl>
                <LoadingButton loading={loading} variant="outlined" type="submit">{t('Saqlash')}</LoadingButton>
            </form>}
        </Drawer>
    )
}
