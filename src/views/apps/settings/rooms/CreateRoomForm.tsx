import LoadingButton from '@mui/lab/LoadingButton'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { createRoom, fetchRoomList, setOpenCreateSms } from 'src/store/apps/settings'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useBranches from 'src/hooks/useBranch'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'

type Props = {}

export default function CreateRoomForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { branches, getBranches } = useBranches()
    const { active_page } = useAppSelector(state => state.settings)

    const [loading, setLoading] = useState<boolean>(false)
    const { push } = useRouter()

    const setOpenAddGroup = () => {
        dispatch(setOpenCreateSms(null))
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Nom kiriting"),
        branch: Yup.string().required("Filial tanlang"),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            branch: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            dispatch(disablePage(true))
            const resp = await dispatch(createRoom(values))
            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
                setLoading(false)
            } else {
                setLoading(false)
                toast.success("Xona muvaffaqiyatli yaratildi")
                await dispatch(fetchRoomList({ page: active_page }))
                formik.resetForm()
                setOpenAddGroup()
            }
            dispatch(disablePage(false))
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
                    label={t('Nomi')}
                    size='small'
                    name='name'
                    error={!!errors.name && touched.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                />
                {errors.name && touched.name && <FormHelperText error>{errors.name}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel error={!!errors.branch && touched.branch} size='small' id='demo-simple-select-outlined-label'>
                    {t('branch')}
                </InputLabel>
                <Select
                    size='small'
                    label={t('branch')}
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    name='branch'
                    error={!!errors.branch && !!touched.branch}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.branch}
                >
                    {branches.length > 0 && branches.map((item: any) => <MenuItem key={item.id} value={`${item.id}`}>{item?.name}</MenuItem>)}
                    <MenuItem sx={{ fontWeight: 600 }} onClick={() => push('/settings/ceo/all-settings')}>
                        Yangi yaratish
                        <IconifyIcon icon={'ion:add-sharp'} />
                    </MenuItem>
                </Select>

                {errors.branch && touched.branch && <FormHelperText error>{errors.branch}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='contained' fullWidth>
                {' '}
                {t("Saqlash")}
            </LoadingButton>
        </form>
    )
}