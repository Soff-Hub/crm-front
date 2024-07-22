import LoadingButton from '@mui/lab/LoadingButton';
import { FormControl, FormHelperText, TextField } from '@mui/material'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import AmountInput, { revereAmount } from 'src/@core/components/amount-input'
import api from 'src/@core/utils/api';
import * as Yup from 'yup'

export default function EditCostForm({ slug, setOpen, reRender, initials }: any) {
    const [loading, setLoading] = useState<boolean>(false)

    const validationSchema = Yup.object({
        amount: Yup.string().required("Summani kiriting"),
        description: Yup.string().required("Izoh kiriting"),
        date: Yup.string().required("Sanani kiritish majburiy")
    });

    const initialValues = {
        amount: `${initials?.amount}`,
        description: `${initials?.description}`,
        date: `${initials?.date}`
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                await api.patch(`common/finance/expense/update/${initials.id}/`, { ...values, amount: revereAmount(values.amount), expense_category: slug })
                await reRender()
                setOpen(null)
            } catch (err: any) {
                if (err?.response?.data) {
                    formik.setErrors(err?.response?.data)
                }
                console.log(err)
            }
            setLoading(false)
        }
    });


    return (
        <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px 0' }}>

            <FormControl fullWidth>
                <AmountInput
                    size='small'
                    label="Summa"
                    name='amount'
                    error={!!formik.errors.amount && formik.touched.amount}
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {!!formik.errors.amount && formik.touched.amount && <FormHelperText error>{formik.errors.amount}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    size='small'
                    label="Izoh"
                    multiline
                    rows={4}
                    name='description'
                    error={!!formik.errors.description && formik.touched.description}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {!!formik.errors.description && formik.touched.description && <FormHelperText error>{formik.errors.description}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    size='small'
                    label="Sana"
                    name='date'
                    type='date'
                    error={!!formik.errors.date && formik.touched.date}
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {!!formik.errors.date && formik.touched.date && <FormHelperText error>{formik.errors.date}</FormHelperText>}
            </FormControl>

            <LoadingButton type='submit' variant='contained' loading={loading}>
                Yaratish
            </LoadingButton>

        </form>
    )
}