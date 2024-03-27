import * as React from 'react';
import { Box, Button, Dialog, DialogContent, FormControl, InputLabel, TextField, Typography } from '@mui/material';
import AccordionCustom from 'src/@core/components/accordion';
import IconifyIcon from 'src/@core/components/icon';
import LoadingButton from '@mui/lab/LoadingButton';
import api from 'src/@core/utils/api';
import toast from 'react-hot-toast';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface Props {
    title: string
    status: "pending" | "new" | "success",
    items: any[],
    setOpenItem: any,
    id: any,
    setOpenLid: any
    reRender: any
}



export default function HomeKanban({ title, items, setOpenItem, id, setOpenLid, reRender }: Props) {
    const [open, setOpen] = React.useState<'delete' | 'edit' | null>(null)
    const [loading, setLoading] = React.useState<any>(false)
    const [name, setName] = React.useState<any>(title)
    const [nameVal, setNameVal] = React.useState<any>(title)
    const { isMobile } = useResponsive()
    const { query } = useRouter()
    const { t } = useTranslation()

    const editSubmit = async () => {
        setLoading(true)
        try {
            await api.patch(`leads/department-update/${id}`, { name: nameVal })
            setName(nameVal)
            setLoading(false)
            setOpen(null)
            return reRender()
        } catch {
            setLoading(false)
        }
    }

    const deleteDepartmentItem = async () => {
        setLoading(true)
        try {
            await api.patch(`leads/department-update/${id}`, { is_active: false })
            setName(nameVal)
            setLoading(false)
            setOpen(null)
            toast.success("Muvaffaqiyatli o'chirildi")
            return reRender()
        } catch {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', maxWidth: 350, minWidth: '300px' }}>
            <Box display={"flex"} alignItems={"center"} marginBottom={5} >
                <Typography fontSize={22}>{name}</Typography>
                {query?.is_active !== 'false' ? (
                    <>
                        <IconifyIcon icon={'system-uicons:user-add'} color='orange' onClick={() => setOpenLid(id)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                        <IconifyIcon icon={'iconoir:grid-add'} color='orange' onClick={() => setOpenItem(id)} style={{ cursor: 'pointer', margin: '0 10px' }} />
                        <IconifyIcon icon={'mingcute:edit-line'} color='orange' onClick={() => setOpen('edit')} style={{ cursor: 'pointer', fontSize: '20px', marginRight: '5px' }} />
                        <IconifyIcon icon={'mingcute:delete-line'} color='red' onClick={() => setOpen('delete')} style={{ cursor: 'pointer', fontSize: '20px' }} />
                    </>
                ) : ''}
            </Box>

            <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start', width: '100%', flexDirection: 'column', pt: 0 }}>
                {
                    items.map(lead => (
                        <AccordionCustom reRender={reRender} item={lead} key={lead.id} onView={() => console.log("aa")} />
                    ))
                }
            </Box>

            <Dialog open={open === 'delete'}>
                <DialogContent sx={{ minWidth: '320px', padding: '20px 0' }}>
                    <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
                        {t("O'chirmoqchimisiz?")}
                    </Typography>
                </DialogContent>
                <Box sx={{ padding: '0 0 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button color='error' variant='contained' onClick={() => setOpen(null)}>
                        {t("Bekor qilish")}
                    </Button>
                    <LoadingButton loading={loading} color='primary' variant='outlined' onClick={deleteDepartmentItem}>
                        {t("O'chirish")}
                    </LoadingButton>
                </Box>
            </Dialog>

            <Dialog open={open === 'edit'} onClose={() => setOpen(null)}>
                <DialogContent sx={{ minWidth: '320px', padding: '20px' }}>
                    <FormControl fullWidth>
                        <TextField label={t("Bo'lim nomi")} onChange={(e) => setNameVal(e.target.value)} defaultValue={name} />
                    </FormControl>
                </DialogContent>
                <Box sx={{ padding: '0 0 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Button color='error' variant='contained' onClick={() => setOpen(null)}>
                        {t("Bekor qilish")}
                    </Button>
                    <LoadingButton loading={loading} color='primary' variant='outlined' onClick={editSubmit}>
                        {t("Saqlash")}
                    </LoadingButton>
                </Box>
            </Dialog>
        </Box >
    );
}
