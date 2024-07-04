import LoadingButton from '@mui/lab/LoadingButton'
import { Button, Dialog, DialogActions, DialogTitle, formGroupClasses } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { deleteGroup, handleOpenDeleteNote } from 'src/store/apps/groupDetails'

export default function Delete() {
    const [isLoading, setLoading] = useState(false)
    const { isOpenDelete } = useAppSelector(state => state.groupDetails)

    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const { query, push } = useRouter()

    const handleDelete = async () => {
        setLoading(true)
        if (query.id) {
            const response = await dispatch(deleteGroup("12"))
            if (response.meta.requestStatus == "fulfilled") {
                dispatch(handleOpenDeleteNote(false))
            } else {
                toast.error("Ma'lumotni o'chirib bo'lmadi")
            }
        }
        setLoading(false)
    }

    return (
        <Dialog
            open={isOpenDelete}
            onClose={() => dispatch(handleOpenDeleteNote(formGroupClasses))}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                {t("Eslatmani o'chirib tashlamoqchimisiz?")}
            </DialogTitle>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={isLoading} color='error' onClick={handleDelete} variant='outlined' sx={{ mr: 1 }}>
                    {t("O'chirish")}
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={() => dispatch(handleOpenDeleteNote(null))} >
                    {t("Bekor qilish")}
                </Button>
            </DialogActions>
        </Dialog>

    )
}
