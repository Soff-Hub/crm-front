import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import DataTable, { customTableDataProps } from '../table'
import Router, { useRouter } from 'next/router'
import useDebounce from 'src/hooks/useDebounce'


export interface CompanyType {
    id: number,
    name: string,
    status: string,
    ceo: {
        first_name: string,
        login: string,
        password: string,
        phone: string
    }
}

const column: customTableDataProps[] = [
    {
        xs: 0.03,
        title: "Id",
        dataIndex: 'index',
    },
    {
        xs: 0.15,
        title: "Nomi",
        dataIndex: 'name',
    },
    {
        xs: 0.07,
        title: "Holati",
        dataIndex: 'status',
    },
    {
        xs: 0.2,
        title: "Direktor",
        dataIndex: 'ceo',
        render: (ceo: any) => ceo.first_name
    },
    {
        xs: 0.2,
        title: "Aloqa",
        dataIndex: 'ceo',
        render: (ceo: any) => ceo.phone
    },
    {
        xs: 0.2,
        title: "Login",
        dataIndex: 'ceo',
        render: (ceo: any) => ceo.login
    },
    {
        xs: 0.2,
        title: "Parol",
        dataIndex: 'ceo',
        render: (ceo: any) => ceo.password
    },
]

const data: CompanyType[] = [1, 2, 3].map(el => ({
    id: el,
    name: "Soff Study",
    status: 'ative',
    ceo: {
        first_name: "Zufarbek Abdurahmonov",
        login: "soffceo",
        password: '12345678',
        phone: "+998931231177"
    }
}))

export default function CompanyList() {

    const { push } = useRouter()
    const [search, setSearch] = useState<string>('')
    const seachValue = useDebounce(search, 1000)

    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <TextField onChange={(e) => setSearch(e.target.value)} size='small' placeholder="Qidirish..." sx={{ minWidth: '300px' }} />
                <Button className='ms-2' variant='outlined'>Qidirish</Button>
                <Button onClick={() => Router.push('/c-panel/company/create')} sx={{ marginLeft: 'auto' }} variant='contained'>Yaratish</Button>
            </Box>
            <Box>
                <DataTable columns={column} data={data} rowClick={(id: number) => push(`/c-panel/company/${id}`)} />
            </Box>
        </Box>
    )
}