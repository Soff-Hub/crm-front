import { useEffect } from 'react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'src/store';
import { today } from 'src/@core/components/card-statistics/kanban-item';
import api from 'src/@core/utils/api';
import toast from 'react-hot-toast';


type Props = {
    item: any
    reRender: any
    groups: any[]
    setLoading: any
    loading: any
}

export default function AddToGroupForm({ item, reRender, groups, setLoading }: Props) {

    const { t } = useTranslation()
    const { loading } = useAppSelector((state) => state.leads)

    const validationSchema = Yup.object({
        group: Yup.string().required("Ism kiriting"),
        added_at: Yup.string().required("Qo'shilish sanasini tanlang")
    });

    const initialValues: {
        group: string
        added_at: string
    } = {
        group: '',
        added_at: today,
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const resp = await api.post(`leads/lead-to-student/`, {
                    lead: item.id,
                    ...values
                })
                toast.success(`${resp.data?.msg}`)
                setLoading(false)
                reRender(false)
            } catch (err: any) {
                setLoading(false)
                toast.error(JSON.stringify(err.response.data.msg), { position: 'bottom-center' })
                // showResponseError(err.response.data, setError)
            }
        }
    });

    const { values, errors, touched, handleBlur, handleChange } = formik

    useEffect(() => {

        return () => {
            formik.resetForm()
        }
    }, [])


    return (
        <form onSubmit={formik.handleSubmit} style={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }}>

            <FormControl fullWidth>
                <InputLabel error={!!errors.group && touched.group} size='small'>{t("Guruh")}</InputLabel>
                <Select
                    size='small'
                    label={t("Guruh")}
                    error={!!errors.group && touched.group}
                    name='group'
                    defaultValue={''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.group}
                >
                    {
                        groups.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                    }
                </Select>
                {!!errors.group && touched.group && <FormHelperText error>{errors.group}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    size='small'
                    type='date'
                    name='added_at'
                    label={t("Qo'shilish sanasi")}
                    error={!!errors.added_at && touched.added_at}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.added_at}
                />
                {!!errors.added_at && touched.added_at && <FormHelperText error>{errors.added_at}</FormHelperText>}
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Qo'shsih")}</LoadingButton>
        </form>
    )
}