import LoadingButton from "@mui/lab/LoadingButton";
import { Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "src/@core/utils/api";
import { useAppDispatch, useAppSelector } from "src/store";
import { getExams, setEditData, setOpen } from "src/store/apps/groupDetails";

export default function DeleteExam() {
    const { open, editData } = useAppSelector(state => state.groupDetails)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const { query } = useRouter()

    const handleClose = () => {
        dispatch(setOpen(null))
        dispatch(setEditData(null))
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const response = await api.delete('common/exam/destroy/' + editData)
            if (response.status == 204) {
                handleClose()
                toast.success("Ma'lumot o'chirildi")
                await dispatch(getExams(query?.id))
            } else toast.error("Ma'lumotni o'chirib bo'lmadi")
        } catch (err: any) {
            toast.error("Ma'lumotni o'chirib bo'lmadi")
        } finally { setLoading(false) }
    }

    return (
        <Dialog open={open === 'delete'}>
            <DialogContent sx={{ padding: '40px' }}>
                <Typography fontSize={26}>Rostdan ham o'chirmqochimisiz?</Typography>
                <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <LoadingButton color="primary" variant="contained" onClick={handleClose}>Bakor qilish</LoadingButton>
                    <LoadingButton loading={loading} color="error" variant="outlined" onClick={() => handleDelete()}> Ha O'chirish</LoadingButton>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}
