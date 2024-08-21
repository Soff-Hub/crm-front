
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import DataTable, { customTableDataProps } from 'src/@core/components/table';
import api from 'src/@core/utils/api';
import { formatCurrency } from 'src/@core/utils/format-currency';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchModerationSalaries, updateSalaryBonus, updateSalaryFine } from 'src/store/apps/finance';

type Props = {}

export default function SalaryConfirm({ }: Props) {
    const { t } = useTranslation()
    const { back, push } = useRouter()
    const dispatch = useAppDispatch()
    const { moderation_salaries, isPending, is_update } = useAppSelector(state => state.finance)
    const [loading, setLoading] = useState<'frozen' | 'approved' | null>(null)
    const [open, setOpen] = useState<boolean>(false)

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
            xs: 0.15,
            title: `${t("Bonuslar")} (so'm)`,
            dataIndex: 'bonus_amount',
            renderId: (id, bonus_amount) => <input style={{ width: '80px' }} type='string' value={+bonus_amount} onChange={(e) => dispatch(updateSalaryBonus({ id, bonus_amount: Number(e.target.value) || 0 }))} />
        },
        {
            xs: 0.16,
            title: `${t("Jarimalar")} (so'm)`,
            dataIndex: 'fine_amount',
            renderId: (id, fine_amount) => <input style={{ width: '80px' }} type='string' value={+fine_amount} onChange={(e) => dispatch(updateSalaryFine({ id, fine_amount: Number(e.target.value) || 0 }))} />
        },
        {
            xs: 0.18,
            title: t("Yakuniy ish haqqi"),
            dataIndex: 'final_salary',
            render: (final_salary) => `${formatCurrency(final_salary)} so'm`
        },
    ]

    const confirmSalary = async (status: 'frozen' | 'approved') => {
        setLoading(status)
        const update_data = moderation_salaries.map(el => ({ ...el, status }))
        try {
            await api.patch(`common/finance/employee-salaries/update/`, { update_data })
            toast.success("Muvaffaqiyatli saqlandi")
            if (status === 'frozen') {
                await dispatch(fetchModerationSalaries(''))
            } else {
                push('/finance')
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(null)
    }

    useEffect(() => {
        dispatch(fetchModerationSalaries(''))
    }, [])

    return (
        <div>
            <Box>
                <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center' }}>
                    <IconButton color='primary'>
                        <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={back} />
                    </IconButton>
                    <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Oylik hisoblash')}</Typography>
                </Box>
                <DataTable loading={isPending} maxWidth='100%' minWidth='800px' columns={withdrawCol} data={moderation_salaries} />
                {moderation_salaries.length > 0 && !isPending && moderation_salaries[0].status !== "approved" && <LoadingButton
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
                    moderation_salaries.length > 0 && !isPending && moderation_salaries[0].status !== "approved" && is_update && <LoadingButton
                        loading={loading === 'approved'}
                        sx={{ marginTop: '15px' }}
                        size='small'
                        variant='contained'
                        onClick={() => setOpen(true)}
                    >
                        {t("Saqlash")}
                    </LoadingButton>
                }
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    {/* <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(false)} /> */}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '350px' }}>
                    <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>{t("O'zgarishlarni butunlay saqlamoqchimisiz?")}</Typography>
                    <Typography sx={{ textAlign: 'center', marginBottom: '20px', color: 'orange' }}>{t("Bu amaliyotni ortga qaytarib bo'lmaydi")}</Typography>

                    <LoadingButton loading={loading === 'approved'} onClick={() => confirmSalary('approved')} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>
            </Dialog>
        </div>
    )
}