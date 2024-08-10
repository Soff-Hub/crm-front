import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Switch, TextField } from '@mui/material';
import DataTable, { customTableDataProps } from '../table';
import Router, { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import api from 'src/@core/utils/api';
import Status from '../status';
import { toast } from 'react-hot-toast';

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
    const [centerId, setCenterId] = useState<number | null>(null)
    const [isLoading, setLoading] = useState(false)

    async function getData() {
        setLoading(true)
        try {
            const resp = await api.get(`/owner/list/client/`)
            setData(resp.data);
        } catch (err: any) {
            toast.error(err);
        }
        setLoading(false)
    }

    const suspendCompany = async (item: any, id: any) => {
        setCenterId(item.id)
        try {
            await api.patch(`/owner/client/${item.id}/`, { is_active: id })
            await getData()
        } catch (err: any) {
            console.log(err?.response?.data);
        }
        setCenterId(null)
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
                    {centerId === find?.id ? <>
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



    const rowClick = (id: any) => {
        const find = data.find(el => el.id === Number(id))
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
                <DataTable loading={isLoading} columns={column} data={data} rowClick={(id: number) => rowClick(id)} />
            </Box>
        </Box>
    )
}