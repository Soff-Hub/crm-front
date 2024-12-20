//@ts-nocheck
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSidePropsContext, InferGetStaticPropsType } from "next/types";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { formatAmount, revereAmount } from "src/@core/components/amount-input";
import IconifyIcon from "src/@core/components/icon";
import DataTable, { customTableDataProps } from "src/@core/components/table";
import api from "src/@core/utils/api";
import { formatCurrency } from "src/@core/utils/format-currency";
import { AuthContext } from "src/context/AuthContext";
import { useAppDispatch, useAppSelector } from "src/store";
import { fetchCalculatedSalary, fetchModerationSalaries, updateSalaryBonus, updateSalaryFine } from "src/store/apps/finance";
import TeacherGroupsModal from "src/views/apps/finance/TeacherGroupsModal";

const UserView = ({ slug }: InferGetStaticPropsType<typeof getServerSideProps>) => {
    const { moderation_salaries, isGettingCalculatedSalary, isPending, is_update } = useAppSelector(state => state.finance)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [loading, setLoading] = useState<'frozen' | 'approved' | null>(null)
    const { back, push } = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const { user } = useContext(AuthContext)


    const handleGetSalary = async (teacherId: number) => {
        setId(teacherId)
        await dispatch(fetchCalculatedSalary({ id: teacherId, queryParams: `date=${slug}` }))
    }

    const withdrawCol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index",
        },
        {
            xs: 0.16,
            title: t("first_name"),
            dataIndex: "employee_data",
            render: (employee_data: any) => employee_data.name
        },
        {
            xs: 0.16,
            title: t("O'zgarmas oylik"),
            dataIndex: "fixed_salary",
            render: (fixed_salary) => `${formatCurrency(+fixed_salary)} so'm`
        },
        {
            xs: 0.08,
            title: t("Foiz ulush (%)"),
            dataIndex: "kpi",
            render: (kpi) => `${+kpi} %`
        },
        {
            xs: 0.14,
            title: t("Foiz ulush (so'm)"),
            dataIndex: 'kpi_salary',
            render: (kpi_salary) => `${formatCurrency(kpi_salary)} so'm`
        },
        {
            xs: 0.14,
            title: t("Ish haqqi"),
            dataIndex: 'salary',
            render: (salary) => `${formatCurrency(salary)} so'm`
        },
        {
            xs: 0.14,
            title: t("Avanslar"),
            dataIndex: 'prepayment',
            render: (prepayment) => `${formatCurrency(prepayment)} so'm`
        },
        {
            xs: 0.13,
            title: `${t("Jarimalar soni")}`,
            dataIndex: 'fines_count',
            render: (fines_count) => `${fines_count} ta`
        },
        {
            xs: 0.13,
            title: `${t("Bonuslar")} (so'm)`,
            dataIndex: 'bonus_amount',
            renderId: (id, bonus_amount) => (
                console.log(bonus_amount),
                <input className="salary-table__input" disabled={!is_update} style={{ width: '80px', zIndex: 999 }} type='string' value={formatAmount(String(bonus_amount))} onChange={(e) => (e.stopPropagation(), dispatch(updateSalaryBonus({ id, bonus_amount: revereAmount(e.target.value) || 0 })))} />
            )
        },
        {
            xs: 0.13,
            title: `${t("Jarimalar")} (so'm)`,
            dataIndex: 'fine_amount',
            renderId: (id, fine_amount) => <input className="salary-table__input" disabled={!is_update} style={{ width: '80px' }} type='string' value={formatAmount(String(fine_amount))} onChange={(e) => (e.stopPropagation(), dispatch(updateSalaryFine({ id, fine_amount: revereAmount(e.target.value) || 0 })))} />
        },
        {
            xs: 0.18,
            title: t("Yakuniy ish haqqi"),
            dataIndex: 'final_salary',
            render: (final_salary) => `${formatCurrency(final_salary)} so'm`
        },
        {
            xs: 0.1,
            title: t(""),
            dataIndex: 'employee_data',
            render: (employee_data) => {
                const teacherID = employee_data.id
                return (
                    <LoadingButton
                        loading={teacherID == id && isGettingCalculatedSalary}
                        size="small"
                        onClick={() => handleGetSalary(teacherID)}>
                        {t("Batafsil")}
                    </LoadingButton>
                )
            }
        },
    ]


    useEffect(() => {
        if (!user?.role.includes('ceo') && !user?.role.includes('casher') && !user?.role.includes('watcher')) {
            router.push("/")
            toast.error('Sahifaga kirish huquqingiz yoq!')
        }
        dispatch(fetchModerationSalaries(`date=${slug}`))
    }, [])

    const confirmSalary = async (status: 'frozen' | 'approved') => {
        setLoading(status)
        const update_data = moderation_salaries.map(el => ({ ...el, status }))
        try {
            await api.patch(`common/finance/employee-salaries/update/`, { update_data })
            toast.success("Ma'lumotlar saqlandi")
            // await dispatch(fetchModerationSalaries(''))
            push('/finance')
        } catch (err) {
            console.log(err);
        }
        setLoading(null)
    }


    return (
        <Box>
            <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center' }}>
                <IconButton color='primary'>
                    <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={back} />
                </IconButton>
                {is_update ? <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t("Oylik ishlash")}</Typography> :
                    <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t("To'langan oyliklar hisoboti")}</Typography>}
            </Box>
            <DataTable loading={isPending} maxWidth='100%' minWidth='800px' columns={withdrawCol} data={moderation_salaries} />
            {is_update && !isPending && <LoadingButton
                loading={loading === 'frozen'}
                sx={{ marginTop: '15px', marginRight: '20px' }}
                size='small'
                variant='contained'
                color='secondary'
                onClick={() => confirmSalary('frozen')}
            >
                {t("Vaqtincha saqlash")}
            </LoadingButton>}
            {
                is_update && !isPending && <LoadingButton
                    loading={loading === 'approved'}
                    sx={{ marginTop: '15px' }}
                    size='small'
                    variant='contained'
                    onClick={() => setOpen(true)}
                >
                    {t("Saqlash")}
                </LoadingButton>
            }

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '350px' }}>
                    <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>{t("O'zgarishlarni butunlay saqlamoqchimisiz?")}</Typography>
                    <Typography sx={{ textAlign: 'center', marginBottom: '20px', color: 'orange' }}>{t("Bu amaliyotni ortga qaytarib bo'lmaydi")}</Typography>

                    <LoadingButton loading={loading === 'approved'} onClick={() => confirmSalary('approved')} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>
            </Dialog>

            <TeacherGroupsModal />
        </Box>)
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params } = context;

    return {
        props: {
            slug: params?.slug
        },
    };
}

export default UserView
