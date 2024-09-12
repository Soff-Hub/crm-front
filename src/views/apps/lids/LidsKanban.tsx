import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import IconifyIcon from 'src/@core/components/icon';
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from 'src/store';
import { editDepartment, fetchDepartmentList, setOpenActionModal, setOpenItem, setOpenLid } from 'src/store/apps/leads';
import dynamic from 'next/dynamic';

const AccordionCustom = dynamic(() => import('src/@core/components/accordion'));
const EditDepartmentDialog = dynamic(() => import('./department/edit-dialog'));

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
            <Box display={"flex"} alignItems={"center"} justifyContent="space-between" marginBottom={5} >
                <Typography fontSize={22}>{title}</Typography>
                {queryParams.is_active ? (
                    <Box sx={{ display: "flex", gap: "5px" }}>
                        <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                            <IconifyIcon icon={'fluent:person-add-24-filled'} color='#84cc16' onClick={() => dispatch(setOpenLid(id))} />
                        </IconButton>
                        <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                            <IconifyIcon icon={'heroicons-solid:view-grid-add'} color='#14b8a6' onClick={() => dispatch(setOpenItem(id))} />
                        </IconButton>
                        {title?.toLowerCase() !== 'leads' && <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                            <IconifyIcon icon={'fluent:text-bullet-list-square-edit-20-filled'} color='orange' onClick={() => setOpen('edit')} />
                        </IconButton>}
                        {title?.toLowerCase() !== 'leads' && <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                            <IconifyIcon icon={'icon-park-solid:delete-four'} color='red' onClick={() => setOpen('delete')} fontSize="20px" />
                        </IconButton>}
                    </Box>
                ) : ''}
            </Box>

            <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start', width: '100%', flexDirection: 'column', pt: 0 }}>
                {
                    items.length < 1 && <Typography variant='body2' sx={{ fontStyle: 'italic', textAlign: 'center', width: '100%', fontSize: '19px' }}>{t("Bo'sh")}</Typography>
                }
                {
                    items.map(lead => (
                        <AccordionCustom parentId={id} item={lead} key={lead.id} onView={() => null} />
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
                    <Button color='primary' variant='outlined' onClick={() => setOpen(null)}>
                        {t("Bekor qilish")}
                    </Button>
                    <LoadingButton color='error' loading={loading} variant='contained' onClick={deleteDepartmentItem}>
                        {t("O'chirish")}
                    </LoadingButton>
                </Box>
            </Dialog>

            <EditDepartmentDialog id={id} name={title} />

        </Box >
    );
}
