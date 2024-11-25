import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import { addStudentToGroup, getAttendance, getDays, getStudents, handleEditClickOpen, setGettingAttendance } from 'src/store/apps/groupDetails';

// ** MUI Imports
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { FormHelperText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { getMontNumber } from 'src/@core/utils/gwt-month-name';
import AutoComplete from './AutoComplate';

export default function AddStudents() {
    const [isLoading, setLoading] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState<number | null>(null)
    const router = useRouter()

    const { openEdit, groupData, queryParams } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()


    const formik: any = useFormik({
        initialValues: {
            body: "",
            start_date: "",
            student: ""
        },
        validationSchema: () => Yup.object({
            body: Yup.string(),
            start_date: Yup.string().required("Guruhga qo'shilish sanasi")
        }),
        onSubmit: async (values) => {
            setLoading(true)
            const data = {
                ...values,
                student: selectedStudents,
                groups: [groupData?.id]
            }
            const response = await dispatch(addStudentToGroup(data))
            if (response.meta.requestStatus === 'rejected') {
                formik.setErrors(response.payload)
            } else {
                setSelectedStudents(null)
                dispatch(setGettingAttendance(true))
                dispatch(handleEditClickOpen(null))
                const queryString = new URLSearchParams(queryParams).toString()
                await dispatch(getStudents({ id: router?.query?.id, queryString: queryString }))
                if (router?.query.month && groupData?.id) {
                    await dispatch(getAttendance({ date: `${router?.query?.year || new Date().getFullYear()}-${getMontNumber(router?.query.month)}`, group: groupData?.id, queryString: queryString }))
                    await dispatch(getDays({ date: `${router?.query?.year || new Date().getFullYear()}-${getMontNumber(router?.query.month)}`, group: groupData?.id }))
                }
                dispatch(setGettingAttendance(false))
                formik.resetForm()
                setSelectedStudents(null)
            }
            setLoading(false)
        }
    })




    return (
        <Dialog
            open={openEdit === 'add-student'}
            onClose={() => (dispatch(handleEditClickOpen(null)), formik.resetForm(), setSelectedStudents(null))}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 2] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                {t("Guruhga o'quvchi qo'shish")}
            </DialogTitle>{
                !!formik.errors.student && formik.touched.student &&
                <FormHelperText
                    sx={{ textAlign: "center", fontSize: "15px" }}
                    error>
                    {!!formik.errors.student && formik.touched.student && formik.errors.student}
                </FormHelperText>
            }
            <DialogContent>
                <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit}>
                    <AutoComplete setSelectedStudents={setSelectedStudents} />
                    {selectedStudents &&
                        <FormControl sx={{ width: '100%', margin: '10px 0' }}>
                            <TextField
                                type="date"
                                size='small'
                                label={t('Qo\'shilish sanasi')}
                                name='start_date'
                                value={formik.values.start_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                style={{ background: 'transparent', width: '100%' }}
                                error={!!formik.errors.start_date && formik.touched.start_date}
                            />
                            <FormHelperText
                                sx={{ marginBottom: '10px' }}
                                error={!!formik.errors.start_date && formik.touched.start_date}>
                                {!!formik.errors.start_date && formik.touched.start_date && formik.errors.start_date}
                            </FormHelperText>
                        </FormControl>}
                    {selectedStudents && <FormControl fullWidth>
                        <TextField
                            rows={4}
                            multiline
                            label="Izoh"
                            name='body'
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!formik.errors.body && formik.touched.body}
                        />
                        <FormHelperText error={!!formik.errors.body && formik.touched.body}>{!!formik.errors.body && formik.touched.body && formik.errors.body}</FormHelperText>
                    </FormControl>}
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <LoadingButton loading={isLoading} type='submit' variant='contained' sx={{ mr: 1 }}>
                            {t("Saqlash")}
                        </LoadingButton>
                        <Button variant='outlined' type='button' color='secondary' onClick={() => (dispatch(handleEditClickOpen(null)), setSelectedStudents(null), formik.resetForm())}>
                            {t("Bekor Qilish")}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}
