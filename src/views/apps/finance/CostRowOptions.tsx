import { IconButton, Menu, MenuItem } from '@mui/material';
import { MouseEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import api from 'src/@core/utils/api';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getAdvanceList, setOpenEdit } from 'src/store/apps/finance/advanceSlice';
import { disablePage } from 'src/store/apps/page';
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog';


type Props = {
    id: number,
    onEdit: any
}

export default function CostRowActions({ id, onEdit }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { queryParams } = useAppSelector(state => state.advanceSlice)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    const handleDelete = () => {
        handleRowOptionsClose()
        setSuspendDialogOpen(true)
    }

    const handleEdit = async () => {
        onEdit(id)
        setAnchorEl(null)
    }


    async function submitDelete() {
        setLoading(true)
        dispatch(disablePage(true))
        const res = await api.delete(`/common/finance/prepayment/delete/${id}/`)
        if (res.status == 201 || 200) {
            toast.success("Avans o'chirildi")
            await dispatch(getAdvanceList())
        } else {
            toast.error("Avansni o'chirib bo'lmaydi")
        }
        dispatch(disablePage(false))
        setLoading(false)
    }



    return (
        <>
            <IconButton size='small' onClick={handleRowOptionsClick}>
                <IconifyIcon icon='mdi:dots-vertical' />
            </IconButton>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={rowOptionsOpen}
                onClose={handleRowOptionsClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{ style: { minWidth: '8rem' } }}
            >
                <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleEdit}>
                    <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                    {t("Tahrirlash")}
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                    {t("O'chirish")}
                </MenuItem>
            </Menu>
            <UserSuspendDialog loading={loading} handleOk={submitDelete} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </>
    )
}