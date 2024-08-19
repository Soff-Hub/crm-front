import { Box, Button, Card, CardContent, Typography } from "@mui/material"
import { useState } from "react"
import { toast } from "react-hot-toast"
import IconifyIcon from "src/@core/components/icon"
import api from "src/@core/utils/api"
import { formatCurrency } from "src/@core/utils/format-currency"
import { useAppDispatch } from "src/store"
import { fetchSMSTariffs, handleEditSMSTariff } from "src/store/apps/c-panel"
import { SMSTariff } from "src/types/apps/cpanelTypes"
import UserSuspendDialog from "src/views/apps/mentors/view/UserSuspendDialog"

export default function SMSCard({ item }: { item: SMSTariff }) {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [isOpenDelete, setOpenDelete] = useState(false)

    async function handleDeletePosts() {
        setLoading(true)
        try {
            await api.delete(`owner/sms-tariff/delete/${item.id}/`)
            toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
            dispatch(fetchSMSTariffs())
        } catch (error: any) {
            toast.error('Xatolik yuz berdi!', { position: 'top-center' })
        }
        setLoading(false)
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minWidth: '150px' }}>
                    <Typography color='green'>{formatCurrency(item.amount)} so'm</Typography>
                    <Typography variant='body2' sx={{ color: 'orange' }}>{item.sms_count} ta sms</Typography>
                    <Box>
                        <Button size='small' color='error'>
                            <IconifyIcon onClick={() => setOpenDelete(true)} icon={'material-symbols-light:delete-outline'} />
                        </Button>
                        <Button onClick={() => dispatch(handleEditSMSTariff(item))} size='small' color='primary'>
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
        </Card>
    )
}
