import { Box, Card, CardContent, FormControl, FormHelperText, Typography } from '@mui/material'
import { FormikProps } from 'formik'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AmountInput, { revereAmount } from 'src/@core/components/amount-input'
import EmptyContent from 'src/@core/components/empty-content'
import { CourseFormValues } from './CreateCourseDialog'

const courses = {
    height: "100%",
    overflow: "auto"
}

type CourseAmountsProps = {
    formik: FormikProps<CourseFormValues>;
};

export default function CourseAmounts({ formik }: CourseAmountsProps) {
    const { t } = useTranslation()

    return (
        <Box sx={{
            ...courses,
            width: formik.values.course_costs.length ? "300px" : "0",
            transition: "width 0.2s ease"
        }}>
            <Box
                className='customizer-header'
                sx={{
                    position: 'relative',
                    p: theme => theme.spacing(3.5, 5),
                    borderBottom: theme => `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant='h6' sx={{ fontWeight: 600 }}>
                    {t("Oylik kurs narxlari")}
                </Typography>
            </Box>
            <Box sx={{ p: 4, height: "calc(100% - 61px)", display: "flex", flexDirection: "column", gap: "10px", overflow: "auto" }}>
                {formik.values?.course_costs?.length ? formik.values.course_costs?.map((course: { price: number, order: number }, index: number) => (
                    <Card sx={{ width: "100%", minHeight: "120px", boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text.primary" gutterBottom>
                                {course.order}-oy
                            </Typography>
                            <FormControl fullWidth sx={{ mt: 1 }}>
                                <AmountInput
                                    label={t('Kurs narxi')}
                                    size='small'
                                    name={`course_costs.${index}.price`}
                                    error={formik.touched.course_costs?.[index]?.price && !!formik.errors.course_costs?.[index]?.price}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => formik.setFieldValue(`course_costs.${index}.price`, Number(revereAmount(e.target.value)))}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.course_costs?.[index].price}
                                />
                                {formik.touched.course_costs?.[index]?.price && !!formik.errors.course_costs?.[index]?.price && <FormHelperText error>{formik.errors.course_costs?.[index]?.price}</FormHelperText>}
                            </FormControl>
                        </CardContent>
                    </Card>
                )) : <EmptyContent />}
            </Box>
        </Box >
    )
}
