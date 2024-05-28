import React, { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical';
import api from 'src/@core/utils/api';
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import { useRouter } from 'next/router';
import format from 'date-fns/format';


const Stats = () => {

    const [sources, setSources] = useState<{ id: number, name: string, students_count: number }[]>([])
    const [filter, setFilter] = useState<'a' | 1>('a')
    const { push } = useRouter()
    const [date, setDate] = useState<any>('')

    const getSources = async () => {
        const start_date = date?.[0] ? format(date?.[0], 'yyyy-MM-dd') : ''
        const end_date = date?.[1] ? format(date?.[1], 'yyyy-MM-dd') : ''

        await api.get(`leads/statistic/`, { params: { start_date, end_date } }).then(resp => setSources(resp.data.result)).catch(err => console.log(err)).finally(() => console.log('finish'))
    }

    const handleFilter = (value: any) => {
        setFilter(value)
        if (value === 'a') {
            setSources(sources.sort((a, b) => a.name.localeCompare(b.name)))
        } else {
            setSources(sources.sort((a, b) => b.students_count - a.students_count))
        }
    }

    const handleChangeDate = (e: any) => {
        setDate(e)
    }

    useEffect(() => {
        getSources()
    }, [date])


    return (
        <div>
            <Box sx={{ alignItems: 'center', paddingBottom: '20px', flexWrap: 'nowrap' }}>
                <DateRangePicker format="yyyy-MM-dd" onChange={handleChangeDate} translate={'yes'} size="sm" style={{ flex: 1, marginRight: 20 }} />
                <ButtonGroup size="small">
                    <Button variant={filter === 'a' ? 'contained' : 'outlined'} onClick={() => handleFilter('a')}>A {">"} Z</Button>
                    <Button variant={filter === 1 ? 'contained' : 'outlined'} onClick={() => handleFilter(1)}>1 {">"} 0</Button>
                </ButtonGroup>
            </Box>
            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {
                    sources.map((el, i) => (
                        <Box key={i} className='' sx={{ cursor: 'pointer', minHeight: '100px', minWidth: '180px' }}>
                            <CardStatsVertical title={el.name} stats={`${el.students_count}`} color={'success'} />
                        </Box>
                    ))
                }
            </Box>
        </div>
    );
}

export default Stats;
