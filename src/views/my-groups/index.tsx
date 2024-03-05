import { Box, Card, CardContent, Typography } from '@mui/material'
import Link from 'next/link'
import React, { useEffect } from 'react'
import getMonthName from 'src/@core/utils/gwt-month-name'
import useGroups from 'src/hooks/useGroups'


export default function MyGroups() {
    const { groups, getGroups } = useGroups()

    const getData = async () => {
        await getGroups()
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <Typography sx={{ mb: 3 }}>Mening guruhlarim</Typography>
            <Box sx={{ display: 'flex', gap: '15px', mb: 3, flexWrap: 'wrap' }}>
                {
                    groups.map((group: any) => (
                        <Link key={'group.id'} href={`/groups/view/security/?id=${1}&moonth=${getMonthName(null)}`} style={{ textDecoration: 'none' }}>
                            <Box sx={{ display: 'flex', gap: '20px' }} >
                                <Card>
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '320px' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <Typography sx={{ fontSize: '12px' }}>{group.name}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>{group.course_name}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>{group.teacher_name}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                                            <Typography sx={{ fontSize: '12px' }}>{group.start_at.split(':').splice(0, 2).join(':')} - {group.end_at.split(':').splice(0, 2).join(':')}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>Boshlangan: {group.start_date}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>Yakunlanadi: {group.end_date}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Link>
                    ))
                }
            </Box>
        </div>
    )
}
