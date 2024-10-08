import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CardFinanceCategory from 'src/@core/components/card-statistics/card-finance-category';
import IconifyIcon from 'src/@core/components/icon';


export default function FinanceCategories({ categryData, confirmDeleteCategory, loading, setDeleteCategory, deleteCategory }: any) {

    const [isHover, setIsHover] = useState<any>(null)
    const { push } = useRouter()
    const { t } = useTranslation()


    return (
        <Grid container spacing={6} mb={10}>
            {
                categryData.map((_: any, index: any) => (
                    <Grid item xs={12} sm={6} lg={2} key={index} onMouseEnter={() => setIsHover(_.id)} onMouseLeave={() => setIsHover(null)} >
                        <Box onClick={() => _.is_advanced ? push(`/finance/advance`) : push(`/finance/costs/${_.id}`)} sx={{ cursor: 'pointer', position: "relative" }}>
                            <CardFinanceCategory title={_.name} stats={_.total_expense} icon={<IconifyIcon fontSize={"3rem"} icon={''} />} color={'warning'} />
                            {isHover === _.id && _.is_delete && <IconButton onClick={(e) => (e.stopPropagation(), setDeleteCategory(_.id))} aria-label="delete" size="small" style={{ position: 'absolute', zIndex: 999, bottom: '2px', right: 0, cursor: 'pointer' }}>
                                <IconifyIcon icon={'fluent:delete-20-regular'} />
                            </IconButton>}
                        </Box>
                    </Grid>
                ))
            }

            <Dialog open={deleteCategory} onClose={() => setDeleteCategory(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography></Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setDeleteCategory(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography>{t("Chiqimlar bo'limini o'chirmoqchimisiz?")}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 10 }}>
                        <LoadingButton onClick={() => (setDeleteCategory(null))} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                        <LoadingButton loading={loading} onClick={() => confirmDeleteCategory()} color='error' variant='contained'>{t("O'chirish")}</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}