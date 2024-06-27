import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { editEmployee, fetchEmployees, setOpenCreateSms } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useBranches from 'src/hooks/useBranch'
import useRoles from 'src/hooks/useRoles'

type Props = {}

export default function EditEmployeeForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { branches, getBranches } = useBranches()
    const { employeeData } = useAppSelector(state => state.settings)
    const { roles } = useRoles()

    const [loading, setLoading] = useState<boolean>(false)

    const setOpenAddGroup = () => {
        dispatch(setOpenCreateSms(null))
    }

    const validationSchema = Yup.object({
        first_name: Yup.string().required("Ism kiriting"),
        phone: Yup.string().required("Telefon raqam"),
        password: Yup.string().required("Parol kiriting"),
        branches: Yup.number().required("Filial tanlang"),
    });

    const initialValues = {
        first_name: employeeData?.first_name,
        phone: employeeData?.phone,
        password: null,
        branches: employeeData?.branches?.filter((el: any) => el.exists)?.map((el: any) => Number(el.id)),
        roles: employeeData?.roles?.filter((el: any) => el.exists)?.map((el: any) => Number(el.id))
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            
            setLoading(true)
            const resp = await dispatch(editEmployee({ ...values, id: employeeData?.id }))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
                setLoading(false)
            } else {
                setLoading(false)
                await dispatch(fetchEmployees())
                formik.resetForm()
                return setOpenAddGroup()
            }
        }
    })

    const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik


    useEffect(() => {
        getBranches()

        return () => {
            formik.resetForm()
        }
    }, [])

    return (
        <form
            onSubmit={handleSubmit}
            id='posts-courses-id'
            style={{
                padding: '10px 20px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginTop: '15px'
            }}
        >
            <FormControl fullWidth>
                <TextField
                    label={t('first_name')}
                    size='small'
                    name='first_name'
                    error={!!errors.first_name && !!touched.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                />
                {errors.first_name && touched.first_name && <FormHelperText error>{`${errors.first_name}`}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    label={t('phone')}
                    size='small'
                    name='phone'
                    error={!!errors.phone && !!touched.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                />
                {errors.phone && touched.phone && <FormHelperText error>{`${errors.phone}`}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    label={t('password')}
                    size='small'
                    name='password'
                    error={!!errors.password && touched.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                />
                {errors.password && touched.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel error={!!errors.branches && !!touched.branches} size='small' id='demo-simple-select-outlined-label'>
                    {t('branch')}
                </InputLabel>
                <Select
                    size='small'
                    label={t('branch')}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    name='branches'
                    error={!!errors.branches && !!touched.branches}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.branches}
                >
                    {branches.length > 0 && branches.map((item: any) => <MenuItem key={item.id} value={item.id}>{item?.name}</MenuItem>)}
                </Select>

                {errors.branches && touched.branches && <FormHelperText error>{`${errors.branches}`}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel error={!!errors.branches && !!touched.branches} size='small' id='demo-simple-select-outlined-label'>
                    {t('branch')}
                </InputLabel>
                <Select
                    size='small'
                    label={t('branch')}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    name='roles'
                    error={!!errors.roles && !!touched.roles}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.roles}
                >
                    {roles.length > 0 && roles.map((item: any) => <MenuItem key={item.id} value={item.id}>{item?.name}</MenuItem>)}
                </Select>

                {errors.roles && touched.roles && <FormHelperText error>{`${errors.roles}`}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='contained' color='success' fullWidth>
                {' '}
                {t("Saqlash")}
            </LoadingButton>
        </form>
    )
}