import { useEffect } from 'react';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { createDepartmentStudent, fetchDepartmentList, setAddSource, setOpenItem, setSectionId } from 'src/store/apps/leads';
import IconifyIcon from 'src/@core/components/icon';
import PhoneInput from 'src/@core/components/phone-input';
import { reversePhone } from 'src/@core/components/phone-input/format-phone-number';
import Router from 'next/router';
import KanbanItem from 'src/@core/components/card-statistics/kanban-item';


type Props = {}

export default function CreateAnonimUserForm({ }: Props) {

    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { sectionId, loading, leadData, openLid, sourceData } = useAppSelector((state) => state.leads)

    const validationSchema = Yup.object({
        department: Yup.string().required("Bo'lim tanlang"),
        source: Yup.string().required("Manbani kiritiing"),
        first_name: Yup.string().required("Ism kiriting"),
        phone: Yup.string().required("Telefon raqam"),
        body: Yup.string(),
    });

    const initialValues: {
        department: string
        source: string | number
        first_name: string
        phone: string
        body?: string
        user: {
            phone: string,
            first_name: string,
            id: number,
            department: number,
            is_active: boolean
        } | null
    } = {
        department: sectionId || '',
        source: '',
        first_name: '',
        phone: '',
        user: null
    }

    const formik: any = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const resp = await dispatch(createDepartmentStudent({ ...values, phone: reversePhone(values.phone) }))

            if (resp.meta.requestStatus === 'rejected') {
                formik.setErrors(resp.payload)
            } else {
                formik.resetForm()
                dispatch(setSectionId(null))
                await dispatch(fetchDepartmentList())
            }
        }
    });

    const { values, errors, touched, handleBlur, handleChange } = formik
    const newErrors: any = { ...errors }

    useEffect(() => {

        return () => {
            formik.resetForm()
        }
    }, [])


    return (
        <form onSubmit={formik.handleSubmit} style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FormControl fullWidth>
                <InputLabel error={!!errors.department && touched.department} size='small' id='user-view-language-label'>{t('Bo\'lim')}</InputLabel>
                <Select
                    size='small'
                    label={t('Bo\'lim')}
                    id='user-view-language'
                    labelId='user-view-language-label'
                    name='department'
                    sx={{ mb: 1 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.department}
                    error={!!errors.department && touched.department}
                >
                    {
                        leadData.some((el: any) => el.id === openLid) ? leadData?.find((el: any) => el.id === openLid)?.children?.map((lead: any) => <MenuItem key={lead.id} value={Number(lead.id)}>{lead.name}</MenuItem>) : <></>
                    }
                    <MenuItem sx={{ fontWeight: 600 }} onClick={() => dispatch(setOpenItem(openLid))}>
                        {t("Yangi yaratish")}
                        <IconifyIcon icon={'ion:add-sharp'} />
                    </MenuItem>
                </Select>
                {!!errors.department && touched.department && <FormHelperText error={true}>{formik.errors.department}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel size='small' id='fsdgsdgsgsdfsd-label'>{t('Manba')}</InputLabel>
                <Select
                    size='small'
                    label={t('Manba')}
                    labelId='fsdgsdgsgsdfsd-label'
                    name='source'
                    sx={{ mb: 1 }}
                    onChange={(e: any) => {
                        handleChange(e)
                        dispatch(setAddSource(e?.target?.value === 0))
                    }}
                    error={!!errors.source && touched.source}
                    onBlur={handleBlur}
                    value={values.source}
                >
                    {
                        sourceData.map((lead: any) => <MenuItem key={lead.id} value={lead.id}>{lead.name}</MenuItem>)
                    }
                    <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/lids/stats')}>
                        {t("Yangi yaratish")}
                        <IconifyIcon icon={'ion:add-sharp'} />
                    </MenuItem>
                </Select>
                {!!errors.source && touched.source && <FormHelperText error>{formik.errors.source}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    fullWidth
                    size='small'
                    label={t('first_name')}
                    name='first_name'
                    error={!!errors.first_name && touched.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                />
                {!!errors.first_name && touched.first_name && <FormHelperText error>{formik.errors.first_name}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
                <InputLabel error={!!errors.phone && touched.phone} htmlFor="login-input">{t('phone')}</InputLabel>
                <PhoneInput
                    fullWidth
                    id='login-input'
                    label={t('phone')}
                    error={!!errors.phone && touched.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                />
                {!!errors.phone && touched.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
            </FormControl>

            {
                errors?.user && <KanbanItem id={newErrors.user.id} phone={newErrors.user.phone} last_activity={newErrors.last_activity} status='new' title={newErrors.user.first_name} is_view />
            }

            <FormControl fullWidth>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    size='small'
                    label={t('Izoh')}
                    name='body'
                    onChange={handleChange}
                    value={values.body}
                />
                <FormHelperText error={!!errors.body}>{formik.errors.body}</FormHelperText>
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yaratish")}</LoadingButton>
        </form>
    )
}