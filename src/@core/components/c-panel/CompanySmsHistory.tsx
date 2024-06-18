import { Box, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import IconifyIcon from '../icon'
import { datatimeFormatCustome } from 'src/@core/utils/time-formatter'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import { useRouter } from 'next/router'

type Props = {}

export default function CompanySmsHistory({ }: Props) {

    const [sms, setSms] = useState<any>([])
    const { isMobile } = useResponsive()
    const { query } = useRouter()


    const getSms = async () => {
        const resp = await api.get(`owner/sms-history/${query?.slug}/`)
        setSms(resp.data)
    }

    useEffect(() => {
        getSms()
    }, [])

    return (
        <Box sx={{ display: 'flex', gap: '15px', mt: 3, flexWrap: 'no-wrap', justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: 'column', maxHeight: '400px', overflowY: 'scroll' }}>
            <Typography sx={{ fontSize: '20px' }}>{"Xabarlar tarixi"}</Typography>
            {
                sms.map((group: any) => (
                    <Box key={group.id} style={{ textDecoration: 'none', display: 'block', maxWidth: '400px', width: '100%', minWidth: '300px' }}>
                        <Card sx={{ width: '100%', padding: 0 }}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', p: '6px', flexDirection: 'column' }}>
                                <Typography sx={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <IconifyIcon icon={'lets-icons:message-fill'} color='orange' />
                                    <span>{group.created_at.split('-').reverse().join('/')}</span>
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '5px' }}>
                                    <Typography sx={{ fontSize: '12px', fontStyle: 'italic' }}>{group.message}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))
            }
        </Box>
    )
}