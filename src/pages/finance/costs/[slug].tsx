import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import useResponsive from 'src/@core/hooks/useResponsive';
import { useSettings } from 'src/@core/hooks/useSettings';
import api from 'src/@core/utils/api';
import { formatCurrency } from 'src/@core/utils/format-currency';
import 'react-datepicker/dist/react-datepicker.css';


interface PickerProps {
    label?: string;
    start: Date | number;
}


type DateType = Date



function Slug(props: { slug: string }) {
    const { settings } = useSettings()
    const { query } = useRouter()

    const { themeColor } = settings
    const mainColor = themeColor === 'primary' ? '#666CFF' : themeColor === 'secondary' ? '#6D788D' : themeColor === 'success' ? '#72E128' : themeColor === 'error' ? '#FF4D49' : themeColor === 'warning' ? '#FDB528' : '#26C6F9'

    const Th = styled(Box)(() => ({
        padding: '5px 10px',
        borderBottom: '1px solid',
        borderColor: mainColor,
        backgroundColor: mainColor,
        color: 'white',
        borderRadius: '10px'
    }))

    const Column = styled(Box)(() => ({
        borderColor: mainColor,
        borderRadius: '10px'
    }))

    const { t } = useTranslation()
    const { isMobile } = useResponsive()

    const [open, setOpen] = useState<'create' | 'delete' | null>(null);
    const [data2, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [amount, setAmount] = useState<string>('');
    const [description, seDescription] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [today, setToday] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [allAmount, setAllAmount] = useState<string>('');
    const [deleteId, setDeleteId] = useState<string>('');

    const todayDate: any = new Date().getDate(); // Bugungi kunni olish
    const scrollContainerRef: any = useRef(null);
    const dateRefs: any = useRef([]);

    const handleOnChangeRange = (dates: any) => {
        setToday(dates.target.value)
    };


    const updateCategory = async (value: any) => {
        try {
            await api.patch(`common/finance/expense-category/update/${query?.slug}/`, { name })
            getExpense(query?.slug)
        } catch (err) {
            console.log(err)
        }

    }

    const getExpense = async (id: any) => {
        const resp = await api.get(`common/finance/expense/list/${query?.slug}/?date_str=${today}-1`)
        setData(resp.data.result);
        setName(resp.data?.category_name);
        setAllAmount(resp.data?.total_expense);
    }

    const createExpense = async () => {
        setLoading(true)
        try {
            await api.post(`common/finance/expense/create/`, { amount, description, expense_category: query.slug, date })
            setOpen(null)
            getExpense(query?.slug)
        } catch (err) {
            console.log(err)
        } finally {
            console.log('finally');
            setLoading(false)
        }
    }


    const deleteExpense = async () => {
        setLoading(true)
        try {
            await api.delete(`common/finance/expense/destroy/${deleteId}/`)
            setOpen(null)
            getExpense(query?.slug)
        } catch (err) {
            console.log(err)
        } finally {
            console.log('finally');
            setLoading(false)
        }
    }


    useEffect(() => {
        getExpense(query?.slug)
    }, [today])


    useEffect(() => {
        if (scrollContainerRef.current && dateRefs.current[todayDate - 1]) {
            dateRefs.current[todayDate - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [todayDate, data2]);


    return (
        <Box>
            <Box className='header'>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2 }}>
                    <TextField onBlur={updateCategory} size='small' sx={{ fontSize: '20px', marginRight: 'auto' }} value={name} onChange={(e) => setName(e.target.value)} />
                    <Box>
                        <TextField size='small' type='month' value={today} onChange={handleOnChangeRange} />
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: 'error.main', ml: 3, display: 'flex', flexDirection: 'column' }} >
                        <span>{t('Umumiy')}</span>
                        <span>
                            {formatCurrency(allAmount)}
                        </span>
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: isMobile ? 'center' : 'flex-start', gap: '15px', flexDirection: isMobile ? 'column' : 'row', overflowX: 'scroll' }}>
                {
                    data2.map((item, i: number) => (
                        <Column
                            ref={item => dateRefs.current[i] = item}
                            sx={{ minWidth: isMobile ? '100%' : '220px', display: 'flex', flexDirection: 'column', gap: '12px', p: '5px' }}>
                            <Th textAlign={'center'}>
                                {Number(item.date?.split('-')?.[2])}
                            </Th>
                            {
                                item.value.map((el: any, j: number) => (
                                    <Box key={j} sx={{ borderBottom: `2px dashed ${mainColor}`, position: 'relative' }}>
                                        <Box>
                                            {formatCurrency(el.amount)}
                                        </Box>
                                        <Box sx={{ fontSize: '14px' }}>
                                            {el.description}
                                        </Box>
                                        <Box sx={{ textAlign: 'center', py: 1, position: 'absolute', right: 0, top: '-5px' }}>
                                            <IconifyIcon onClick={() => (setOpen('delete'), setDeleteId(el.id))} icon={'material-symbols-light:delete-outline'} cursor={'pointer'} />
                                        </Box>
                                    </Box>
                                ))
                            }
                            <Button variant='outlined' onClick={() => (setDate(item.date), setOpen('create'))} size='small'>{t('Yangi')}</Button>
                        </Column>
                    ))
                }
            </Box>



            <Dialog open={open === 'create'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography>{t('Xarajatlarni kiritish')}</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField autoComplete='off' size='small' placeholder={t("Summa")} type='number' fullWidth onChange={(e) => setAmount(e.target.value)} />
                    <TextField autoComplete='off' size='small' multiline minRows={4} placeholder={t("Izoh")} fullWidth onChange={(e) => seDescription(e.target.value)} />
                    <LoadingButton loading={loading} onClick={createExpense} variant='contained'>{t("Saqlash")}</LoadingButton>
                </DialogContent>
            </Dialog>

            <Dialog open={open === 'delete'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', minWidth: '300px', justifyContent: 'space-between' }}>
                    <Typography fontSize={18}>{t("Xarajatlarni o'chirish")}</Typography>
                    <IconifyIcon icon={'mdi:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <LoadingButton onClick={() => setOpen(null)} variant='outlined'>{t("Bekor qilish")}</LoadingButton>
                    <LoadingButton loading={loading} onClick={deleteExpense} variant='contained'>{t("O'chirish")}</LoadingButton>
                </DialogContent>
            </Dialog>
        </Box>
    )
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params } = context;

    return {
        props: {
            slug: params?.slug
        },
    };
}

export default Slug
