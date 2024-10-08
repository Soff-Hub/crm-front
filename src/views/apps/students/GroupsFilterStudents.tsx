// ** React Imports
import React, { useState, forwardRef } from 'react'

// ** MUI Imports
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'

// ** Third Party Imports
import 'react-datepicker/dist/react-datepicker.css' // Import CSS file for react-datepicker
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'

// ** Types
type DateType = Date

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

type GroupsFilterProps = {
  isMobile: boolean
}

export const GroupsFilterStudents = ({ isMobile }: GroupsFilterProps) => {
  const [startDate, setStartDate] = useState<DateType>(new Date())
  const [endDate, setEndDate] = useState<DateType>(addDays(new Date(), 15))
  const [startDateRange, setStartDateRange] = useState<DateType>(new Date())
  const [endDateRange, setEndDateRange] = useState<DateType>(addDays(new Date(), 45))

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? format(props.end, 'MM/dd/yyyy') : ''

    const value = `${startDate}${endDate !== '' ? '-' + endDate : ''}`

    return <TextField size='small' fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  if (isMobile) {
    return (
      <form id='mobile-filter-form'>
        <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              Kurslar
            </InputLabel>
            <Select
              size='small'
              label='Kurslar'
              defaultValue=''
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
            >
              <MenuItem value=''>
                <b>None</b>
              </MenuItem>
              <MenuItem value={10}>Kopyuter savodxonligi</MenuItem>
              <MenuItem value={20}>Way2job</MenuItem>
              <MenuItem value={30}>Back-end</MenuItem>
              <MenuItem value={30}>Frot-end</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              O'qituvchi
            </InputLabel>
            <Select
              size='small'
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
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              Kurslar
            </InputLabel>
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
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              Teglar
            </InputLabel>
            <Select
              size='small'
              label='Kunlar'
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
            popperPlacement={'top'}
            customInput={
              <CustomInput label="Sana" start={startDate as Date | number} end={endDate as Date | number} />
            }
          />
        </Box>
      </form>
    )
  }

  return (
    <Box display={'flex'} gap={2} flexWrap={'nowrap'}>
      <TextField
        size='small'
        value=''
        sx={{ maxWidth: '270px', width: '100%', mb: 2.5 }}
        placeholder='Ism yoki telefon orqali qidirish'
      />
      <FormControl sx={{ maxWidth: 130, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          Kurslar
        </InputLabel>
        <Select
          size='small'
          label='Kurslar'
          defaultValue=''
          id='demo-simple-select-outlined'
          labelId='demo-simple-select-outlined-label'
        >
          <MenuItem value=''>
            <b>None</b>
          </MenuItem>
          <MenuItem value={10}>Kopyuter savodxonligi</MenuItem>
          <MenuItem value={20}>Way2Job</MenuItem>
          <MenuItem value={30}>Back-end</MenuItem>
          <MenuItem value={30}>Front-end</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ maxWidth: 160, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          Talaba holati
        </InputLabel>
        <Select
          size='small'
          label='Talaba holati'
          defaultValue=''
          id='demo-simple-select-outlined'
          labelId='demo-simple-select-outlined-label'
        >
          <MenuItem value=''>
            <b>None</b>
          </MenuItem>
          <MenuItem value={10}>Bu oy qo'shildi</MenuItem>
          <MenuItem value={20}>Talabalar imzolangan taklif bilan</MenuItem>
          <MenuItem value={30}>Sinov darsida</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ maxWidth: 180, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          Moliyaviy holati
        </InputLabel>
        <Select
          size='small'
          label='Moliyaviy holati'
          defaultValue=''
          id='demo-simple-select-outlined'
          labelId='demo-simple-select-outlined-label'
        >
          <MenuItem value=''>
            <b>None</b>
          </MenuItem>
          <MenuItem value={10}>Qarzi bor</MenuItem>
          <MenuItem value={20}>Chegirmalar mavjud</MenuItem>
          <MenuItem value={30}>Qarzi yo'q</MenuItem>
          <MenuItem value={30}>Ijobiy balansi</MenuItem>
          <MenuItem value={30}>Joriy oyda to'langan</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ maxWidth: 180, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          Teglar
        </InputLabel>
        <Select
          size='small'
          label="Teglar"
          defaultValue=''
          id='demo-simple-select-outlined'
          labelId='demo-simple-select-outlined-label'
        >
          <MenuItem value=''>
            <b>None</b>
          </MenuItem>
          <MenuItem value={10}>Yo'q1</MenuItem>
          <MenuItem value={10}>Yo'q2</MenuItem>
          <MenuItem value={10}>Yo'q3</MenuItem>
        </Select>
      </FormControl>
      <TextField
        size='small'
        value=''
        sx={{ maxWidth: '150px', width: '100%', mb: 2.5 }}
        placeholder="Qo'shimcha ID"
      />
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
            label="Sana"
            end={endDateRange as Date | number}
            start={startDateRange as Date | number}
          />
        }
      />
    </Box>
  )
}
