import React, { useState } from 'react'
import { Box, Card, CardContent, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import DataTable, { customTableDataProps } from 'src/@core/components/table'

export default function Archive() {

    const { t } = useTranslation()
    const [filter, setFilter] = useState<{ col: any[], data: any[] }>({ col: [], data: [] })

    const studentsColumns: customTableDataProps[] = [
        {
            xs: 0.3,
            title: "#",
            dataIndex: 'index'
        },
        {
            xs: 1,
            title: t("first_name"),
            dataIndex: 'first_name'
        },
        {
            xs: 1,
            title: t("phone"),
            dataIndex: 'phone'
        },
        {
            xs: 1,
            title: t("Harakatlar"),
            dataIndex: 'id'
        },
    ]
    const studentData: {
        id: number
        first_name: string
        phone: string
    }[] = [
            {
                id: 1,
                first_name: "Doniyor Eshmamatov",
                phone: '+998931231177'
            }
        ]


    const groupsColumns: customTableDataProps[] = [
        {
            xs: 0.3,
            title: "#",
            dataIndex: 'index'
        },
        {
            xs: 1,
            title: t("Nomi"),
            dataIndex: 'name'
        },
        {
            xs: 1,
            title: t("course"),
            dataIndex: 'course'
        },
        {
            xs: 1,
            title: t("teacher"),
            dataIndex: 'teacher'
        },
        {
            xs: 1,
            title: t("Harakatlar"),
            dataIndex: 'id'
        },
    ]
    const groupData: {
        id: number
        name: string
        course: string
        teacher: string
    }[] = [
            {
                id: 1,
                name: 'Frontend 030',
                course: "FrontEnd",
                teacher: "Doniyor Eshmamatov",
            }
        ]

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Card>
                <CardContent sx={{ display: 'flex', gap: '10px' }} >
                    <Input size='small' placeholder={t("Qidirish...")} startAdornment={<IconifyIcon icon={'ic:baseline-search'} style={{ marginRight: '10px' }} />} />
                    <FormControl>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>Filterlar</InputLabel>
                        <Select
                            size='small'
                            label="Filterlar"
                            defaultValue='1'
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                            onChange={(e) => {
                                if (+e.target.value === 1) {
                                    setFilter({ col: groupsColumns, data: groupData })
                                }
                                else if (+e.target.value === 2) {
                                    setFilter({ col: studentsColumns, data: studentData })
                                }
                            }}
                        >
                            <MenuItem value={1}>
                                Guruhlar
                            </MenuItem>
                            <MenuItem value={2}>
                                O'quvchilar
                            </MenuItem>
                            <MenuItem value={3}>
                                Kurslar
                            </MenuItem>
                            <MenuItem value={4}>
                                O'qituvchilar
                            </MenuItem>
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
            <Card>
                <CardContent sx={{ display: 'flex', gap: '10px' }} >
                    <DataTable data={filter.data} columns={filter.col} />
                </CardContent>
            </Card>
        </Box>
    )
}
