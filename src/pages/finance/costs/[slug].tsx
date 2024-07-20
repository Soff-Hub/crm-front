import { Box, Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import { formatCurrency } from 'src/@core/utils/format-currency';
import 'react-datepicker/dist/react-datepicker.css';
import DataTable, { customTableDataProps } from 'src/@core/components/table';
import CreateCostForm from 'src/views/apps/finance/CreateCostForm';
import IconifyIcon from 'src/@core/components/icon';


function Slug(props: { slug: string }) {
    const { query } = useRouter()

    const { t } = useTranslation()

    const [data, setData] = useState<any[]>([]);
    const [name, setName] = useState<string>('');
    const [allAmount, setAllAmount] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false)
    const [editable, setEditable] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const updateCategory = async (value: any) => {
        try {
            await api.patch(`common/finance/expense-category/update/${query?.slug}/`, { name })
            getExpense()
            setEditable(false)
        } catch (err) {
            console.log(err)
        }
    }

    const getExpense = async () => {
        setLoading(true)
        const resp = await api.get(`common/finance/expense/list/${query?.slug}/?date=`)
        setData(resp.data.result);
        setName(resp.data?.category);
        setAllAmount(resp.data?.total_expense);
        setLoading(false)
    }

    const columns: customTableDataProps[] = [
        {
            xs: 0.03,
            title: '#',
            dataIndex: 'index'
        },
        {
            xs: 0.2,
            title: 'Summa',
            dataIndex: 'amount',
            render: (amount) => `${formatCurrency(amount)} so'm`
        },
        {
            xs: 0.2,
            title: 'Sana',
            dataIndex: 'date'
        },
        {
            xs: 0.5,
            title: 'Izoh',
            dataIndex: 'description'
        },
        {
            xs: 0.05,
            title: '',
            dataIndex: 'id'
        }
    ]

    useEffect(() => {
        getExpense()
    }, [])

    return (
        <Box>
            <Box className='header'>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2 }}>
                    {editable ? <TextField onBlur={updateCategory} size='small' sx={{ fontSize: '20px', marginRight: 4 }} value={name} onChange={(e) => setName(e.target.value)} /> : <Typography variant='h6' sx={{ marginRight: 4 }}>{name}</Typography>}
                    <IconifyIcon style={{ cursor: 'pointer' }} icon={editable ? 'ic:baseline-check' : 'mdi:edit'} onClick={() => setEditable(!editable)} />

                    <Typography sx={{ fontSize: '14px', color: 'error.main', ml: 'auto', display: 'flex', alignItems: 'center', mr: 4, gap: '5px' }} >
                        <span>{t('Umumiy')}</span>
                        <span>
                            {formatCurrency(allAmount)}
                        </span>
                    </Typography>

                    <Button variant='contained' size='small' onClick={() => setOpen(true)}>Yangi</Button>
                </Box>
            </Box>

            <DataTable loading={loading} columns={columns} data={data} />

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>Xarajat kiritish</DialogTitle>
                <DialogContent sx={{ minWidth: '320px' }}>
                    <CreateCostForm slug={props.slug} setOpen={setOpen} reRender={() => getExpense()} />
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
