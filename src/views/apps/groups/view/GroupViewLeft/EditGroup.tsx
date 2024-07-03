import { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store';
import { handleEditClickOpen } from 'src/store/apps/groupDetails';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import { Box, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function EditGroup() {
    const [isLoading, setLoading] = useState(false)
    const { openEdit, groupData, teachers, rooms, courses } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()

    const formik = useFormik({
        initialValues: {
            name: "",
            course: courses?.find(el => el.id === groupData?.course_data.id)?.id || '',
            teacher: teachers?.find(el => el.id === groupData.teacher_data.id)?.id || '',
            room: rooms?.find(el => el.id === groupData.room_data.id)?.id || ''
        },
        validationSchema: () => Yup.object({
            name: Yup.string().required("Guruhga nomi kiriting"),
            course: Yup.string().required("Kursni tanlang"),
            teacher: Yup.string().required("O'qituvchini tanlang"),
            room: Yup.string().required("Xonani tanlang")
        }),
        onSubmit: async (values) => {
            setLoading(true)
            setLoading(false)
        }
    })


    const handleEditSubmit = async (values: any) => {
        setLoading(true)
        const obj = { ...values }
        const days = {}

        if ((weekdays === null || weekdays === 0) && customWeekdays.length > 0) {
            Object.assign(days, { day_of_week: customWeekdays })
        } else {
            Object.assign(days, { day_of_week: values.day_of_week.split(',') })
        }

        try {
            await updateGroup(updateGroup(groupData?.id, obj))
            await api.post('common/lesson-days-update/', {
                group: groupData?.id,
                ...days
            })
            dispatch(handleEditClickOpen(null))
            setLoading(false)
            setWeekDays(null)
        } catch (err) {
            setLoading(false)
            console.log(err);
        }
    }
    return (
        <Dialog
            open={openEdit === 'edit'}
            onClose={() => dispatch(handleEditClickOpen(null))}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 2] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                {t("Guruhni tahrirlash")}
            </DialogTitle>
            <DialogContent>
                {teachers && rooms && courses &&
                    <form
                        onSubmit={formik.handleSubmit}
                        style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}
                    >
                        <FormControl sx={{ width: '100%' }}>
                            <TextField
                                size='small'
                                label={t("Guruh nomi")}
                                name='name'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={!!formik.errors.name && formik.touched.name}
                            />
                            <FormHelperText error={!!formik.errors.name && formik.touched.name}>{!!formik.errors.name && formik.touched.name && formik.errors.name}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel size='small' id='user-view-language-label'>{t("Kurs")}</InputLabel>
                            <Select
                                size='small'
                                error={!!formik.errors.course && formik.touched.course}
                                label={t('Kurs')}
                                id='user-view-language'
                                labelId='user-view-language-label'
                                name='course'
                                value={formik.values.course}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {
                                    courses?.map(course => <MenuItem key={course.id} value={+course.id}>{course.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={!!formik.errors.course && formik.touched.course}>{!!formik.errors.course && formik.touched.course && formik.errors.course}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel size='small' id='user-view-language-label'>{t("O'qituvchi")}</InputLabel>
                            <Select
                                size='small'
                                label={t("O'qituvchi")}
                                id='user-view-language'
                                labelId='user-view-language-label'
                                name='teacher'
                                error={!!formik.errors.teacher && formik.touched.teacher}
                                value={formik.values.teacher}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {
                                    teachers?.map(teacher => <MenuItem key={teacher.id} value={+teacher.id}>{teacher.first_name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={!!formik.errors.teacher && formik.touched.teacher}>{!!formik.errors.teacher && formik.touched.teacher && formik.errors.teacher}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel size='small' id='user-view-language-label'>{t("Xonalar")}</InputLabel>
                            <Select
                                size='small'
                                label={t("Xonalar")}
                                id='user-view-language'
                                labelId='user-view-language-label'
                                name='room'
                                error={!!formik.errors.room && formik.touched.room}
                                value={formik.values.room}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {
                                    rooms?.map(branch => <MenuItem key={branch.id} value={+branch.id}>{branch.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error>{!!formik.errors.room && formik.touched.room && formik.errors.room}</FormHelperText>
                        </FormControl>

                        <FormControl sx={{ width: '100%' }}>
                            <TextField
                                size='small'
                                label={t("Oylik to'lovi")}
                                name='monthly_amount'
                                error={!!formik.errors.monthly_amount && formik.touched.monthly_amount}
                                value={formik.values.monthly_amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <FormHelperText error>{error.monthly_amount?.message}</FormHelperText>
                        </FormControl>

                        <FormControl sx={{ width: '100%' }}>
                            <TextField size='small' type='date' label={t("Boshlanish sanasi")} name='start_date' error={error.start_date} defaultValue={data.start_date} />
                            <FormHelperText error={error.start_date?.error}>{error.start_date?.message}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel size='small' id='user-view-language-label'>{t("Hafta kunlari")}</InputLabel>
                            <Select
                                size='small'
                                label={t("Hafta kunlari")}
                                id='demo-simple-select-outlined'
                                name='day_of_week'
                                labelId='demo-simple-select-outlined-label'
                                onChange={(e) => setWeekDays(e.target.value)}
                                defaultValue={
                                    data.day_of_week.join(',') === 'tuesday,thursday,saturday' ?
                                        'tuesday,thursday,saturday' :
                                        data.day_of_week.join(',') === 'monday,wednesday,friday' ?
                                            'monday,wednesday,friday' :
                                            data.day_of_week.join(',') === 'tuesday,thursday,saturday,monday,wednesday,friday' ?
                                                'tuesday,thursday,saturday,monday,wednesday,friday' : 0
                                }
                            >
                                <MenuItem value={`tuesday,thursday,saturday`}>{t('Juft kunlar')}</MenuItem>
                                <MenuItem value={`monday,wednesday,friday`}>{t('Toq kunlar')}</MenuItem>
                                <MenuItem value={`tuesday,thursday,saturday,monday,wednesday,friday`}>{t("Har kun")}</MenuItem>
                                <MenuItem value={0}>{t("Boshqa")}</MenuItem>
                            </Select>
                            <FormHelperText error={error.room?.error}>{error.room?.message}</FormHelperText>
                        </FormControl>

                        {
                            ((
                                data.day_of_week.join(',') !== 'tuesday,thursday,saturday' &&
                                data.day_of_week.join(',') !== 'monday,wednesday,friday' &&
                                data.day_of_week.join(',') !== 'tuesday,thursday,saturday,monday,wednesday,friday'
                            ) && weekdays === null) || weekdays === 0 ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {
                                        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(el => (
                                            <label
                                                key={el}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row-reverse',
                                                    border: '1px solid #c3cccc',
                                                    padding: '0 5px',
                                                    borderRadius: '7px',
                                                    gap: '4px',
                                                    cursor: 'pointer'
                                                }}>
                                                <span>{t(el)}</span>
                                                <input type='checkbox' onChange={() => (setCustomWeekDays((current: any) => current.includes(el) ? [...current.filter((item: any) => item !== el)] : [...current, el]))} defaultChecked={customWeekdays.includes(el)} />
                                            </label>
                                        ))
                                    }
                                </Box>
                            ) : ''
                        }

                        <FormControl sx={{ width: '100%' }}>
                            <TextField size='small' type='time' label={t("Boshlanish vaqti")} name='start_at' error={error.start_at} defaultValue={data.start_at} />
                            <FormHelperText error={error.start_at?.error}>{error.start_at?.message}</FormHelperText>
                        </FormControl>

                        <FormControl sx={{ width: '100%' }}>
                            <TextField size='small' type='time' label={t("Tugash vaqti")} name='end_at' error={error.end_at} defaultValue={data.end_at} />
                            <FormHelperText error={error.end_at?.error}>{error.end_at?.message}</FormHelperText>
                        </FormControl>


                        <LoadingButton loading={isLoading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
                    </form>}
            </DialogContent>
        </Dialog>
    )
}
