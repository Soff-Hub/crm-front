import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import api from 'src/@core/utils/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getStudents } from 'src/store/apps/groupDetails';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from 'src/store';
import { StudentDetailType } from 'src/types/apps/studentsTypes';


export default function EditStudent({ student, id, activate, setActivate, status }: { student: any, id: string, activate: boolean, setActivate: (status: boolean) => void, status: string }) {
    const { studentsQueryParams } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    const [isLoading, setLoading] = useState(false)
    const { query } = useRouter()

    const formik = useFormik({
        initialValues: { added_at: student.added_at, status },
        validationSchema: () => Yup.object({
            added_at: Yup.string(),
            status: Yup.string()
        }),
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await api.patch(`common/group-student-update/${id}`, values)
                toast.success("O'quvchi malumotlari o'zgartirildi", { position: 'top-center' })
                setLoading(false)
                setActivate(false)
                const queryString = new URLSearchParams({ ...studentsQueryParams }).toString()
                dispatch(getStudents({ id: query.id, queryString: queryString }))
            } catch (err: any) {
                formik.setErrors(err?.response?.data)
                setLoading(false)
            }
        }
    })

    return (
        <Dialog open={activate} onClose={() => setActivate(false)}>
            <DialogContent sx={{ minWidth: '350px' }}>
                <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>O'quvchini tahrirlash</Typography>
                <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <FormControl>
                        <TextField
                            error={!!formik.errors.added_at && !!formik.touched.added_at}
                            name='added_at'
                            type='date'
                            value={formik.values.added_at}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            label={"Qo'shilgan sana"}
                            size='small'
                        />
                        {!!formik.errors.added_at && !!formik.touched.added_at && <FormHelperText error>{`${formik.errors.added_at}`}</FormHelperText>}
                    </FormControl>
                    <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>Status (holati)</InputLabel>
                        <Select
                            size='small'
                            label="Status (holati)"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            name='status'
                        >
                            <MenuItem value={'active'}>Aktiv</MenuItem>
                            <MenuItem value={'new'}>Sinov darsi</MenuItem>
                            <MenuItem value={'archive'}>Arxiv</MenuItem>
                            <MenuItem value={'frozen'}>Muzlatish</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Button onClick={() => setActivate(false)} size='small' variant='outlined' color='error'>bekor qilish</Button>
                        <LoadingButton loading={isLoading} type='submit' size='small' variant='contained'>Saqlash</LoadingButton>
                    </Box>
                </form>

            </DialogContent>
        </Dialog>
    )
}
