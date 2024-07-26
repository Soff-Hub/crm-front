//@ts-nocheck

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
import { fetchGroups, handleOpenEdit, setGroupData, resetFormParams, getDashboardLessons, updateGroup, updateFormParams, updateParams } from 'src/store/apps/groups';
import { useAppDispatch, useAppSelector } from 'src/store';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import SubLoader from '../loaders/SubLoader';
import EmptyContent from 'src/@core/components/empty-content';
import Calendar from './Calendar';
import { disablePage } from 'src/store/apps/page';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getAttendance, getDays, getGroupById, setGettingAttendance, setGettingGroupDetails } from 'src/store/apps/groupDetails';
import { getMontNumber } from 'src/@core/utils/gwt-month-name';

export default function EditGroupModal() {
    const { isOpenEdit, groupData, courses, initialValues, formParams, queryParams, teachers, rooms, isGettingGroupDetails } = useAppSelector(state => state.groups)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [customWeekdays, setCustomWeekDays] = useState<string[]>([])
    const { query } = useRouter()

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
            dispatch(disablePage(true))
            let obj = { ...values }
            if (!formik.values.day_of_week || formik.values.day_of_week == "0") {
                obj = { ...obj, day_of_week: customWeekdays }
            } else {
                obj = { ...obj, day_of_week: formik.values.day_of_week?.split(',') }
            }
            if (queryParams?.is_recovery) {
                Object.assign(obj, { status: 'active' })
            }
            const response = await dispatch(updateGroup({
                id: groupData?.id,
                values: obj
            }))

            if (response.meta.requestStatus === 'rejected') {
                formik.setErrors(response.payload)
            } else {
                dispatch(updateParams({ is_recovery: false }))
                toast.success("O'zgrishlar muvafaqqiyati saqlandi")
                const queryString = new URLSearchParams(queryParams).toString()
                if (query?.id) {
                    dispatch(setGettingAttendance(true))
                    dispatch(setGettingGroupDetails(true))
                    await Promise.all([
                        dispatch(getDays({ date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`, group: query.id })),
                        dispatch(getGroupById(query.id)),
                        dispatch(getAttendance({ date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`, group: query.id, queryString: queryString }))
                    ])
                    dispatch(setGettingAttendance(false))
                    dispatch(setGettingGroupDetails(false))
                } else {
                    await dispatch(fetchGroups(queryString))
                }
                formik.resetForm()
            }
            setLoading(false)
            dispatch(disablePage(false))
        }
    });


    const handleChangeField = async (name: string, event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
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
        formik.resetForm()
        dispatch(handleOpenEdit(false))
        dispatch(setGroupData(null))
        dispatch(resetFormParams())
        setCustomWeekDays([])
    }

    useEffect(() => {
        if (groupData) {
            for (const [key, value] of Object.entries(groupData)) {
                console.log(key, value);
                if (key === "course_data") {
                    formik.setFieldValue("course", value?.id);
                }
                if (key == "teacher_data") {
                    formik.setFieldValue("teacher", value?.id);
                    dispatch(updateFormParams({ teacher: value?.id }))
                }
                if (key == "room_data") {
                    formik.setFieldValue("room", value?.id);
                    dispatch(updateFormParams({ room: value?.id }))
                }
                if (key === "day_of_week") {
                    const dayMapping = {
                        'tuesday,thursday,saturday': 'tuesday,thursday,saturday',
                        'monday,wednesday,friday': 'monday,wednesday,friday',
                        'tuesday,thursday,saturday,monday,wednesday,friday': 'tuesday,thursday,saturday,monday,wednesday,friday'
                    };
                    const joinedValue = value.join(',');
                    if (dayMapping[joinedValue]) {
                        formik.setFieldValue(key, dayMapping[joinedValue]);
                        dispatch(updateFormParams({ day_of_week: dayMapping[joinedValue] }))
                    } else {
                        formik.setFieldValue(key, 0);
                        setCustomWeekDays(value)
                        dispatch(updateFormParams({ day_of_week: value.toString() }))
                    }
                }

                else formik.setFieldValue(key, value);
            }
        }
    }, [groupData]);


    useEffect(() => {
        return () => {
            dispatch(handleOpenEdit(false))
            dispatch(updateParams({ is_recovery: false }))
        }
    }, [])

    return (
        <Drawer open={isOpenEdit} hideBackdrop anchor='right' variant='temporary' sx={{ width: "100%" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", width: "100vw" }}>
                <Calendar />
                <Box sx={{
                    gridColumn: "4/5",
                    display: "flex",
                    flexDirection: "column",
                    overflow: 'unset'
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
                            {t("Guruh ma'lumotlarini tahrirlash")}
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
                        {isGettingGroupDetails ? <SubLoader /> :
                            groupData ? <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
                                <FormControl sx={{ width: '100%' }}>
                                    <TextField
                                        name='name'
                                        size='small'
                                        label={t("Guruh nomi")}
                                        error={!!formik.errors.name && formik.touched.name}
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <FormHelperText error={!!formik.errors.name && formik.touched.name}>{formik.errors.name}</FormHelperText>
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
                                        error={!!formik.errors.course && formik.touched.course}
                                    >
                                        {
                                            courses?.map(course => <MenuItem key={course.id} value={+course.id}>{course.name}</MenuItem>)
                                        }
                                    </Select>
                                    <FormHelperText error={!!formik.errors.course && formik.touched.course}>{!!formik.errors.course && formik.touched.course && formik.errors.course}</FormHelperText>
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
                                        error={!!formik.errors.day_of_week && formik.touched.day_of_week}
                                        value={formik.values.day_of_week}
                                    >
                                        <MenuItem value={`tuesday,thursday,saturday`}>Juft kunlari</MenuItem>
                                        <MenuItem value={`monday,wednesday,friday`}>Toq kunlari</MenuItem>
                                        <MenuItem value={`tuesday,thursday,saturday,monday,wednesday,friday`}>Har kuni</MenuItem>
                                        <MenuItem value={0}>Boshqa</MenuItem>
                                    </Select>
                                    <FormHelperText error={!!formik.errors.day_of_week && formik.touched.day_of_week}>{!!formik.errors.day_of_week && formik.touched.day_of_week && formik.errors.day_of_week}</FormHelperText>
                                </FormControl>
                                {
                                    ((
                                        groupData?.day_of_week.join(',') !== 'tuesday,thursday,saturday' &&
                                        groupData?.day_of_week.join(',') !== 'monday,wednesday,friday' &&
                                        groupData?.day_of_week.join(',') !== 'tuesday,thursday,saturday,monday,wednesday,friday'
                                    ) && formik.values.day_of_week == null) || formik.values.day_of_week == "0" ? (
                                        <Box sx={{ display: 'flex', width: "100%", flexWrap: 'wrap', gap: '8px' }}>
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
                                                        <input
                                                            type='checkbox'
                                                            value={el}
                                                            onChange={handleCustomWeek}
                                                            checked={customWeekdays.includes(el)}
                                                        />
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
                                        error={!!formik.errors.room && formik.touched.room}
                                    >
                                        {
                                            rooms?.map(branch => <MenuItem key={branch.id} value={+branch.id}>{branch.name}</MenuItem>)
                                        }
                                    </Select>
                                    <FormHelperText error={!!formik.errors.room && formik.touched.room}>{!!formik.errors.room && formik.touched.room && formik.errors.room}</FormHelperText>
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
                                        error={!!formik.errors.teacher && formik.touched.teacher}
                                    >
                                        {
                                            teachers?.map(teacher => <MenuItem key={teacher.id} value={+teacher.id}>{teacher.first_name}</MenuItem>)
                                        }
                                    </Select>
                                    <FormHelperText error={!!formik.errors.teacher && formik.touched.teacher}>{!!formik.errors.teacher && formik.touched.teacher && formik.errors.teacher}</FormHelperText>
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
                                        error={!!formik.errors.start_date && formik.touched.start_date}
                                    />
                                    <FormHelperText error={!!formik.errors.start_date && formik.touched.start_date}>{!!formik.errors.start_date && formik.touched.start_date && formik.errors.start_date}</FormHelperText>
                                </FormControl>

                                <FormControl sx={{ width: '100%' }}>
                                    <TextField
                                        size='small'
                                        type='time'
                                        label={t("Boshlanish vaqti")}
                                        name='start_at'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={!!formik.errors.start_at && formik.touched.start_at}
                                        value={formik.values.start_at}
                                    />
                                    <FormHelperText error={!!formik.errors.start_at && formik.touched.start_at}>{!!formik.errors.start_at && formik.touched.start_at && formik.errors.start_at}</FormHelperText>
                                </FormControl>

                                <FormControl sx={{ width: '100%' }}>
                                    <TextField
                                        size='small'
                                        type='time'
                                        label={t("Tugash vaqti")}
                                        name='end_at'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={!!formik.errors.end_at && formik.touched.end_at}
                                        value={formik.values.end_at}
                                    />
                                    <FormHelperText error={!!formik.errors.end_at && formik.touched.end_at}>{!!formik.errors.end_at && formik.touched.end_at && formik.errors.end_at}</FormHelperText>
                                </FormControl>

                                <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
                            </form>
                                : <EmptyContent />}
                    </Box>
                </Box>
            </Box>
        </Drawer>
    )
}
