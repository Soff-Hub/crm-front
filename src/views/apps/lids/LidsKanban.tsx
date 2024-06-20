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
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from 'src/store';
import { editDepartment, fetchDepartmentList, setLoading, setOpenActionModal, setOpenItem, setOpenLid } from 'src/store/apps/leads';

interface Props {
    title: string
    status: "pending" | "new" | "success",
    items: any[],
    id: any,
}



export default function HomeKanban({ title, items, id }: Props) {

    //** Hooks
    const { loading, openActionModal: open } = useSelector((state: RootState) => state.leads)
    const dispatch = useAppDispatch()
    const { isMobile } = useResponsive()
    const { query } = useRouter()
    const { t } = useTranslation()


    // ** States
    const [name, setName] = React.useState<any>(title)
    const [nameVal, setNameVal] = React.useState<any>(title)


    //** Main Funcitons
    const editSubmit = async () => {
        await dispatch(editDepartment({ name: nameVal, id }))
        setName(nameVal)
        setOpen(null)
        await dispatch(fetchDepartmentList())
    }

    const deleteDepartmentItem = async () => {
        await dispatch(editDepartment({ is_active: false, id }))
        setName(nameVal)
        setOpen(null)
        toast.success("Muvaffaqiyatli o'chirildi")
        await dispatch(fetchDepartmentList())
    }

    const setOpen = (value: 'delete' | 'edit' | null) => {
        dispatch(setOpenActionModal(value))
    }

    return (
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', maxWidth: 350, minWidth: '300px' }}>
            <Box display={"flex"} alignItems={"center"} marginBottom={5} >
                <Typography fontSize={22}>{name}</Typography>
                {query?.is_active !== 'false' ? (
                    <>
                        <IconifyIcon icon={'system-uicons:user-add'} color='orange' onClick={() => dispatch(setOpenLid(id))} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                        <IconifyIcon icon={'iconoir:grid-add'} color='orange' onClick={() => dispatch(setOpenItem(id))} style={{ cursor: 'pointer', margin: '0 10px' }} />
                        <IconifyIcon icon={'mingcute:edit-line'} color='orange' onClick={() => setOpen('edit')} style={{ cursor: 'pointer', fontSize: '20px', marginRight: '5px' }} />
                        <IconifyIcon icon={'mingcute:delete-line'} color='red' onClick={() => setOpen('delete')} style={{ cursor: 'pointer', fontSize: '20px' }} />
                    </>
                ) : ''}
            </Box>

            <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start', width: '100%', flexDirection: 'column', pt: 0 }}>
                {
                    items.map(lead => (
                        <AccordionCustom item={lead} key={lead.id} onView={() => console.log("aa")} />
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
