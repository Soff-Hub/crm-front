// @ts-nocheck

// ** MUI Imports
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';


// ** Third Party Imports
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS file for react-datepicker
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchGroups, updateParams } from 'src/store/apps/groups';

type GroupsFilterProps = {
    isMobile: boolean
}


export const GroupsFilter = ({ isMobile }: GroupsFilterProps) => {
    const { teachers, queryParams, courses } = useAppSelector(state => state.groups)
    const dispatch = useAppDispatch()

    const { t } = useTranslation()

    const handleChangeStatus = (e: SelectChangeEvent<string>) => {
        dispatch(updateParams({ status: e.target.value }));
        const queryString = new URLSearchParams({ ...queryParams, status: e.target.value }).toString()
        dispatch(fetchGroups(queryString))
    }
    const handleChangeTeacher = (e: SelectChangeEvent<string>) => {
        dispatch(updateParams({ teacher: e.target.value }));
        const queryString = new URLSearchParams({ ...queryParams, teacher: e.target.value }).toString()
        dispatch(fetchGroups(queryString))
    }
    const handleChangeCourse = (e: SelectChangeEvent<string>) => {
        dispatch(updateParams({ course: e.target.value }));
        const queryString = new URLSearchParams({ ...queryParams, course: e.target.value }).toString()
        dispatch(fetchGroups(queryString))
    }
    const handleChangeDateOfWeek = (e: SelectChangeEvent<string>) => {
        dispatch(updateParams({ day_of_week: e.target.value }));
        const queryString = new URLSearchParams({ ...queryParams, day_of_week: e.target.value }).toString()
        dispatch(fetchGroups(queryString))
    }

    if (isMobile) {
        return (
            <form id='mobile-filter-form'>
                <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Holat")}</InputLabel>
                        <Select
                            size='small'
                            label={t("Holat")}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            value={queryParams.status || ""}
                            onChange={handleChangeStatus}
                        >
                            <MenuItem value=''>
                                <b>Barchasi</b>
                            </MenuItem>
                            <MenuItem value={'active'}>{'Aktiv'}</MenuItem>
                            <MenuItem value={'archive'}>{'arxiv'}</MenuItem>
                            <MenuItem value={'new'}>{'Sinov darsida'}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("O'qituvchi")}</InputLabel>
                        <Select
                            size='small'
                            label={t("O'qituvchi")}
                            defaultValue=''
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            value={queryParams.teacher || ""}
                            onChange={handleChangeTeacher}
                        >
                            <MenuItem value=''>
                                <b>Barchasi</b>
                            </MenuItem>
                            {
                                teachers?.map(teacher => (
                                    <MenuItem key={teacher.id} value={teacher.id}>{teacher.first_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Kurslar bo'yicha")}</InputLabel>
                        <Select
                            size='small'
                            label={t("Kurslar bo'yicha")}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            value={queryParams.course || ""}
                            onChange={handleChangeCourse}
                        >
                            <MenuItem value=''>
                                <b>Barchasi</b>
                            </MenuItem>
                            {
                                courses?.map(course => (
                                    <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Kunlar bo'yicha")}</InputLabel>
                        <Select
                            size='small'
                            label={t("Kunlar boyicha")}
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            value={queryParams.day_of_week || ""}
                            onChange={handleChangeDateOfWeek}
                        >
                            <MenuItem value=''>
                                <b>Barchasi</b>
                            </MenuItem>
                            <MenuItem value={'tuesday,thursday,saturday'}>Juft kunlari</MenuItem>
                            <MenuItem value={'monday,wednesday,friday'}>Toq kunlari</MenuItem>
                            <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>Har kuni</MenuItem>
                        </Select>
                    </FormControl>
                </Box >
            </form>
        )
    } else
        return (
            <Box display={'flex'} gap={2} flexWrap={'nowrap'} >
                <FormControl sx={{ maxWidth: 220, width: '100%' }}>
                    <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Holat")}</InputLabel>
                    <Select
                        size='small'
                        label={t("Holat")}
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        value={queryParams.status || ""}
                        onChange={handleChangeStatus}
                    >
                        <MenuItem value=''>
                            <b>Barchasi</b>
                        </MenuItem>
                        <MenuItem value={'active'}>{'Aktiv'}</MenuItem>
                        <MenuItem value={'archived'}>{'Arxivlangan'}</MenuItem>
                        <MenuItem value={'new'}>{'Yangi'}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                    <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("O'qituvchi")}</InputLabel>
                    <Select
                        size='small'
                        label={t("O'qituvchi")}
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        value={queryParams.teacher || ""}
                        onChange={handleChangeTeacher}
                    >
                        <MenuItem value=''>
                            <b>Barchasi</b>
                        </MenuItem>
                        {
                            teachers?.map(teacher => (
                                <MenuItem key={teacher.id} value={teacher.id}>{teacher.first_name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                    <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Kurslar bo'yicha")}</InputLabel>
                    <Select
                        size='small'
                        label={t("Kurslar bo'yicha")}
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        value={queryParams.course || ""}
                        onChange={handleChangeCourse}
                    >
                        <MenuItem value=''>
                            <b>Barchasi</b>
                        </MenuItem>
                        {
                            courses?.map(course => (
                                <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                    <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Kunlar bo'yicha")}</InputLabel>
                    <Select
                        size='small'
                        label={t("Kunlar boyicha")}
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        value={queryParams.day_of_week || ""}
                        onChange={handleChangeDateOfWeek}
                    >
                        <MenuItem value=''>
                            <b>Barchasi</b>
                        </MenuItem>
                        <MenuItem value={'tuesday,thursday,saturday'}>Juft kunlari</MenuItem>
                        <MenuItem value={'monday,wednesday,friday'}>Toq kunlari</MenuItem>
                        <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>Har kuni</MenuItem>
                    </Select>
                </FormControl>
            </Box >
        )
}
