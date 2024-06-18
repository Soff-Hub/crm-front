import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Switch, TextField } from '@mui/material'
import DataTable, { customTableDataProps } from '../table'
import Router, { useRouter } from 'next/router'
import useDebounce from 'src/hooks/useDebounce'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import Status from '../status'


export interface CompanyType {
    id: number
    name: string
    reference_phone: string
    reference_name: string
    logo: any,
    schema_name: string
    is_active: boolean
    domains: { id: number, domain: string }[]
    is_create: boolean
}

export default function CompanyList() {

    const { t } = useTranslation()
    const [data, setData] = useState<CompanyType[]>([])
    const [loading, setLoading] = useState<any>(null)

    async function getData() {
        try {
            const resp = await api.get(`/owner/list/client/`)
            setData(resp.data);
        } catch (err: any) {
            console.log(err);
        }
    }

    const suspendCompany = async (item: any, id: any) => {
        setLoading(item.id)
        try {
            await api.patch(`/owner/client/${item.id}/`, { is_active: id })
            await getData()
        } catch (err: any) {
            console.log(err?.response?.data);

        }
        setLoading(null)
    }

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
            xs: 0.2,
            title: t("Masul shaxs ismi"),
            dataIndex: 'reference_name'
        },
        {
            xs: 0.2,
            title: t("Masul shaxs raqami"),
            dataIndex: 'reference_phone'
        },
        {
            xs: 0.2,
            title: t("Domain"),
            dataIndex: 'domain',
            render: (domain) => `${domain}.soffcrm.uz`
        },
        {
            xs: 0.2,
            title: t("SMS soni"),
            dataIndex: 'sms_limit'
        },
        {
            xs: 0.2,
            title: t("Keyingi to'ov sanasi"),
            dataIndex: 'expiration_date',
            render: (expiration_date) => `${expiration_date?.split('-').reverse().join('/')}`
        },
        {
            xs: 0.2,
            title: t("Keyingi to'lovgacha"),
            dataIndex: 'allowed_days',
            render: (allowed_days) => `${allowed_days} kun`
        },
        {
            xs: 0.2,
            title: t("O'quvchilar soni"),
            dataIndex: 'students_count',
            render: (domain) => `${domain}`
        },
        {
            xs: 0.07,
            title: t("Status"),
            dataIndex: 'id',
            render: (status: any) => {
                const find = data.find(el => el.id === status)
                return <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {loading === find?.id ? <>
                        <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
                    </> : <>
                        {find?.is_active === true ? <Status color='success' /> : <Status color='error' />}
                        <Switch checked={Boolean(find?.is_active)} onChange={(e, i) => suspendCompany(find, i)} />
                    </>}
                </Box>
            }
        },
    ]

    const { push } = useRouter()
    const [search, setSearch] = useState<string>('')
    const seachValue = useDebounce(search, 1000)



    const rowClick = (id: any) => {
        const find = data.find(el => el.id === Number(id))
        // if (find?.is_create) {
        //     push(`/c-panel/company/${id}`)
        // }
        push(`/c-panel/company/${id}`)
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
                <DataTable columns={column} data={data} rowClick={(id: number) => rowClick(id)} />
            </Box>
        </Box>
    )
}