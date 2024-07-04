import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Drawer,
    FormControl,
    FormHelperText,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import Form from "src/@core/components/form";
import IconifyIcon from "src/@core/components/icon";
import { useAppSelector } from "src/store";

export default function EditExam() {
    const { resultId, isGettingExams, open, results } = useAppSelector(state => state.groupDetails)
    const handleEditSubmit = async (values: any) => {
        setLoading(true)
        try {
            await api.patch('common/exam/update/' + editData.id, { ...values, group: Number(query.id) })
            await getExams()
            handleClose()
        } catch (err: any) {
            showResponseError(err.response.data, setError)
            setLoading(false)
        }
    }
    return (
        <Drawer open={open === 'edit'} anchor='right' variant='persistent'>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`,
                    width: isMobile ? '320px' : '400px'
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {t("Imtixonni tahrirlash")}
                </Typography>
                <IconButton
                    sx={{
                        right: 20,
                        top: '50%',
                        position: 'absolute',
                        color: 'text.secondary',
                        transform: 'translateY(-50%)'
                    }}
                    onClick={handleClose}
                >
                    <IconifyIcon icon='mdi:close' fontSize={20} />
                </IconButton>
            </Box>
            {editData && <Form setError={setError} valueTypes="json" onSubmit={handleEditSubmit} id="update-exam" sx={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <FormControl>
                    <TextField size='small' label={t("Imtixon nomi")} name='title' error={error.title?.error} defaultValue={editData?.title} />
                    <FormHelperText error={error.title}>{error.title?.message}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField size='small' type="date" label={t("Imtixon sanasi")} name='date' error={error.date?.error} defaultValue={editData?.date} />
                    <FormHelperText error={error.date}>{error.date?.message}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField size='small' label={t("O'tish ball")} name='min_score' error={error.min_score?.error} defaultValue={editData?.min_score} />
                    <FormHelperText error={error.min_score}>{error.min_score?.message}</FormHelperText>
                </FormControl>

                <FormControl>
                    <TextField size='small' label={t("Maksimal bal")} name='max_score' error={error.max_score?.error} defaultValue={editData?.max_score} />
                    <FormHelperText error={error.max_score}>{error.max_score?.message}</FormHelperText>
                </FormControl>

                <LoadingButton loading={loading} variant="outlined" type="submit">{t('Saqlash')}</LoadingButton>
            </Form>}
        </Drawer>

    )
}
