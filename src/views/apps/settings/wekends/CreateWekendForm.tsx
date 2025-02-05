import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, TextField, Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'src/store'
import { createWekend, fetchWekends, setOpenCreateSms } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function CreateWekendForm() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedDates, setSelectedDates] = useState<Dayjs[]>([])

    const setOpenAddGroup = () => {
        dispatch(setOpenCreateSms(null))
    }

    const validationSchema = Yup.object({
        dates: Yup.array().min(1, "Kamida bitta sana tanlang").required("Sanalarni tanlang"),
        description: Yup.string().required("Sabab yozing"),
    });

    const formik = useFormik({
        initialValues: {
            dates: [],
            description: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            const formattedValues = {
                date:"2024-10-2",
                dates: values.dates.map(date => dayjs(date).format('YYYY-MM-DD')),
                description: values.description
            }
            const resp = await dispatch(createWekend(formattedValues))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
                setLoading(false)
            } else {
                setLoading(false)
                await dispatch(fetchWekends())
                formik.resetForm()
                setSelectedDates([])
                return setOpenAddGroup()
            }
        }
    })

    const { errors, values, handleSubmit, handleChange, handleBlur, touched, setFieldValue } = formik

    useEffect(() => {
        return () => {
            formik.resetForm()
        }
    }, [])

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            const newDates = [...selectedDates, date]
            setSelectedDates(newDates)
            setFieldValue('dates', newDates)
        }
    }

    const handleRemoveDate = (dateToRemove: Dayjs) => {
        const filteredDates = selectedDates.filter(date => !date.isSame(dateToRemove, 'day'))
        setSelectedDates(filteredDates)
        setFieldValue('dates', filteredDates)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form
                onSubmit={handleSubmit}
                style={{
                    padding: '10px 20px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    marginTop: '15px'
                }}
            >
                {/* Multiple Dates Selection */}
                <FormControl fullWidth>
                    <DatePicker
                        name='dates'
                        
                        label={t("Sanani tanlang")}
                        value={null} // Keep it null to allow multiple selections
                        onChange={handleDateChange}
                        disablePast
                    />
                    {errors.dates && touched.dates && <FormHelperText>{errors.dates}</FormHelperText>}
                </FormControl>

                {/* Display Selected Dates */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {selectedDates.map((date) => (
                        <Chip
                            key={date.toString()}
                            label={date.format('YYYY-MM-DD')}
                            onDelete={() => handleRemoveDate(date)}
                        />
                    ))}
                </div>

                <FormControl fullWidth>
                    <TextField
                        label={t('Sabab')}
                        size='small'
                        multiline
                        rows={4}
                        name='description'
                        error={!!errors.description && touched.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                    />
                    {errors.description && touched.description && <FormHelperText error>{errors.description}</FormHelperText>}
                </FormControl>

                <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
                    {t("Saqlash")}
                </LoadingButton>
            </form>
        </LocalizationProvider>
    )
}
