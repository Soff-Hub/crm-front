import { Box, Button, Card, CardActions, CardContent, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from 'src/context/AuthContext';
import { useAppDispatch, useAppSelector } from 'src/store';
import CustomChip from 'src/@core/components/mui/chip';
import { ThemeColor } from 'src/@core/layouts/types';
import getLessonDays from 'src/@core/utils/getLessonDays';
import { addPeriodToThousands } from 'src/pages/settings/office/courses';
import IconifyIcon from 'src/@core/components/icon';
import { getSMSTemp, handleEditClickOpen } from 'src/store/apps/groupDetails';

interface ColorsType {
    [key: string]: ThemeColor
}

const roleColors: ColorsType = {
    ceo: 'error',
    admin: 'info',
    teacher: 'warning',
    director: 'success',
}


export default function GroupDetails() {
    const { groupData } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    console.log(groupData);

    const { user } = useContext(AuthContext)
    const { t } = useTranslation()

    const handleOpenSendSMSModal = async () => {
        dispatch(handleEditClickOpen('send-sms'))
        await dispatch(getSMSTemp())
    }

    return (
        <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography>Guruh:</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>{groupData?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography>{t("O'quvchilar soni")}</Typography>
                    <Typography>{groupData?.student_count}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography>{t("Kurs")}:</Typography>
                    {
                        !(user?.role.length === 1 && user?.role.includes('teacher')) ? (
                            <Link href={`/settings/office/courses/`}>
                                <CustomChip
                                    skin='light'
                                    size='small'
                                    label={groupData?.course_data?.name}
                                    color={roleColors['director']}
                                    sx={{
                                        height: 20,
                                        fontWeight: 600,
                                        borderRadius: '5px',
                                        fontSize: '0.875rem',
                                        textTransform: 'capitalize',
                                        '& .MuiChip-label': { mt: -0.25 },
                                        cursor: 'pointer'
                                    }}
                                />
                            </Link>
                        ) : (
                            <CustomChip
                                skin='light'
                                size='small'
                                label={groupData?.course_data.name}
                                color={roleColors['director']}
                                sx={{
                                    height: 20,
                                    fontWeight: 600,
                                    borderRadius: '5px',
                                    fontSize: '0.875rem',
                                    textTransform: 'capitalize',
                                    '& .MuiChip-label': { mt: -0.25 },
                                    cursor: 'pointer'
                                }}
                            />
                        )
                    }

                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography>{t("Dars vaqti")}:</Typography>
                    <Typography>{getLessonDays(groupData?.day_of_week || "")} {groupData?.start_at}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography>{t("Dars xonasi")}:</Typography>
                    <Typography>{groupData?.room_data?.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {
                        !(user?.role.length === 1 && user?.role.includes('teacher')) ? (
                            <Box sx={{ display: 'flex' }}>
                                <Typography sx={{ mr: 2 }}>{t("O'qituvchi")}:</Typography>
                                <Link href={`/mentors/view/security/?id=${groupData?.teacher_data?.id}`}>
                                    <Typography>
                                        {groupData?.teacher_data?.first_name}
                                    </Typography>
                                </Link>
                            </Box>
                        ) : ''
                    }
                    <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ mr: 2 }}>{t("Ochilgan sana")}:</Typography>
                        <Typography>{groupData?.start_date?.split('-').reverse().join(',')}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography>{t("branch")}:</Typography>
                    <CustomChip
                        skin='light'
                        size='small'
                        label={groupData?.branch_data?.name}
                        color={roleColors['director']}
                        sx={{
                            height: 20,
                            fontWeight: 600,
                            borderRadius: '5px',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { mt: -0.25 }
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Typography>{t("Kurs narxi")}:</Typography>
                    <CustomChip
                        skin='light'
                        size='small'
                        label={addPeriodToThousands(+groupData?.monthly_amount) + " so'm"}
                        color={'secondary'}
                        sx={{
                            height: 20,
                            fontWeight: 600,
                            borderRadius: '5px',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { mt: -0.25 }
                        }}
                    />
                </Box>
            </CardContent>
            {
                !(user?.role.length === 1 && user?.role.includes('teacher')) ? (
                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="O'chirish" placement='top'>
                            <Button variant='outlined' color='error' onClick={() => dispatch(handleEditClickOpen('delete'))}>
                                <IconifyIcon icon='mdi-light:delete' />
                            </Button>
                        </Tooltip>
                        {/* <Tooltip title={t('Tahrirlash')} placement='top'>
                            <Button variant='outlined' color='success' onClick={() =>
                                dispatch(handleEditClickOpen('edit'))
                            }>
                                <IconifyIcon icon='circum:edit' />
                            </Button>
                        </Tooltip> */}
                        <Tooltip title="SMS yuborish" placement='top'>
                            <Button variant='outlined' color="warning" onClick={handleOpenSendSMSModal}>
                                <IconifyIcon icon='material-symbols-light:sms-outline' />
                            </Button>
                        </Tooltip>
                        <Tooltip title="O'quvchi qo'shish" placement='top'>
                            <Button variant='outlined' onClick={() => dispatch(handleEditClickOpen('add-student'))}>
                                <IconifyIcon icon='mdi:user-add-outline' />
                            </Button>
                        </Tooltip>
                    </CardActions>
                ) : ''}
        </Card>
    )
}