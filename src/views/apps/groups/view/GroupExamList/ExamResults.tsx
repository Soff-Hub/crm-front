import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Drawer,
    FormControl,
    FormHelperText,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Form from "src/@core/components/form";
import IconifyIcon from "src/@core/components/icon";
import DataTable from "src/@core/components/table";
import useResponsive from "src/@core/hooks/useResponsive";
import { customTableProps } from "src/pages/groups";
import { useAppDispatch, useAppSelector } from "src/store";
import { setOpen } from "src/store/apps/groupDetails";



export default function ExamResults() {
    const { resultId, isGettingExams, open, results } = useAppSelector(state => state.groupDetails)
    const { query } = useRouter()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)

    const { isMobile } = useResponsive()
    const { t } = useTranslation()

    const handleClose = () => {
        setLoading(false)
        dispatch(setOpen(null))
    }

    const sendResult = async (values: any) => {
        setLoading(true)
        // const findedStudent = result.find((el: any) => el.result.id === resultEdit)
        // try {
        //     await api[findedStudent.result.score > 0 ? 'patch' : 'post'](`common/exam/student/${findedStudent.result.score > 0 ? `update/${findedStudent.result.score > 0 ? findedStudent.result.result_id : resultEdit}` : 'create/'}`, {
        //         student: resultEdit,
        //         description: values.description,
        //         score: values.score,
        //         exam: resultId
        //     })
        //     getResults(resultId)
        //     setOpen(null)
        //     setLoading(false)
        // } catch (err) {
        // console.log(err);
        // setLoading(false)
        // }
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
                            <IconifyIcon icon='mdi:edit' fontSize={20} onClick={() => (setResultEdit(result.id), setOpen('result'))} />
                        ) : (
                            <IconifyIcon icon='fluent:add-32-regular' fontSize={20} onClick={() => (setResultEdit(result.id), setOpen('result'))} />
                        )
                    }
                </div>
            ),
        },
    ]
    return (
        <Box>
            {/* <Button onClick={() => (setResult([]), setResultEdit(null), setResultId(null))} size="small" variant="contained" startIcon={<IconifyIcon icon={'ep:back'} />}>{t("Orqaga")}</Button> */}
            <DataTable loading={isGettingExams} maxWidth="100%" minWidth="450px" data={results} columns={columnsResult} />
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
                <Form setError={setError} valueTypes="json" onSubmit={sendResult} id="wtedtwetert" sx={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                    <FormControl>
                        <TextField size='small' label={t("Natija")} type="number" name='score' error={error.score?.error} />
                        <FormHelperText error={error.score}>{error.score?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' label={t("Izoh")} multiline minRows={4} name='description' error={error.description?.error} />
                        <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
                    </FormControl>

                    <LoadingButton loading={loading} variant="outlined" type="submit">Saqlash</LoadingButton>
                </Form>
            </Drawer>
        </Box>
    )
}
