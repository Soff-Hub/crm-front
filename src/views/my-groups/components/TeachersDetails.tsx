import { Box, Button, Card, CardContent, Grid, Tooltip, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from "src/@core/utils/get-initials"
import CustomChip from 'src/@core/components/mui/chip'
import { ThemeColor } from "src/@core/layouts/types"
import { useAppSelector } from "src/store"
import IconifyIcon from "src/@core/components/icon"
import { useState } from "react"
import EditProfile from "./EditProfile"

interface ColorsType {
    [key: string]: ThemeColor
}

const roleColors: ColorsType = {
    ceo: 'error',
    admin: 'info',
    teacher: 'warning',
    director: 'success',
}

const branchColors: ColorsType = {
    4: 'warning',
    2: 'error',
    3: 'success',
    1: 'info',
}

export default function TeachersDetails() {
    const { t } = useTranslation()
    const { groups } = useAppSelector(state => state.groups)
    const [isEdit, setEdit] = useState(false)

    const user = JSON.parse(localStorage.getItem("userData") as string)

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardContent sx={{ pt: 5, display: 'flex', gap: 5 }}>
                        {user?.image ? (
                            <CustomAvatar
                                src={user.image}
                                variant='rounded'
                                alt={user.first_name}
                                sx={{ width: 120, height: 120, fontWeight: 600, fontSize: '3rem' }}
                            />
                        ) : (
                            <CustomAvatar
                                skin='light'
                                variant='rounded'
                                color={'primary'}
                                sx={{ width: 120, height: 120, fontWeight: 600, fontSize: '3rem' }}
                            >
                                {getInitials(user.first_name)}
                            </CustomAvatar>
                        )}
                        <Box>
                            <Typography variant='h6'>
                                {user.first_name}
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0px', gap: 10 }}>
                                <Typography variant='body2'>{t("Faol Guruhlari")}:  </Typography>
                                <Typography variant='body1' sx={{ lineHeight: 1.3 }}>
                                    {groups?.length || 0} ta
                                </Typography>
                            </div>
                            <Box style={{ width: "100%", display: "flex", justifyContent: "start", }}>
                                <Tooltip title={t("Tahrirlash")} placement='bottom'>
                                    <Button size='small' onClick={() => setEdit(true)}>
                                        <IconifyIcon icon='iconamoon:edit-thin' />
                                    </Button>
                                </Tooltip>
                            </Box>
                        </Box>
                    </CardContent>

                    <CardContent>
                        <Typography variant='h6' sx={{ textAlign: 'center', mb: 4 }}>{t("Boshqa Tafsilotlar")}</Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t("Tizimdagi rollari")}</Typography>: {
                                user.roles.map((role: any) => {
                                    return role.exists ? (<CustomChip
                                        key={role.id}
                                        skin='light'
                                        size='small'
                                        label={role.name}
                                        color={roleColors[role.name.toLocaleLowerCase()]}
                                        sx={{
                                            height: 20,
                                            fontWeight: 600,
                                            borderRadius: '5px',
                                            fontSize: '0.875rem',
                                            textTransform: 'capitalize',
                                            '& .MuiChip-label': { mt: -0.25 }
                                        }}
                                    />) : ''
                                })
                            }
                        </Box>
                        <Box sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', mb: 2.7 }}>
                                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t("phone")}:</Typography>
                                <Typography variant='body2'>{user.phone}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ pb: 1 }}>
                            <Box sx={{ display: 'flex', mb: 2.7 }}>
                                <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t("Biriktirilgan Filiallar")}:</Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                                    {
                                        user.branches.map((branch: any, index: number) => {
                                            return branch.exists ? (<CustomChip
                                                key={index}
                                                skin='light'
                                                size='small'
                                                label={branch.name}
                                                color={branchColors[index + 1]}
                                                sx={{
                                                    height: 20,
                                                    fontWeight: 600,
                                                    borderRadius: '5px',
                                                    fontSize: '0.875rem',
                                                    textTransform: 'capitalize',
                                                    '& .MuiChip-label': { mt: -0.25 }
                                                }}
                                            />) : ''
                                        })
                                    }
                                </Box>
                            </Box>
                        </Box>
                        <EditProfile isOpen={isEdit} setEdit={setEdit} />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
