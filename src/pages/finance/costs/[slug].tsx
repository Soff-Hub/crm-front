import { Box, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import useResponsive from 'src/@core/hooks/useResponsive';
import api from 'src/@core/utils/api';
import { formatCurrency } from 'src/@core/utils/format-currency';
import 'react-datepicker/dist/react-datepicker.css';
import DataTable, { customTableDataProps } from 'src/@core/components/table';


function Slug(props: { slug: string }) {
    const { query } = useRouter()

    const { t } = useTranslation()
    const { isMobile } = useResponsive()

    const [data2, setData] = useState<any[]>([]);
    const [today, setToday] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [allAmount, setAllAmount] = useState<string>('');

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

    const data = [
        {
            id: 1,
            amount: '3400000',
            date: '2024-06-01',
            description: 'Novza filialga 3ta monitor olib kelindi'
        }
    ]

    return (
        <Box>
            <Box className='header'>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 2 }}>
                    <TextField onBlur={updateCategory} size='small' sx={{ fontSize: '20px', marginRight: 'auto' }} value={name} onChange={(e) => setName(e.target.value)} />

                    <Typography sx={{ fontSize: '14px', color: 'error.main', ml: 3, display: 'flex', flexDirection: 'column' }} >
                        <span>{t('Umumiy')}</span>
                        <span>
                            {formatCurrency(allAmount)}
                        </span>
                    </Typography>
                </Box>
            </Box>

            <DataTable columns={columns} data={data} />
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
