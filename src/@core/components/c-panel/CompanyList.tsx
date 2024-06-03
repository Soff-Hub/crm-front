import React, { useEffect, useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import DataTable, { customTableDataProps } from '../table'
import Router, { useRouter } from 'next/router'
import useDebounce from 'src/hooks/useDebounce'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'


export interface CompanyType {
    id: number
    name: string
    reference_phone: string
    reference_name: string
    logo: any,
    schema_name: string
    is_active: boolean
    domains: { id: number, domain: string }[]
}

export default function CompanyList() {

    const { t } = useTranslation()

    const column: customTableDataProps[] = [
        {
            xs: 0.03,
            title: "#",
            dataIndex: 'index',
        },
        {
            xs: 0.15,
            title: t("Nomi"),
            dataIndex: 'name',
        },
        {
            xs: 0.07,
            title: t("Status"),
            dataIndex: 'is_active',
        },
        {
            xs: 0.2,
            title: t("Masul shaxs ismi"),
            dataIndex: 'reference_name'
        },
        {
            xs: 0.2,
            title: t("phone"),
            dataIndex: 'reference_phone',
            render: (ceo: any) => ceo
        },
        // {
        //     xs: 0.2,
        //     title: t("Login"),
        //     dataIndex: 'ceo',
        //     render: (ceo: any) => ceo.login
        // },
        // {
        //     xs: 0.2,
        //     title: t("password"),
        //     dataIndex: 'ceo',
        //     render: (ceo: any) => ceo.password
        // },
    ]

    const [data, setData] = useState<CompanyType[]>([])


    const { push } = useRouter()
    const [search, setSearch] = useState<string>('')
    const seachValue = useDebounce(search, 1000)

    async function getData() {
        try {
            const resp = await api.get(`/owner/list/client/`)
            setData(resp.data);
        } catch (err: any) {
            console.log(err);
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <TextField onChange={(e) => setSearch(e.target.value)} size='small' placeholder={`${t("Qidirish")}...`} sx={{ minWidth: '300px' }} />
                <Button className='ms-2' variant='outlined'>{t("Qidirish")}</Button>
                <Button onClick={() => Router.push('/c-panel/company/create')} sx={{ marginLeft: 'auto' }} variant='contained'>{t('Yaratish')}</Button>
            </Box>
            <Box>
                <DataTable columns={column} data={data} rowClick={(id: number) => push(`/c-panel/company/${id}`)} />
            </Box>
        </Box>
    )
}