import LoadingButton from "@mui/lab/LoadingButton";
import { Drawer, FormControl, FormHelperText, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { formatAmount, revereAmount } from "src/@core/components/amount-input";
import IconifyIcon from "src/@core/components/icon";
import { useAppDispatch, useAppSelector } from "src/store";
import { createTariff, fetchTariffs, handleMonthlyModalOpen } from "src/store/apps/c-panel";
import { TariffType } from "src/types/apps/cpanelTypes";
import * as Yup from "yup";

export default function CreateMonthlyPlan() {
    const { t } = useTranslation()
    const [isLoading, setLoading] = useState(false)
    const { isOpenMonthlyModal } = useAppSelector(state => state.cPanelSlice)
    const dispatch = useAppDispatch()

    const validationSchema = Yup.object({
        amount: Yup.string().nullable().required(t("Tarif summasini kiriting") as string),
        month_count: Yup.string().nullable().required(t("Tarif oylar sonini kiriting") as string),
        min_count: Yup.string().nullable().required(t("Minimal o'quvchilar sonini kiriting") as string),
        max_count: Yup.string().nullable().required(t("Maximal o'quvchilar sonini kiriting") as string),
    });

    const formik: any = useFormik({
        initialValues: {
            amount: null,
            month_count: null,
            min_count: null,
            max_count: null
        },
        validationSchema,
        onSubmit: async (values: Partial<TariffType>) => {
            setLoading(true)
            const response = await dispatch(createTariff(values))
            if (response.meta.requestStatus == "rejected") {
                formik.setErrors(response.payload)
            } else {
                toast.success("Tarif qo'shildi")
                handleClose()
                await dispatch(fetchTariffs())
            }
            setLoading(false)
        }
    });

    const handleClose = () => {
        formik.resetForm()
        dispatch(handleMonthlyModalOpen(false))
    }

    return (
        <Drawer open={isOpenMonthlyModal} hideBackdrop anchor='right' variant='temporary' >
            <Box sx={{ display: "flex", flexDirection: "column", minWidth: "350px" }}>
                <Box
                    className='customizer-header'
                    sx={{
                        position: 'relative',
                        p: theme => theme.spacing(3.5, 5),
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        {t("Tarif qo'shish")}
                    </Typography>
                    <IconButton
                        onClick={() => handleClose()}
                        sx={{
                            right: 20,
                            top: '50%',
                            position: 'absolute',
                            color: 'text.secondary',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <IconifyIcon icon='mdi:close' fontSize={20} />
                    </IconButton>
                </Box>
                <Box width={'100%'}>
                    <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
                        <FormControl sx={{ width: '100%' }}>
                            <TextField
                                name='month_count'
                                size='small'
                                type={"number"}
                                label={t("Tarif oylar soni")}
                                error={!!formik.errors.month_count && !!formik.touched.month_count}
                                value={formik.values.month_count}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <FormHelperText error={!!formik.errors.month_count && !!formik.touched.month_count}>{!!formik.errors.month_count && !!formik.touched.month_count && formik.errors.month_count}</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <TextField
                                name='amount'
                                size='small'
                                label={t("Summasi")}
                                error={!!formik.errors.amount && !!formik.touched.amount}
                                value={formatAmount(String(formik.values.amount || ""))}
                                defaultValue={formik.values.amount}
                                onChange={(e) => formik.setFieldValue("amount", revereAmount(e.target.value))}
                                onBlur={formik.handleBlur}
                            />
                            <FormHelperText error={!!formik.errors.amount && !!formik.touched.amount}>{!!formik.errors.amount && !!formik.touched.amount && formik.errors.amount}</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <TextField
                                name='min_count'
                                size='small'
                                type={"number"}
                                label={t("O'quvchilar soni (min)")}
                                error={!!formik.errors.min_count && !!formik.touched.min_count}
                                value={formik.values.min_count}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <FormHelperText error={!!formik.errors.min_count && !!formik.touched.min_count}>{!!formik.errors.min_count && !!formik.touched.min_count && formik.errors.min_count}</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ width: '100%' }}>
                            <TextField
                                name='max_count'
                                size='small'
                                type={"number"}
                                label={t("O'quvchilar soni (max)")}
                                error={!!formik.errors.max_count && !!formik.touched.max_count}
                                value={formik.values.max_count}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <FormHelperText error={!!formik.errors.max_count && !!formik.touched.max_count}>{!!formik.errors.max_count && !!formik.touched.max_count && formik.errors.max_count}</FormHelperText>
                        </FormControl>
                        <LoadingButton loading={isLoading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
                    </form>
                </Box>
            </Box>
        </Drawer>
    )
}
