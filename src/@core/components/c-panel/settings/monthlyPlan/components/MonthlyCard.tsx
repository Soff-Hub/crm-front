import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import IconifyIcon from "src/@core/components/icon";
import { TariffType } from "src/types/apps/cpanelTypes";
import { formatCurrency } from "src/@core/utils/format-currency";
import { useTranslation } from "react-i18next";
import { fetchTariffs, handleEditMonthlyPlan } from "src/store/apps/c-panel";
import { useAppDispatch } from "src/store";
import UserSuspendDialog from "src/views/apps/mentors/view/UserSuspendDialog";
import { useState } from "react";
import api from "src/@core/utils/api";
import { toast } from "react-hot-toast";


interface MonthlyCardProps {
    item: TariffType
}

export default function MonthlyCard({ item }: MonthlyCardProps) {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [isOpenDelete, setOpenDelete] = useState(false)

    async function handleDeletePosts() {
        setLoading(true)
        try {
            await api.delete(`owner/tariff/delete/${item.id}/`)
            toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
            dispatch(fetchTariffs())
        } catch (error: any) {
            toast.error('Xatolik yuz berdi!', { position: 'top-center' })
        }
        setLoading(false)
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minWidth: '150px' }}>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <Typography variant='body2'>{t("Tarif oylari")} :</Typography>
                        <Typography variant='body1' color="blueviolet">{item.month_count} oy</Typography>
                    </Box>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <Typography variant='body2'>{t("Summasi")} :</Typography>
                        <Typography variant="body1" color='green'>{formatCurrency(item.amount)} so'm</Typography>
                    </Box>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <Typography variant='body2'>{t("O'quvchilar")} :</Typography>
                        <Typography variant='body1' sx={{ color: 'orange' }}>{item.min_count}-{item.max_count} ta</Typography>
                    </Box>
                    <Box>
                        <Button onClick={() => setOpenDelete(true)} size='small' color='error'>
                            <IconifyIcon icon={'material-symbols-light:delete-outline'} />
                        </Button>
                        <Button onClick={() => dispatch(handleEditMonthlyPlan(item))} size='small' color='primary'>
                            <IconifyIcon icon={'material-symbols-light:edit-outline'} />
                        </Button>
                    </Box>
                </Box>
            </CardContent>
            <UserSuspendDialog
                loading={loading}
                handleOk={handleDeletePosts}
                open={isOpenDelete}
                setOpen={() => setOpenDelete(false)}
            />
        </Card >
    )
}
