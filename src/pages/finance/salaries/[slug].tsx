import { Box } from '@mui/material';
import { GetServerSidePropsContext } from 'next/types';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { customTableDataProps } from 'src/@core/components/lid-table';
import DataTable from 'src/@core/components/table';
import { useSettings } from 'src/@core/hooks/useSettings';
import { formatCurrency } from 'src/@core/utils/format-currency';



function Slug({ slug }: { slug: string }) {
    const { settings } = useSettings()
    const { themeColor } = settings
    const mainColor = themeColor === 'primary' ? '#666CFF' : themeColor === 'secondary' ? '#6D788D' : themeColor === 'success' ? '#72E128' : themeColor === 'error' ? '#FF4D49' : themeColor === 'warning' ? '#FDB528' : '#26C6F9'
    const { t } = useTranslation()



    const salaryCol: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: "index"
        },
        {
            xs: 0.2,
            title: t("Sana"),
            dataIndex: "date"
        },
        {
            xs: 0.2,
            title: t("Summa"),
            dataIndex: "amount",
            render: (amount) => `${formatCurrency(amount)} so'm`
        }
    ]

    const data: any = [
        {
            date: '12-12-2024',
            amount: 1000000,
        }
    ]


    return (
        <Box>
            {slug}
            <DataTable columns={salaryCol} data={data} />
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
