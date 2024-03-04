// ** React Imports
import React, { useState, forwardRef } from 'react'

// ** MUI Imports
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'


// ** Third Party Imports
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS file for react-datepicker
import DatePicker from 'react-datepicker';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';

// ** Types
type DateType = Date

interface PickerProps {
    label?: string;
    end: Date | number;
    start: Date | number;
}

type GroupsFilterProps = {
    isMobile: boolean
}


export const GroupsFilterrCourses = ({ isMobile }: GroupsFilterProps) => {
    const [startDate, setStartDate] = useState<DateType>(new Date());
    const [endDate, setEndDate] = useState<DateType>(addDays(new Date(), 15));
    const [startDateRange, setStartDateRange] = useState<DateType>(new Date());
    const [endDateRange, setEndDateRange] = useState<DateType>(addDays(new Date(), 45));

    const handleOnChangeRange = (dates: any) => {
        const [start, end] = dates;
        setStartDateRange(start);
        setEndDateRange(end);
    };

    const CustomInput = forwardRef((props: PickerProps, ref) => {
        const startDate = format(props.start, 'MM/dd/yyyy');
        const endDate = props.end !== null ? format(props.end, 'MM/dd/yyyy') : '';

        const value = `${startDate}${endDate !== '' ? '-' + endDate : ''}`;

        return <TextField size='small' fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />;
    });

    const handleOnChange = (dates: any) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    if (isMobile) {
        return (
            <form id='mobile-filter-form'>
                <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>Kurslar</InputLabel>
                        <Select
                            size='small'
                            label="Kurslar"
                            defaultValue=''
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                        >
                            <MenuItem value=''>
                                <b>None</b>
                            </MenuItem>
                            <MenuItem value={10}>Faol Guruhlar</MenuItem>
                            <MenuItem value={20}>Arxiv Guruhlar</MenuItem>
                            <MenuItem value={30}>Yakunlangan Guruhlar</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>O'qituvchi</InputLabel>
                        <Select
                            size='small'
                            label="O'qituvchi"
                            defaultValue=''
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                        >
                            <MenuItem value=''>
                                <b>None</b>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>Kurslar bo'yicha</InputLabel>
                        <Select
                            size='small'
                            label="Bo'lim"
                            defaultValue=''
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                        >
                            <MenuItem value=''>
                                <b>None</b>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>Kunlar bo'yicha</InputLabel>
                        <Select
                            size='small'
                            label="Kunlar boyicha"
                            defaultValue=''
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                        >
                            <MenuItem value=''>
                                <b>None</b>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <DatePicker
                        selectsRange
                        endDate={endDate}
                        selected={startDate}
                        startDate={startDate}
                        id='date-range-picker'
                        onChange={handleOnChange}
                        shouldCloseOnSelect={false}
                        popperPlacement={"top"}
                        customInput={
                            <CustomInput label="Sana bo'yicha" start={startDate as Date | number} end={endDate as Date | number} />
                        }
                    />
                </Box >
            </form>
        )
    }



    return (
        <Box display={'flex'} gap={2} flexWrap={'nowrap'} >
            <FormControl sx={{ maxWidth: 220, width: '100%' }}>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>Kurslar</InputLabel>
                <Select
                    size='small'
                    label="Kurslar"
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                >
                    <MenuItem value=''>
                        <b>None</b>
                    </MenuItem>
                    <MenuItem value={10}>Faol Guruhlar</MenuItem>
                    <MenuItem value={20}>Arxiv Guruhlar</MenuItem>
                    <MenuItem value={30}>Yakunlangan Guruhlar</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>O'qituvchi</InputLabel>
                <Select
                    size='small'
                    label="O'qituvchi"
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                >
                    <MenuItem value=''>
                        <b>None</b>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>Kurslar bo'yicha</InputLabel>
                <Select
                    size='small'
                    label="Kurslar bo'yicha"
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                >
                    <MenuItem value=''>
                        <b>None</b>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>Kunlar bo'yicha</InputLabel>
                <Select
                    size='small'
                    label="Kunlar boyicha"
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                >
                    <MenuItem value=''>
                        <b>None</b>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
            <DatePicker
                selectsRange
                monthsShown={2}
                endDate={endDateRange}
                selected={startDateRange}
                startDate={startDateRange}
                shouldCloseOnSelect={false}
                id='date-range-picker-months'
                onChange={handleOnChangeRange}
                popperPlacement={'bottom-start'}
                customInput={
                    <CustomInput
                        label="Sana bo'yicha"
                        end={endDateRange as Date | number}
                        start={startDateRange as Date | number}
                    />
                }
            />
        </Box>
    )
}
