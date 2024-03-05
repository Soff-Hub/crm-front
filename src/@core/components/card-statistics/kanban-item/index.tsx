import React, { useState } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { Box, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
    '& .MuiMenu-paper': {
        border: `1px solid${theme.palette.divider}`
    }
}))

// Styled MenuItem component
// const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
//     '&:focus': {
//         backgroundColor: theme.palette.primary.main,
//         '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//             color: theme.palette.common.white
//         }
//     }
// }))

import Card from '@mui/material/Card'
import { AvatarProps } from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import IconifyIcon from 'src/@core/components/icon'

// ** Types Imports
import { KanbarItemProps } from 'src/@core/components/card-statistics/types'
import { useSelector } from 'react-redux'
import Form from '../../form'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
    width: 40,
    height: 40,
    marginRight: theme.spacing(4)
}))

const KanbanItem = (props: KanbarItemProps) => {

    // ** Props
    const { title, phone, status } = props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [error, setError] = useState<any>({})
    const { t } = useTranslation()
    const [open, setOpen] = useState<'edit' | 'merge-to' | null>(null)
    const [department, setDepartment] = useState<any>(null)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const { data: leadData } = useSelector((state: any) => state.user)

    // const handleClose = () => {
    //     setAnchorEl(null)
    // }

    const handleSubmit = async () => { }


    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    return (
        <Card sx={{ cursor: 'pointer' }}>
            <CardContent sx={{ py: theme => `${theme.spacing(2)} !important`, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar skin='light' color={status === "new" ? "secondary" : status === "pending" ? "warning" : "success"} variant='rounded'>
                        <IconifyIcon
                            icon={status === "new" ?
                                "mdi:user-alert-outline" :
                                status === "pending" ?
                                    "mdi:user-clock-outline" :
                                    "mdi:user-check-outline"}
                        />
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography fontSize={12}>{title}</Typography>
                        <Typography fontSize={12}>{phone}</Typography>
                    </Box>
                    <IconifyIcon
                        icon="solar:menu-dots-bold"
                        style={{ marginLeft: 'auto', cursor: 'pointer' }}
                        aria-haspopup='true'
                        aria-controls='customized-menu'
                        onClick={handleClick}
                    />
                </Box>
            </CardContent>

            <Menu
                keepMounted
                anchorEl={anchorEl}
                open={rowOptionsOpen}
                onClose={handleRowOptionsClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{ style: { minWidth: '8rem' } }}
            >
                <MenuItem onClick={undefined} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:sms' fontSize={20} />
                    SMS yuborish
                </MenuItem>
                <MenuItem onClick={() => setOpen('merge-to')} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='subway:round-arrow-2' fontSize={17} />
                    Boshqa bo'limga
                </MenuItem>
                <MenuItem onClick={() => setOpen('edit')} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:edit' fontSize={20} />
                    Tahrirlash
                </MenuItem>
                <MenuItem onClick={undefined} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete' fontSize={20} />
                    O'chirish
                </MenuItem>
            </Menu>

            <Dialog open={open === 'edit'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>Lidni tahrirlash</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <Form id='ddsd' sx={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '5px' }} setError={setError} onSubmit={handleSubmit} valueTypes='json'>
                        <FormControl fullWidth>
                            <TextField label={t('first_name')} defaultValue={title} error={error?.first_name?.error} name='first_name' />
                            <FormHelperText error={error?.first_name?.error}>{error?.first_name?.message}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField label={t('phone')} defaultValue={phone} error={error?.phone?.error} name='phone' />
                            <FormHelperText error={error?.phone?.error}>{error?.phone?.message}</FormHelperText>
                        </FormControl>

                        <LoadingButton variant='contained'>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>


            <Dialog open={open === 'merge-to'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>Lidni tahrirlash</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <Form id='ddsd' sx={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }} setError={setError} onSubmit={handleSubmit} valueTypes='json'>
                        <FormControl fullWidth>
                            <InputLabel>{t("Bo'lim")}</InputLabel>
                            <Select label={t("Bo'lim")} error={error?.department?.error} name='department' defaultValue={''} onChange={(e) => setDepartment(e.target.value)} >
                                {
                                    leadData.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={error?.department?.error}>{error?.department?.message}</FormHelperText>
                        </FormControl>

                        {department && <FormControl fullWidth>
                            <InputLabel>{t("Bo'lim")}</InputLabel>
                            <Select label={t("Bo'lim")} error={error?.department?.error} name='department' defaultValue={''}>
                                {
                                    leadData.find((item: any) => item.id === department).children.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={error?.department?.error}>{error?.department?.message}</FormHelperText>
                        </FormControl>}

                        <LoadingButton variant='contained'>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default KanbanItem
