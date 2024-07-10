import React, { useEffect, useState } from 'react';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useResponsive from 'src/@core/hooks/useResponsive';
import IconifyIcon from 'src/@core/components/icon';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchStudentsList, updateStudentParams } from 'src/store/apps/students';
import useCourses from 'src/hooks/useCourses';
import useDebounce from 'src/hooks/useDebounce';

const StudentsFilter = () => {
    const [search, setSearch] = useState<string>('')
    const dispatch = useAppDispatch()
    const { queryParams } = useAppSelector(state => state.students)
    const { getCourses, courses } = useCourses()

    const { t } = useTranslation()
    const { isMobile } = useResponsive()
    const searchVal = useDebounce(search, 800)


    async function handleFilter(key: string, value: string | number | null) {
        await dispatch(fetchStudentsList({ ...queryParams, [key]: value }))
        dispatch(updateStudentParams({ [key]: value }))
    }

    useEffect(() => {
        getCourses()
    }, [])

    useEffect(() => {
        dispatch(fetchStudentsList({ ...queryParams, search: searchVal }))
    }, [searchVal])

    return (
        <Box sx={{ display: 'flex', gap: '20px', flexDirection: isMobile ? 'column' : 'row' }}>
            <FormControl variant="outlined" size='small' fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">{t('Qidirish')}</InputLabel>
                <OutlinedInput
                    fullWidth
                    id="outlined-adornment-password"
                    type={'text'}
                    onChange={(e: any) => setSearch(e.target.value)}
                    value={search}
                    autoComplete='off'
                    endAdornment={
                        <InputAdornment position="end">
                            <IconifyIcon icon={'tabler:search'} />
                        </InputAdornment>
                    }
                    label={t('Qidirish')}
                />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Kurslar')}</InputLabel>
                <Select
                    size='small'
                    label={t('Kurslar')}
                    defaultValue={''}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    onChange={(e: any) => {
                        if (e.target.value === '') {
                            handleFilter('course', null)
                        } else {
                            handleFilter('course', e.target.value)
                        }
                    }}
                >
                    <MenuItem value={''}>
                        <b>{t('Barchasi')}</b>
                    </MenuItem>
                    {
                        courses.map(course => (
                            <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <Box sx={{ width: '100%' }}>
                <FormControl fullWidth>
                    <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Holat')}</InputLabel>
                    <Select
                        size='small'
                        label={t('Holat')}
                        value={queryParams.status}
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        onChange={(e: any) =>
                            handleFilter('status', e.target.value)
                        }
                    >
                        <MenuItem value=''>
                            <b>{t('Barchasi')}</b>
                        </MenuItem>
                        <MenuItem value={'active'}>{t('aktiv')}</MenuItem>
                        <MenuItem value={'archive'}>{t('arxiv')}</MenuItem>
                        <MenuItem value={'new'}>{t('sinov')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>


            <Box sx={{ width: '100%' }}>
                <FormControl fullWidth>
                    <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("To'lov holati")}</InputLabel>
                    <Select
                        size='small'
                        label={t("To'lov holati")}
                        value={queryParams.status}
                        id='demo-simple-select-outlined'
                        labelId='demo-simple-select-outlined-label'
                        onChange={(e: any) =>
                            handleFilter('status', e.target.value)
                        }
                    >
                        <MenuItem value=''>
                            <b>{t('Barchasi')}</b>
                        </MenuItem>
                        <MenuItem value={'active'}>{t('aktiv')}</MenuItem>
                        <MenuItem value={'archive'}>{t('arxiv')}</MenuItem>
                        <MenuItem value={'new'}>{t('sinov')}</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box >
    );
}

export default StudentsFilter;
