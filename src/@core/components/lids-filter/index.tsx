import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import IconifyIcon from '../icon'

export default function LidsFilter({ setOpen, department }: any) {
    const [selected, setSelected] = useState<any>(null)

    const handleChange = (id: any) => {
        setSelected(id)
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>Bo'limlar</InputLabel>
                <Select
                    size='small'
                    label="Bo'limlar"
                    defaultValue=''
                    id='demo-simple-select-outlined'
                    labelId='demo-simple-select-outlined-label'
                    onChange={(value: any) => handleChange(value.target.value)}
                >
                    <MenuItem value=''>
                        <b>Barchasi</b>
                    </MenuItem>
                    {
                        department.map((el: any) => (
                            <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                        ))
                    }
                    <MenuItem value=''>
                        <b onClick={() => setOpen('department-list')}><IconifyIcon fontSize={16} icon={'material-symbols:add'} />Yangi qo'shish</b>
                    </MenuItem>
                </Select>
            </FormControl>
            {
                selected && department.find((item: any) => item.id === selected).children.length > 0 ? (
                    <FormControl sx={{ maxWidth: 180, width: '100%' }}>
                        <InputLabel size='small' id='demo-simple-select-outlined-label'>Xolati</InputLabel>
                        <Select
                            size='small'
                            label="Xolati"
                            defaultValue=''
                            id='demo-simple-select-outlined'
                            labelId='demo-simple-select-outlined-label'
                        >
                            <MenuItem value=''>
                                <b>Barchasi</b>
                            </MenuItem>
                            {
                                department.find((item: any) => item.id === selected).children.map((el: any) => (
                                    <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                                ))
                            }
                            <MenuItem value=''>
                                <b onClick={() => setOpen('department-item')}><IconifyIcon fontSize={16} icon={'material-symbols:add'} />Yangi qo'shish</b>
                            </MenuItem>
                        </Select>
                    </FormControl>
                ) : ""
            }
        </Box>
    )
}
