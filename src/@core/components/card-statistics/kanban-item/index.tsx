import React, { useState } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

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
import showResponseError from 'src/@core/utils/show-response-error'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { addOpenedUser } from 'src/store/apps/user'
import Status from '../../status'
import useSMS from 'src/hooks/useSMS'
import { useRouter } from 'next/router'

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
    width: 40,
    height: 40,
    marginRight: theme.spacing(4)
}))

const KanbanItem = (props: KanbarItemProps) => {

    // ** Props
    const { title, phone, status, handleEditLead, id, is_view } = props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [error, setError] = useState<any>({})
    const { t } = useTranslation()
    const [open, setOpen] = useState<'edit' | 'merge-to' | 'sms' | 'delete' | 'note' | null>(null)
    const [department, setDepartment] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<string>('tab-1')
    const [leadDetail, setLeadDetail] = useState([])

    const { total } = useSelector((state: any) => state.user)
    const [sms, setSMS] = useState<any>("")
    const { smsTemps, getSMSTemps } = useSMS()
    const { query } = useRouter()

    const dispatch = useDispatch()


    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const { data: leadData } = useSelector((state: any) => state.user)

    const handleSubmit = async (values: any) => {
        setLoading(true)
        try {
            await handleEditLead(id, { first_name: title, phone, ...values })
            setLoading(false)
            setDepartment(null)
            setOpen(null)
        } catch (err: any) {
            setLoading(false)
            showResponseError(err.response.data, setError)
        }
    }

    const smsDepartmentItem = async (values: any) => {
        setLoading(true)
        try {
            await api.post(`common/send-message-user/`, {
                users: [id],
                message: values.message,
                for_lead: true
            })
            toast.success('SMS muvaffaqiyatli jo\'natildi!', {
                position: 'top-center'
            })
            setOpen(null)
            setAnchorEl(null)
            setLoading(false)
        } catch {
            setLoading(false)
        }
    }

    const getDepartmentItem = async () => {
        setLoading(true)
        try {
            const resp = await api.get(`leads/lead-user-description/${id}/`)
            setLeadDetail(resp.data)
            console.log(resp.data);

            setLoading(false)
        } catch {
            setLoading(false)
        }
    }


    const noteDepartmentItem = async (values: any) => {
        setLoading(true)
        try {
            await api.post(`leads/lead-user-description/${id}/`, {
                anonim_user: id,
                body: values.body
            })
            getDepartmentItem()
            toast.success('Eslatma yaratildi', {
                position: 'top-center'
            })
            setOpen(null)
            setAnchorEl(null)
            setLoading(false)
        } catch {
            setLoading(false)
        }
    }


    const handleDelete = async () => {
        setLoading(true)
        try {
            await handleEditLead(id, { first_name: title, phone, is_active: false })
            setLoading(false)
            setDepartment(null)
            setOpen(null)
        } catch (err: any) {
            setLoading(false)
            showResponseError(err.response.data, setError)
        }
    }

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    const clickStudent = async () => {
        if (id === total) {
            dispatch(addOpenedUser(null))
        } else {
            dispatch(addOpenedUser(id))
            return getDepartmentItem()
        }
    }

    const togglerTab = (value: any) => {
        setActiveTab(value)
    }

    return (
        <Card sx={{ cursor: 'pointer' }}>
            <CardContent sx={{ py: theme => `${theme.spacing(2)} !important`, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
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
                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} fontSize={12}>{title} {!is_view && <Status color='success' />}</Typography>
                        <Typography fontSize={12}>{phone}</Typography>
                    </Box>
                    <IconifyIcon
                        icon="solar:menu-dots-bold"
                        style={{ marginLeft: 'auto', cursor: 'pointer' }}
                        aria-haspopup='true'
                        aria-controls='customized-menu'
                        onClick={handleClick}
                    />
                    <Box sx={{ height: '50px', width: '240px', position: 'absolute' }} onClick={() => clickStudent()}></Box>
                </Box>
                {
                    id === total ? (
                        <Box sx={{ display: 'flex', paddingTop: '10px', flexDirection: 'column', gap: '6px' }}>
                            <Box sx={{ display: 'flex', gap: '15px' }}>
                                <Typography onClick={() => togglerTab('tab-1')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-1' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-1' ? 'body1' : 'body2'}>Eslatmalar</Typography>
                                <Typography onClick={() => togglerTab('tab-2')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-2' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-2' ? 'body1' : 'body2'}>SMS tarix</Typography>
                            </Box>
                            {
                                activeTab === 'tab-1' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {
                                            leadDetail.length > 0 ? leadDetail.map((el: any) => (
                                                <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <Typography fontSize={12} fontStyle={'italic'}>{el.body}</Typography>
                                                    <Typography fontSize={12}>{el.admin} {el.created_at}</Typography>
                                                </Box>
                                            )) : <Typography variant='body2' fontSize={'12px'} fontStyle={'italic'} textAlign={'center'}>no data</Typography>
                                        }
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <Typography fontSize={12} fontStyle={'italic'}>Sms Sms Sms Sms Sms Sms Sms Sms</Typography>
                                            <Typography fontSize={12}>{'Admin'} {"18:30"}</Typography>
                                        </Box>
                                    </Box>
                                )
                            }
                        </Box>
                    ) : ""
                }
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
                {
                    query?.is_active !== 'false' ? (
                        <>
                            <MenuItem onClick={() => setOpen('note')} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='ph:flag-light' fontSize={20} />
                                Yangi eslatma
                            </MenuItem>
                            <MenuItem onClick={() => (getSMSTemps(), setOpen('sms'))} sx={{ '& svg': { mr: 2 } }}>
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
                            <MenuItem onClick={() => setOpen('delete')} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='mdi:delete' fontSize={20} />
                                O'chirish
                            </MenuItem>
                        </>
                    ) : (
                        <MenuItem onClick={() => null} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:reload' fontSize={20} />
                            Tiklash
                        </MenuItem>
                    )
                }
            </Menu>

            <Dialog open={open === 'edit'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>Lidni tahrirlash</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <Form id='ddsddsdsdsd' sx={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '5px' }} setError={setError} onSubmit={handleSubmit} valueTypes='json'>
                        <FormControl fullWidth>
                            <TextField label={t('first_name')} defaultValue={title} error={error?.first_name?.error} name='first_name' />
                            <FormHelperText error={error?.first_name?.error}>{error?.first_name?.message}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField label={t('phone')} defaultValue={phone} error={error?.phone?.error} name='phone' />
                            <FormHelperText error={error?.phone?.error}>{error?.phone?.message}</FormHelperText>
                        </FormControl>

                        <LoadingButton variant='contained' type={'submit'} loading={loading}>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>


            <Dialog open={open === 'merge-to'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>Lidni tahrirlash</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <Form id='ddsdwqdwqd' sx={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }} setError={setError} onSubmit={handleSubmit} valueTypes='json'>
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

                        <LoadingButton variant='contained' type={'submit'} loading={loading}>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* SEND SMS */}
            <Dialog open={open === 'sms'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>SMS yuborish</Typography>
                    <IconifyIcon onClick={() => setOpen(null)} icon={'material-symbols:close'} />
                </DialogTitle>

                <DialogContent sx={{ minWidth: '300px' }}>
                    <Form setError={setError} valueTypes='json' onSubmit={smsDepartmentItem} id='dxdasmowei' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl>
                            <InputLabel size='small' id='demo-simple-select-outlined-label'>Shablonlar</InputLabel>
                            <Select
                                size='small'
                                label="Shablonlar"
                                defaultValue=''
                                id='demo-simple-select-outlined'
                                labelId='demo-simple-select-outlined-label'
                                onChange={(e) => setSMS(e.target.value)}
                            >
                                {
                                    smsTemps.map((el: any) => (
                                        <MenuItem value={el.description} sx={{ wordBreak: 'break-word' }}>
                                            <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>
                                                {el.description}
                                            </span>
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>


                        <FormControl fullWidth>
                            <TextField label="SMS matni" multiline rows={4} size='small' name='message' value={sms} onChange={(e) => setSMS(e.target.value)} />
                        </FormControl>

                        <LoadingButton loading={loading} type='submit' variant='outlined'>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Notes */}
            <Dialog open={open === 'note'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Yangi eslatma</Typography>
                    <IconifyIcon onClick={() => setOpen(null)} icon={'material-symbols:close'} />
                </DialogTitle>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Form setError={setError} valueTypes='json' onSubmit={noteDepartmentItem} id='rwerwf' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl fullWidth>
                            <TextField label="Eslatma" multiline rows={4} size='small' name='body' />
                        </FormControl>

                        <LoadingButton loading={loading} type='submit' variant='outlined'>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* DELETE */}
            <Dialog open={open === 'delete'} onClose={() => setOpen(null)}>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>O'chirishni tasdiqlang</Typography>
                    <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
                        <LoadingButton variant='outlined' size='small' color='error' onClick={() => setOpen(null)}>Bekor qilish</LoadingButton>
                        <LoadingButton loading={loading} size='small' variant='contained' onClick={handleDelete}>O'chirish</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default KanbanItem
