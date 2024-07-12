import * as React from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import AccordionCustom from 'src/@core/components/accordion';
import IconifyIcon from 'src/@core/components/icon';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from 'src/store';
import { editDepartment, fetchDepartmentList, setOpenActionModal, setOpenItem, setOpenLid } from 'src/store/apps/leads';
import EditDepartmentDialog from './department/edit-dialog';

interface Props {
    title: string
    status: "pending" | "new" | "success",
    items: any[],
    id: any,
}



export default function HomeKanban({ title, items, id }: Props) {

    //** Hooks
    const { loading, openActionModal: open, queryParams, actionId } = useSelector((state: RootState) => state.leads)
    const dispatch = useAppDispatch()
    const { query } = useRouter()
    const { t } = useTranslation()


    //** Main Funcitons

    const deleteDepartmentItem = async () => {
        await dispatch(editDepartment({ is_active: false, id }))
        setOpen(null)
        toast.success("Muvaffaqiyatli o'chirildi")
        await dispatch(fetchDepartmentList())
    }

    const setOpen = (value: 'delete' | 'edit' | null) => {
        if (!value) {
            dispatch(setOpenActionModal({ open: null, id: null }))
            return
        }
        dispatch(setOpenActionModal({ open: value, id }))
    }

    return (
        <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', maxWidth: 350, minWidth: '300px' }}>
            <Box display={"flex"} alignItems={"center"} marginBottom={5} >
                <Typography fontSize={22}>{title}</Typography>
                {queryParams.is_active ? (
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
                    items.length < 1 && <Typography variant='body2' sx={{ fontStyle: 'italic', textAlign: 'center', width: '100%', fontSize: '19px' }}>{t("Bo'sh")}</Typography>
                }
                {
                    items.map(lead => (
                        <AccordionCustom item={lead} key={lead.id} onView={() => null} />
                    ))
                }
            </Box>

            <Dialog open={open === 'delete' && actionId === id}>
                <DialogContent sx={{ width: '320px', padding: '20px 0' }}>
                    <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
                        {t("Bo'limni rostdan ham o'chirmoqchimisiz?")}
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

            <EditDepartmentDialog id={id} name={title} />

        </Box >
    );
}
