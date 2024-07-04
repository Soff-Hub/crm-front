import LoadingButton from "@mui/lab/LoadingButton";
import { Typography } from "@mui/material";
import { useAppSelector } from "src/store";

export default function DeleteExam() {
    const { resultId, isGettingExams, open, results } = useAppSelector(state => state.groupDetails)

    const handleDelete = async () => {
        setLoading(true)
        try {
            await api.delete('common/exam/destroy/' + editData)
            await getExams()
            handleClose()
        } catch (err: any) {
            setLoading(false)
        }
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
