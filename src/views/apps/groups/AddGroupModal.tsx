// @ts-nocheck

import {
    Box, Drawer, FormHelperText,
    IconButton,
    InputLabel, TextField,
    Typography
} from '@mui/material';
import IconifyIcon from 'src/@core/components/icon';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import { createGroup, fetchGroups, getDashboardLessons, handleOpenAddModal, resetFormParams, updateFormParams } from 'src/store/apps/groups';
import { useAppDispatch, useAppSelector } from 'src/store';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Calendar from './Calendar';

export default function AddGroupModal() {
    const { isOpenAddGroup, courses, teachers, formParams, queryParams, rooms, initialValues } = useAppSelector(state => state.groups)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [customWeekdays, setCustomWeekDays] = useState<string[]>([])

    const validationSchema = Yup.object({
        name: Yup.string().required("Guruh nomini kiriting"),
        course: Yup.string().required("Kursni tanlang"),
        teacher: Yup.string().required("O'qituvchini tanlang"),
        room: Yup.string().required("Xonani tanlang"),
        start_date: Yup.string().required("Boshlanish sanasini tanlang"),
        start_at: Yup.string().required("Boshlanish vaqtini tanlang"),
        day_of_week: Yup.string().required("Dars kunlarini tanlang"),
        end_at: Yup.string().required("Tugash vaqtini tanlang"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            let obj = { ...values }
            if (!formik.values.day_of_week || formik.values.day_of_week == "0") {
                obj = { ...obj, day_of_week: customWeekdays }
            } else {
                obj = { ...obj, day_of_week: formik.values.day_of_week.split(',') }
            }
            const queryString = new URLSearchParams(queryParams).toString()

            const resp = await dispatch(createGroup(obj))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                handleClose()
                await dispatch(fetchGroups(queryString))
            }
            setLoading(false)
        }
    });

    const handleChangeField = async (name: string, event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(name, event.target.value)
        if (name == "teacher") {
            dispatch(updateFormParams({ teacher: event.target.value }))
            const queryString = new URLSearchParams({ ...formParams, teacher: event.target.value }).toString()
            await dispatch(getDashboardLessons(queryString))
        } else if (name == "room") {
            dispatch(updateFormParams({ room: event.target.value }))
            const queryString = new URLSearchParams({ ...formParams, room: event.target.value }).toString()
            await dispatch(getDashboardLessons(queryString))
        } else if (name == "day_of_week") {
            if (event.target.value != "0") {
                setCustomWeekDays([])
                dispatch(updateFormParams({ day_of_week: event.target.value }))
                const queryString = new URLSearchParams({ ...formParams, day_of_week: event.target.value }).toString()
                await dispatch(getDashboardLessons(queryString))
            }
        }
    }

    const handleCustomWeek = async (el: ChangeEvent<HTMLInputElement>) => {
        const filtered = customWeekdays.includes(el.target.value) ? [...customWeekdays.filter(item => item !== el.target.value)] : [...customWeekdays, el.target.value]
        setCustomWeekDays(filtered)

        dispatch(updateFormParams({ day_of_week: filtered.toString() }))
        const queryString = new URLSearchParams({ ...formParams, day_of_week: filtered.toString() }).toString()
        await dispatch(getDashboardLessons(queryString))
    }

    const handleClose = () => {
        dispatch(handleOpenAddModal(false))
        formik.resetForm()
        dispatch(resetFormParams())
        setCustomWeekDays([])
    }

    return (
        <Drawer open={isOpenAddGroup} hideBackdrop anchor='right' variant='temporary' sx={{ width: "100%" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", width: "100vw" }}>
                <Calendar />
                <Box sx={{
                    gridColumn: "4/5",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <Box
                        className='customizer-header'
                        sx={{
                            position: 'relative',
                            p: theme => theme.spacing(3.5, 5),
                            borderBottom: theme => `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
                            {t("Guruh qo'shish")}
                        </Typography>
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                right: 20,
                                top: '50%',
                                position: 'absolute',
                                color: 'text.secondary',
                                transform: 'translateY(-50%)'
                            }}
                        >
                            <IconifyIcon icon='mdi:close' fontSize={20} />
                        </IconButton>
                    </Box>
                    <Box width={'100%'}>
                        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
                            <FormControl sx={{ width: '100%' }}>
                                <TextField
                                    name='name'
                                    size='small'
                                    label={t("Guruh nomi")}
                                    error={!!formik.errors.name && !!formik.touched.name}
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <FormHelperText error={!!formik.errors.name && !!formik.touched.name}>{!!formik.errors.name && !!formik.touched.name && formik.errors.name}</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel size='small' id='user-view-language-label'>{t("Kurslar")}</InputLabel>
                                <Select
                                    size='small'
                                    name='course'
                                    label={t('Kurslar')}
                                    id='user-view-language'
                                    labelId='user-view-language-label'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.course || ""}
                                    error={!!formik.errors.course && !!formik.touched.course}
                                >
                                    {
                                        courses?.map(course => <MenuItem key={course.id} value={+course.id}>{course.name}</MenuItem>)
                                    }
                                </Select>
                                <FormHelperText error={!!formik.errors.course && !!formik.touched.course}>{!!formik.errors.course && !!formik.touched.course && formik.errors.course}</FormHelperText>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel size='small' id='user-view-language-label'>{t("Hafta kunlari")}</InputLabel>
                                <Select
                                    size='small'
                                    label="Hafta kunlari"
                                    id='demo-simple-select-outlined'
                                    name='day_of_week'
                                    labelId='demo-simple-select-outlined-label'
                                    onChange={(e) => handleChangeField("day_of_week", e)}
                                    onBlur={formik.handleBlur}
                                    error={!!formik.errors.day_of_week && !!formik.touched.day_of_week}
                                    value={formik.values.day_of_week}
                                >
                                    <MenuItem value={`tuesday,thursday,saturday`}>Juft kunlari</MenuItem>
                                    <MenuItem value={`monday,wednesday,friday`}>Toq kunlari</MenuItem>
                                    <MenuItem value={`tuesday,thursday,saturday,monday,wednesday,friday`}>Har kuni</MenuItem>
                                    <MenuItem value={0}>Boshqa</MenuItem>
                                </Select>
                                <FormHelperText error={!!formik.errors.day_of_week && !!formik.touched.day_of_week}>{!!formik.errors.day_of_week && !!formik.touched.day_of_week && formik.errors.day_of_week}</FormHelperText>
                            </FormControl>
                            {
                                formik.values.day_of_week == "0" ?
                                    (
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
                                                        <input type='checkbox' value={el} onChange={handleCustomWeek} />
                                                    </label>
                                                ))
                                            }
                                        </Box>
                                    ) : ''
                            }
                            <FormControl fullWidth>
                                <InputLabel size='small' id='user-view-language-label'>{t("Xonalar")}</InputLabel>
                                <Select
                                    size='small'
                                    label={t('Xonalar')}
                                    id='user-view-language'
                                    labelId='user-view-language-label'
                                    name='room'
                                    disabled={!!!formik.values.day_of_week && customWeekdays.length == 0}
                                    onChange={(e) => handleChangeField("room", e)}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.room}
                                    error={!!formik.errors.room && !!formik.touched.room}
                                >
                                    {
                                        rooms?.map(branch => <MenuItem key={branch.id} value={+branch.id}>{branch.name}</MenuItem>)
                                    }
                                </Select>
                                <FormHelperText error={!!formik.errors.room && !!formik.touched.room}>{!!formik.errors.room && !!formik.touched.room && formik.errors.room}</FormHelperText>
                            </FormControl>


                            <FormControl fullWidth>
                                <InputLabel size='small' id='user-view-language-label'>{t("O'qituvchi")}</InputLabel>
                                <Select
                                    size='small'
                                    label={t("O'qituvchi")}
                                    id='user-view-language'
                                    labelId='user-view-language-label'
                                    name='teacher'
                                    disabled={!!!formik.values.room}
                                    onChange={(e) => handleChangeField("teacher", e)}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.teacher}
                                    error={!!formik.errors.teacher && !!formik.touched.teacher}
                                >
                                    {
                                        teachers?.map(teacher => <MenuItem key={teacher.id} value={+teacher.id}>{teacher.first_name}</MenuItem>)
                                    }
                                </Select>
                                <FormHelperText error={!!formik.errors.teacher && !!formik.touched.teacher}>{!!formik.errors.teacher && !!formik.touched.teacher && formik.errors.teacher}</FormHelperText>
                            </FormControl>

                            <FormControl sx={{ width: '100%' }}>
                                <TextField
                                    size='small'
                                    type='date'
                                    label={t("Boshlanish sanasi")}
                                    name='start_date'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.start_date}
                                    error={!!formik.errors.start_date && !!formik.touched.start_date}
                                />
                                <FormHelperText error={!!formik.errors.start_date && !!formik.touched.start_date}>{!!formik.errors.start_date && !!formik.touched.start_date && formik.errors.start_date}</FormHelperText>
                            </FormControl>

                            <FormControl sx={{ width: '100%' }}>
                                <TextField
                                    size='small'
                                    type='time'
                                    label={t("Boshlanish vaqti")}
                                    name='start_at'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!formik.errors.start_at && !!formik.touched.start_at}
                                    value={formik.values.start_at}
                                />
                                <FormHelperText error={!!formik.errors.start_at && !!formik.touched.start_at}>{!!formik.errors.start_at && !!formik.touched.start_at && formik.errors.start_at}</FormHelperText>
                            </FormControl>

                            <FormControl sx={{ width: '100%' }}>
                                <TextField
                                    size='small'
                                    type='time'
                                    label={t("Tugash vaqti")}
                                    name='end_at'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={!!formik.errors.end_at && !!formik.touched.end_at}
                                    value={formik.values.end_at}
                                />
                                <FormHelperText error={!!formik.errors.end_at && !!formik.touched.end_at}>{!!formik.errors.end_at && !!formik.touched.end_at && formik.errors.end_at}</FormHelperText>
                            </FormControl>

                            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    )
}
