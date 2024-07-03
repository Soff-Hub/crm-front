// ** React Imports
import React, { useState, forwardRef } from 'react'

// ** MUI Imports
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'

// ** Third Party Imports
import 'react-datepicker/dist/react-datepicker.css' // Import CSS file for react-datepicker
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { useTranslation } from 'react-i18next'

// ** Types
type DateType = Date

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

type LidsFilterProps = {
  isMobile: boolean
}

export const LidsFilter = ({ isMobile }: LidsFilterProps) => {
  const [startDate, setStartDate] = useState<DateType>(new Date())
  const [endDate, setEndDate] = useState<DateType>(addDays(new Date(), 15))
  const [startDateRange, setStartDateRange] = useState<DateType>(new Date())
  const [endDateRange, setEndDateRange] = useState<DateType>(addDays(new Date(), 45))
  const { t } = useTranslation()

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
          <TextField
            sx={{ width: '100%' }}
            id='outlined-basic'
            label={t('Ism yoki telefon raqam orqali qidirish')}
            size='small'
          />
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t("Bo'lim")}
            </InputLabel>
            <Select
              size='small'
              label={t("Bo'lim")}
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
              {t("Kurslar")}
            </InputLabel>
            <Select
              size='small'
              label={t("Kurslar")}
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
              {t('Manbalar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Manbalar')}
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
              {t('Xodimlar tomonidan')}
            </InputLabel>
            <Select
              size='small'
              label={t('Xodimlar tomonidan')}
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
          {isMobile ? (
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
                <CustomInput
                  label={t("Sana")}
                  start={startDate as Date | number}
                  end={endDate as Date | number}
                />
              }
            />
          ) : (
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
          )}
        </Box>
      </form>
    )
  }

  return (
    <Box display={'flex'} gap={2} flexWrap={'nowrap'}>
      <TextField
        sx={{ maxWidth: 190, width: '100%' }}
        id='outlined-basic'
        label='Ism yoki telefon raqam orqali qidirish'
        size='small'
      />
      <FormControl sx={{ maxWidth: 170, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          {t("Bo'lim")}
        </InputLabel>
        <Select
          size='small'
          label={t("Bo'lim")}
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
      <FormControl sx={{ maxWidth: 170, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          {t("Kurslar")}
        </InputLabel>
        <Select
          size='small'
          label={t("Kurslar")}
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
      <FormControl sx={{ maxWidth: 170, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          {t('Manbalar')}
        </InputLabel>
        <Select
          size='small'
          label={t('Manbalar')}
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
      <FormControl sx={{ maxWidth: 200, width: '100%' }}>
        <InputLabel size='small' id='demo-simple-select-outlined-label'>
          {t('Xodimlar tomonidan')}
        </InputLabel>
        <Select
          size='small'
          label={t('Xodimlar tomonidan')}
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
            label={t("Sana")}
            end={endDateRange as Date | number}
            start={startDateRange as Date | number}
          />
        }
      />
    </Box>
  )
}
