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
import { formatCurrency } from "src/@core/utils/format-currency"
import showResponseError from "src/@core/utils/show-response-error"
import { customTableProps } from "src/pages/groups"


export const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month: any = today.getMonth() + 1;
    let day: any = today.getDate();

    // Ay va kunni ikki raqamli sifatida ko'rsatish uchun tekshirish
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
};


export interface ExamType {
    id: number
    title: string
    max_score: number
    min_score: number
    date: string
}

const UserViewBilling = () => {
    const { query } = useRouter()
    const { t } = useTranslation()
    const { isMobile } = useResponsive()
    const [error, setError] = useState<any>({})
    const [open, setOpen] = useState<'add' | 'edit' | 'delete' | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [editData, setEditData] = useState<any>()

    const [exams, setExams] = useState<ExamType[]>([])

    const getExams = async () => {
        try {
            const resp = await api.get('common/group/students/' + query.id)
            setExams(resp.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleEditOpen = async (id: any) => {
        const findedItem: any = await exams.find((el: any) => el.student.id === id)
        await setEditData(findedItem.student)
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
            await api.delete(`common/personal-payment/${editData}`)
            await getExams()
            handleClose()
        } catch (err: any) {
            setLoading(false)
        }
    }

    const handleEditSubmit = async (values: any) => {
        setLoading(true)
        try {
            await api.post('common/personal-payment/', { ...values, student: Number(editData.id) })
            await getExams()
            handleClose()
        } catch (err: any) {
            showResponseError(err.response.data, setError)
            setLoading(false)
        }
    }

    const columns: customTableProps[] = [
        {
            xs: 0.03,
            title: t("#"),
            dataIndex: 'index'
        },
        {
            xs: 0.25,
            title: t("first_name"),
            dataIndex: 'student',
            render: (student: any) => student.first_name
        },
        {
            xs: 0.20,
            title: t("Chegirma soni"),
            dataIndex: 'student',
            render: (student: any) => student.personal_amount?.discount_count || "bo'sh"
        },
        {
            xs: 0.30,
            title: t("Izoh"),
            dataIndex: 'student',
            render: (student: any) => student.personal_amount?.description || "bo'sh"
        },
        {
            xs: 0.20,
            title: t("Chegirma narx"),
            dataIndex: 'student',
            render: (student: any) => student.personal_amount ? `${formatCurrency(student.personal_amount?.amount)}` : "yo'q"
        },
        {
            xs: 0.12,
            title: t("Amallar"),
            dataIndex: 'student',
            render: (student: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {
                        student?.personal_amount ? <IconifyIcon icon='mdi:delete' fontSize={20} onClick={() => handleDeleteOpen(student?.personal_amount?.id)} /> :
                            <IconifyIcon icon='mdi:add' fontSize={20} onClick={() => handleEditOpen(student.id)} />
                    }
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
            <DataTable maxWidth="100%" minWidth="450px" data={exams} columns={columns} />

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
                        {t("O'quvchi chegirmasini tahrirlash")}
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
                        <TextField size='small' label={t("Chegirma narx")} type="number" name='amount' error={error.amount?.error} defaultValue={editData?.amount} />
                        <FormHelperText error={error.amount}>{error.amount?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' type="number" label={t("Chegirma soni")} name='discount_count' error={error.discount_count?.error} />
                        <FormHelperText error={error.discount_count}>{error.discount_count?.message}</FormHelperText>
                    </FormControl>

                    <FormControl>
                        <TextField size='small' multiline rows={4} label={t("Izoh")} name='description' error={error.description?.error} />
                        <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
                    </FormControl>

                    <LoadingButton loading={loading} variant="outlined" type="submit">{t('Saqlash')}</LoadingButton>
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

export default UserViewBilling