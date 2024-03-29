import LoadingButton from "@mui/lab/LoadingButton"
import { Box, Button, Dialog, DialogActions, DialogContent, Drawer, FormControl, FormHelperText, IconButton, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Form from "src/@core/components/form"
import IconifyIcon from "src/@core/components/icon"
import DataTable from "src/@core/components/table"
import useResponsive from "src/@core/hooks/useResponsive"
import api from "src/@core/utils/api"
import showResponseError from "src/@core/utils/show-response-error"
import { customTableProps } from "src/pages/groups"

export interface ExamType {
    id: number
    title: string
    max_score: number
    min_score: number
    date: string
}

const GroupExamsList = () => {
    const { query } = useRouter()
    const { t } = useTranslation()
    const { isMobile } = useResponsive()
    const [error, setError] = useState<any>({})
    const [open, setOpen] = useState<'add' | 'edit' | 'delete' | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [editData, setEditData] = useState<any>()
    const [result, setResult] = useState<any>(null)

    const [exams, setExams] = useState<ExamType[]>([])



    const getExams = async () => {
        try {
            const resp = await api.get('common/exam/' + query.id)
            setExams(resp.data);
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (values: any) => {
        setLoading(true)
        try {
            await api.post('common/exam/create/', { ...values, group: Number(query.id) })
            await getExams()
            setLoading(false)
            setOpen(null)
        } catch (err: any) {
            showResponseError(err.response.data, setError)
            setLoading(false)
        }
    }


    const handleEditOpen = async (id: any) => {
        const findedItem = await exams.find(el => el.id === id)
        await setEditData(findedItem)
        setOpen('edit')
    }

    const handleDeleteOpen = async (id: any) => {
        setEditData(id)
        setOpen('delete')
    }


    const handleClose = () => {
        setLoading(false)
        setEditData(null)
        setOpen(null)
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            await api.delete('common/exam/destroy/' + editData)
            await getExams()
            handleClose()
        } catch (err: any) {
            setLoading(false)
        }
    }

    const handleEditSubmit = async (values: any) => {
        setLoading(true)
        try {
            await api.patch('common/exam/update/' + editData.id, { ...values, group: Number(query.id) })
            await getExams()
            handleClose()
        } catch (err: any) {
            showResponseError(err.response.data, setError)
            setLoading(false)
        }
    }

    const columns: customTableProps[] = [
        {
            xs: 0.25,
            title: t("Nomi"),
            dataIndex: 'title',
        },
        {
            xs: 0.3,
            title: t("Topshirish sanasi"),
            dataIndex: 'date',
        },
        {
            xs: 0.2,
            title: t("O'tish bali"),
            dataIndex: 'min_score',
        },
        {
            xs: 0.3,
            title: t("Maksimal bal"),
            dataIndex: 'max_score',
        },
        {
            xs: 0.12,
            title: t("Amallar"),
            dataIndex: 'id',
            render: (id) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IconifyIcon icon='mdi:edit' fontSize={20} onClick={() => handleEditOpen(id)} />
                    <IconifyIcon icon='mdi:delete' fontSize={20} onClick={() => handleDeleteOpen(id)} />
                </div>
            )
        },
    ]



    useEffect(() => {
        if (query?.id) {
            getExams()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.id])


    return (
        <Box className='demo-space-y'>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: 0 }}>
                <Button variant="outlined" sx={{ marginLeft: 'auto' }} size="small">Natijalarni kiritish</Button>
                <Button variant="contained" sx={{ marginLeft: '15px' }} size="small" onClick={() => setOpen('add')}>yaratish</Button>
            </div>
            <DataTable maxWidth="100%" minWidth="450px" data={exams} columns={columns} />

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
                <Form reqiuredFields={['title', 'date', 'max_score', 'min_score']} setError={setError} valueTypes="json" onSubmit={handleSubmit} id="create-exam" sx={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <FormControl>
                        <TextField size='small' label={t("Imtixon nomi")} name='title' error={error.title?.error} />
                        <FormHelperText error={error.title}>{error.title?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' type="date" label={t("Imtixon sanasi")} name='date' error={error.date?.error} />
                        <FormHelperText error={error.date}>{error.date?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' label={t("O'tish ball")} name='min_score' error={error.min_score?.error} />
                        <FormHelperText error={error.min_score}>{error.min_score?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' label={t("Maksimal ball")} name='max_score' error={error.max_score?.error} />
                        <FormHelperText error={error.max_score}>{error.max_score?.message}</FormHelperText>
                    </FormControl>

                    <LoadingButton loading={loading} variant="outlined" type="submit">Saqlash</LoadingButton>
                </Form>
            </Drawer>


            <Drawer open={open === 'edit'} anchor='right' variant='persistent'>
                <Box
                    className='customizer-header'
                    sx={{
                        position: 'relative',
                        p: theme => theme.spacing(3.5, 5),
                        borderBottom: theme => `1px solid ${theme.palette.divider}`,
                        width: isMobile ? '320px' : '400px'
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        {t("Imtixonni tahrirlash")}
                    </Typography>
                    <IconButton
                        sx={{
                            right: 20,
                            top: '50%',
                            position: 'absolute',
                            color: 'text.secondary',
                            transform: 'translateY(-50%)'
                        }}
                        onClick={handleClose}
                    >
                        <IconifyIcon icon='mdi:close' fontSize={20} />
                    </IconButton>
                </Box>
                {editData && <Form setError={setError} valueTypes="json" onSubmit={handleEditSubmit} id="update-exam" sx={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <FormControl>
                        <TextField size='small' label={t("Imtixon nomi")} name='title' error={error.title?.error} defaultValue={editData?.title} />
                        <FormHelperText error={error.title}>{error.title?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' type="date" label={t("Imtixon sanasi")} name='date' error={error.date?.error} defaultValue={editData?.date} />
                        <FormHelperText error={error.date}>{error.date?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' label={t("O'tish ball")} name='min_score' error={error.min_score?.error} defaultValue={editData?.min_score} />
                        <FormHelperText error={error.min_score}>{error.min_score?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' label={t("Maksimal ball")} name='max_score' error={error.max_score?.error} defaultValue={editData?.max_score} />
                        <FormHelperText error={error.max_score}>{error.max_score?.message}</FormHelperText>
                    </FormControl>

                    <LoadingButton loading={loading} variant="outlined" type="submit">Saqlash</LoadingButton>
                </Form>}
            </Drawer>

            <Dialog open={open === 'delete'}>
                <DialogContent sx={{ padding: '40px' }}>
                    <Typography fontSize={26}>Rostdan ham o'chirmqochimisiz?</Typography>
                    <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <LoadingButton color="primary" variant="contained" onClick={handleClose}>Bakor qilish</LoadingButton>
                        <LoadingButton loading={loading} color="error" variant="outlined" onClick={() => handleDelete()}> Ha O'chirish</LoadingButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default GroupExamsList
