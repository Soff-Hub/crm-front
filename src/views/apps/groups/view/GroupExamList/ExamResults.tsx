import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Drawer,
    FormControl,
    FormHelperText,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import IconifyIcon from "src/@core/components/icon";
import DataTable from "src/@core/components/table";
import useResponsive from "src/@core/hooks/useResponsive";
import api from "src/@core/utils/api";
import { customTableProps } from "src/pages/groups";
import { useAppDispatch, useAppSelector } from "src/store";
import { getResults, setOpen, setResultEdit, setResultId } from "src/store/apps/groupDetails";
import * as Yup from "yup";



export default function ExamResults() {
    const { resultId, isGettingExamsResults, examStudentId, open, results } = useAppSelector(state => state.groupDetails)
    const { query } = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    const handleClose = () => {
        setLoading(false)
        dispatch(setOpen(null))
        dispatch(setResultEdit(null))
        formik.resetForm()
    }

    const columnsResult: customTableProps[] = [
        {
            xs: 0.03,
            title: t("#"),
            dataIndex: 'index',
        },
        {
            xs: 0.3,
            title: t("first_name"),
            dataIndex: 'result',
            render: (result: any) => result.first_name
        },
        {
            xs: 0.12,
            title: t("Natija"),
            dataIndex: 'result',
            render: (result: any) => result.score
        },
        {
            xs: 0.3,
            title: t("Maksimal bal"),
            dataIndex: 'result',
            render: (result: any) => result.max_score
        },
        {
            xs: 0.2,
            title: t("Holati"),
            dataIndex: 'result',
            render: (result: any) => !result.status ? "boshlanmagan" : result.status === "bad" ? "yiqildi" : result.status === "new" ? "kelmagan" : result.status === "good" ? "yaxshi" : "A'lo"
        },
        {
            xs: 0.6,
            title: t("Izoh"),
            dataIndex: 'result',
            render: (result: any) => result.description
        },
        {
            xs: 0.12,
            title: t("Amallar"),
            dataIndex: 'result',
            render: (result: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {
                        result.score > 0 ? (
                            <IconifyIcon icon='mdi:edit' fontSize={20} onClick={() => (dispatch(setResultEdit(result.id)), dispatch(setOpen('result')))} />
                        ) : (
                            <IconifyIcon icon='fluent:add-32-regular' fontSize={20} onClick={() => (dispatch(setResultEdit(result.id)), dispatch(setOpen('result')))} />
                        )
                    }
                </div>
            ),
        },
    ]


    const formik: any = useFormik({
        initialValues: {
            score: "",
            description: "",
        },
        validationSchema: () => Yup.object({
            score: Yup.string().required("Natijasini kiriting"),
            description: Yup.string(),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            const findedStudent = results?.find((el: any) => el.result.id === examStudentId)
            try {
                await api[findedStudent.result.score > 0 ? 'patch' : 'post'](`common/exam/student/${findedStudent.result.score > 0 ? `update/${findedStudent.result.score > 0 ? findedStudent.result.result_id : examStudentId}` : 'create/'}`, {
                    student: examStudentId,
                    description: values.description,
                    score: values.score,
                    exam: resultId
                })
                dispatch(setOpen(null))
                await dispatch(getResults({ groupId: query?.id, examId: resultId }))
                formik.resetForm()
            } catch (err: any) {
                findedStudent.result.score > 0 ?
                    toast.error(err?.response?.data?.exam[0] || "") :
                    formik.setErrors(err?.response?.data);
            } finally {
                setLoading(false)
            }
        }
    })

    useEffect(() => {
        const findedStudent = results?.find((el: any) => el.result.id === examStudentId)
        formik.setFieldValue("score", findedStudent?.result?.score)
        formik.setFieldValue("description", findedStudent?.result?.description)
    }, [examStudentId])

    return (
        <Box sx={{ display: "flex", flexDirection: "column", }}>
            <Button sx={{ alignSelf: "end" }} onClick={() => dispatch(setResultId(null))} size="small" variant="contained" startIcon={<IconifyIcon icon={'ep:back'} />}>{t("Orqaga")}</Button>
            <DataTable loading={isGettingExamsResults} maxWidth="100%" minWidth="450px" data={results} columns={columnsResult} />
            <Drawer open={open === 'result'} anchor='right' variant='persistent'>
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
                        {t("Natija")}
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
                    <FormControl>
                        <TextField
                            size='small'
                            type="number"
                            name='score'
                            label={t("Natija")}
                            value={formik.values?.score}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.score && !!formik.touched.score}
                        />
                        <FormHelperText error>{!!formik.errors.score && !!formik.touched.score && formik.errors.score}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <TextField
                            size='small'
                            label={t("Izoh")}
                            multiline
                            minRows={4}
                            name='description'
                            value={formik.values?.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.description && !!formik.touched.description}
                        />
                        <FormHelperText error>{!!formik.errors.description && !!formik.touched.description && formik.errors.description}</FormHelperText>
                    </FormControl>
                    <LoadingButton loading={loading} variant="outlined" type="submit">Saqlash</LoadingButton>
                </form>
            </Drawer>
        </Box>
    )
}
