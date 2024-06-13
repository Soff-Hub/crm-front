import React, { useState } from 'react'
import { Box, Button, Card, CardContent, Tooltip, Typography } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { addPeriodToThousands } from '../settings/office/courses'
import IconifyIcon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import getMonthName from 'src/@core/utils/gwt-month-name'
import getLessonDays from 'src/@core/utils/getLessonDays'
import useResponsive from 'src/@core/hooks/useResponsive'


export default function StudentProfile() {

    const { t } = useTranslation()
    const { isMobile } = useResponsive()
    const [groups, setGroups] = useState<any[]>([1, 2])

    return (
        <div>
            <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <CustomAvatar
                            skin='light'
                            variant='rounded'
                            color={'primary'}
                            sx={{ width: 70, height: 70, fontWeight: 600, mb: 1, fontSize: '2rem' }}
                        >
                            {getInitials("Doniyor Eshmamatov")}
                        </CustomAvatar>
                        <Box>
                            <Typography variant='h6'>{'data.first_name'}</Typography>
                            <Typography fontSize={12}>{`( ID:${'data.id'} )`}</Typography>
                        </Box>
                    </Box>
                </CardContent>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography fontSize={13} variant='body2'>{t('phone')}: </Typography>
                        <Typography fontSize={13}>{'data.phone'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography fontSize={13} variant='body2'>{t('Balans')}: </Typography>
                        <Typography fontSize={13}>{addPeriodToThousands(+1000) + " so'm"}</Typography>
                    </Box>
                </CardContent>
                {/* <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
                    <Tooltip title={t('Xabar (sms)')} placement='bottom'>
                        <Button size='small' color="warning">
                            <IconifyIcon icon='material-symbols-light:sms-outline' />
                        </Button>
                    </Tooltip>
                    <Tooltip title={t("Tahrirlash")} placement='bottom'>
                        <Button size='small' color='success'>
                            <IconifyIcon icon='iconamoon:edit-thin' />
                        </Button>
                    </Tooltip>
                </Box> */}
            </Card>
            <Typography sx={{ fontSize: '20px', mt: 4 }}>{"Guruhlar"}</Typography>
            <Box sx={{ display: 'flex', gap: '15px', mb: 3, mt: 3, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                {
                    groups.map((group: any) => (
                        <Link key={'group.id'} href={`/student-profile/group/${'group.id'}&month=${getMonthName(null)}`} style={{ textDecoration: 'none', display: 'block', maxWidth: '400px', width: '100%', minWidth: '290px' }}>
                            <Box sx={{ display: 'flex', gap: '20px', width: '100%' }} >
                                <Card sx={{ width: '100%' }}>
                                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <Typography sx={{ fontSize: '12px' }}>{"Ingiliz tili 001"}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>{'Ingiliz tili'}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>{"Teacher A'zam"}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                                            <Typography sx={{ fontSize: '12px' }}>{'Toq kunlari'} {'16:00'}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>Boshlangan: {'12-01-2024'}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>Yakunlanadi: {'12-07-2024'}</Typography>
                                        </Box>
                                    </CardContent>
                                    {/* <CardContent sx={{ display: 'flex', justifyContent: 'space-between', minWidth: '320px' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            <Typography sx={{ fontSize: '12px' }}>{group.name}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>{group.course_name}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>{group.teacher_name}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: ' flex-end', gap: '5px' }}>
                                            <Typography sx={{ fontSize: '12px' }}>{getLessonDays(group.week_days)} {group.start_at.split(':').splice(0, 2).join(':')} - {group.end_at.split(':').splice(0, 2).join(':')}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>Boshlangan: {group.start_date}</Typography>
                                            <Typography sx={{ fontSize: '12px' }}>Yakunlanadi: {group.end_date}</Typography>
                                        </Box>
                                    </CardContent> */}
                                </Card>
                            </Box>
                        </Link>
                    ))
                }
            </Box>
        </div>
    )
}