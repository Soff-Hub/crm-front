import LoadingButton from '@mui/lab/LoadingButton'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { deleteGroup, handleEditClickOpen } from 'src/store/apps/groupDetails'

export default function Delete() {
    const [isLoading, setLoading] = useState(false)
    const { openEdit } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const { query, push } = useRouter()

    const handleDelete = async () => {
        setLoading(true)
        if (query.id) {
            const response = await dispatch(deleteGroup(query?.id))
            if (response.meta.requestStatus == "fulfilled") {
                dispatch(handleEditClickOpen(null))
                push("/groups")
            } else {
                toast.error("Guruhni o'chirib bo'lmadi")
            }
        }
        setLoading(false)
    }

    return (
        <Dialog
            open={openEdit == 'delete'}
            onClose={() => dispatch(handleEditClickOpen(null))}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                {t("Guruh o'chirib tashlash")}
            </DialogTitle>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={isLoading} color='error' onClick={handleDelete} variant='outlined' sx={{ mr: 1 }}>
                    {t("O'chirish")}
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={() => dispatch(handleEditClickOpen(null))} >
                    {t("Bekor qilish")}
                </Button>
            </DialogActions>
        </Dialog>

    )
}
