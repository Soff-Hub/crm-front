import React, { useState } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

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
import useBranches from 'src/hooks/useBranch'
import useGroups from 'src/hooks/useGroups'
import { formatDateTime } from 'src/@core/utils/date-formatter'

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
    width: 40,
    height: 40,
    marginRight: theme.spacing(4)
}))


export const today = `${new Date().getFullYear()}-${(new Date().getMonth() + 1) > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`}-${new Date().getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`}`



const KanbanItem = (props: KanbarItemProps) => {

    // ** Props
    const { title, phone, status, handleEditLead, id, is_view, reRender } = props
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [error, setError] = useState<any>({})
    const { t } = useTranslation()
    const [open, setOpen] = useState<'edit' | 'merge-to' | 'sms' | 'delete' | 'note' | 'branch' | 'recover' | 'add-group' | null>(null)
    const [department, setDepartment] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<string>('tab-1')
    const [leadDetail, setLeadDetail] = useState([])

    const { total, departmentsState } = useSelector((state: any) => state.user)
    const [sms, setSMS] = useState<any>("")
    const { smsTemps, getSMSTemps } = useSMS()
    const { query } = useRouter()
    const { branches, getBranches } = useBranches()
    const { getGroups, groups } = useGroups()

    const [selectBranch, setSelectBranch] = useState<any>(null)
    const [selectDepartment, setSelectDepartment] = useState<any>([])
    const [selectDepartmentItem, setSelectDepartmentItem] = useState<any>(null)

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

    const changeBranch = async (values: any) => {
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
            toast.success(`${t("SMS muvaffaqiyatli jo'natildi!")}`, {
                position: 'top-center'
            })
            setOpen(null)
            setAnchorEl(null)
            setLoading(false)
        } catch {
            setLoading(false)
        }
    }

    const getDepartmentItem = async (endpoint: 'lead-user-description' | 'anonim-user' | 'sms-history') => {
        setLoading(true)
        try {
            const resp = await api.get(`leads/${endpoint}/${id}/`)
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
            getDepartmentItem('lead-user-description')
            toast.success(`${t("Eslatma yaratildi")}`, {
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
            if (activeTab === 'tab-1') {
                getDepartmentItem('anonim-user')
            } else if (activeTab === 'tab-2') {
                getDepartmentItem('lead-user-description')
            } else {
                getDepartmentItem('sms-history')
            }
        }
    }

    const togglerTab = (value: any) => {
        if (value === 'tab-1') {
            getDepartmentItem('anonim-user')
        } else if (value === 'tab-2') {
            getDepartmentItem('lead-user-description')
        } else {
            getDepartmentItem('sms-history')
        }
        setActiveTab(value)
    }

    const recoverDepartmentItem = async (values: any) => {
        setLoading(true)
        try {
            await handleEditLead(id, { ...values, is_active: true, first_name: title, phone })
            setLoading(false)
            setOpen(null)
        } catch {
            setLoading(false)
        }
    }

    const addToGroup = async (values: any) => {
        setLoading(true)
        try {
            const resp = await api.post(`leads/lead-to-student/`, {
                lead: id,
                ...values
            })
            toast.success(`${resp.data?.msg}`)
            setLoading(false)
            setDepartment(null)
            reRender(false)
            setOpen(null)
        } catch (err: any) {
            setLoading(false)
            toast.error(JSON.stringify(err.response.data), { position: 'bottom-center' })
            showResponseError(err.response.data, setError)
        }
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
                                <Typography onClick={() => togglerTab('tab-1')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-1' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-1' ? 'body1' : 'body2'}>{t("Malumtlari")}</Typography>
                                <Typography onClick={() => togglerTab('tab-2')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-2' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-2' ? 'body1' : 'body2'}>{t("Eslatmalar")}</Typography>
                                <Typography onClick={() => togglerTab('tab-3')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-3' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-3' ? 'body1' : 'body2'}>{t("SMS tarix")}</Typography>
                            </Box>
                            {
                                activeTab === 'tab-1' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {
                                            leadDetail.length > 0 ? leadDetail.map((el: any) => (
                                                <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: el?.variants?.length ? '0px' : '6px' }}>
                                                    <Typography fontSize={12}>Savol: {el.application_form}</Typography>
                                                    <Typography fontSize={12}>{el.admin} {el.answer}</Typography>
                                                    {
                                                        el?.variants?.map((item: any) => <Typography style={{ display: 'flex', alignItems: 'center' }} fontSize={10}><Checkbox size='small' checked={item?.is_checked} /> {item.value}</Typography>)
                                                    }
                                                </Box>
                                            )) : <Typography variant='body2' fontSize={'12px'} fontStyle={'italic'} textAlign={'center'}>{t("Bo'sh")}</Typography>
                                        }
                                    </Box>
                                ) : activeTab === 'tab-2' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {
                                            leadDetail.length > 0 ? leadDetail.map((el: any) => (
                                                <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <Typography fontSize={12} fontStyle={'italic'}>{el.body}</Typography>
                                                    <Typography fontSize={12}>{el.admin} {el.created_at}</Typography>
                                                </Box>
                                            )) : <Typography variant='body2' fontSize={'12px'} fontStyle={'italic'} textAlign={'center'}>{t("Bo'sh")}</Typography>
                                        }
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {
                                            leadDetail.length > 0 ? leadDetail.map((el: any) => (
                                                <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <Typography fontSize={12} fontStyle={'italic'}>{el.message}</Typography>
                                                    <Typography fontSize={12}>{el.user} {formatDateTime(el.created_at)}</Typography>
                                                </Box>
                                            )) : <Typography variant='body2' fontSize={'12px'} fontStyle={'italic'} textAlign={'center'}>{t("Bo'sh")}</Typography>
                                        }
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
                        <Box>
                            <MenuItem onClick={() => setOpen('note')} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='ph:flag-light' fontSize={20} />
                                {t("Yangi eslatma")}
                            </MenuItem>
                            <MenuItem onClick={() => (getSMSTemps(), setOpen('sms'))} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='mdi:sms' fontSize={20} />
                                {t("SMS yuborish")}
                            </MenuItem>
                            <MenuItem onClick={() => (getBranches(), setOpen('branch'))} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='system-uicons:branch' fontSize={20} />
                                {t("Boshqa Filialga")}
                            </MenuItem>
                            <MenuItem onClick={() => setOpen('merge-to')} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='subway:round-arrow-2' fontSize={17} />
                                {t("Boshqa bo'limga")}
                            </MenuItem>
                            <MenuItem onClick={() => (getGroups(), setOpen('add-group'))} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='material-symbols:group-add' fontSize={17} />
                                {t("Guruhga qo'shish")}
                            </MenuItem>
                            <MenuItem onClick={() => setOpen('edit')} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='mdi:edit' fontSize={20} />
                                {t("Tahrirlash")}
                            </MenuItem>
                            <MenuItem onClick={() => setOpen('delete')} sx={{ '& svg': { mr: 2 } }}>
                                <IconifyIcon icon='mdi:delete' fontSize={20} />
                                {t("O'chirish")}
                            </MenuItem>
                        </Box>
                    ) : (
                        <MenuItem onClick={() => setOpen('recover')} sx={{ '& svg': { mr: 2 } }}>
                            <IconifyIcon icon='mdi:reload' fontSize={20} />
                            Tiklash
                        </MenuItem>
                    )
                }
            </Menu>

            <Dialog open={open === 'add-group'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{t("Guruhga qo'shish")}</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <Form id='xsddnerernererera' sx={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }} setError={setError} onSubmit={addToGroup} valueTypes='json'>
                        <FormControl fullWidth>
                            <InputLabel size='small'>{t("Guruh")}</InputLabel>
                            <Select size='small' label={t("Guruh")} error={error?.group?.error} name='group' defaultValue={''} >
                                {
                                    groups.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={error?.group?.error}>{error?.group?.message}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField size='small' type='date' name='added_at' label={t("Qo'shilish sanasi")} defaultValue={today} />
                            <FormHelperText error={error?.added_at?.error}>{error?.added_at?.message}</FormHelperText>
                        </FormControl>

                        <LoadingButton variant='contained' type={'submit'} loading={loading}>{t("Saqlash")}</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={open === 'edit'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{t("Lidni tahrirlash")}</Typography>
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

                        <LoadingButton variant='contained' type={'submit'} loading={loading}>{t("Saqlash")}</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>


            <Dialog open={open === 'merge-to'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{t("Boshqa bo'limga")}</Typography>
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

                        <LoadingButton variant='contained' type={'submit'} loading={loading}>{t("Saqlash")}</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={open === 'branch'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{t("Boshqa Filialga")}</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <Form id='ddsdwqdasdasdasddwqd' sx={{ minWidth: '280px', maxWidth: '350px', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '5px' }} setError={setError} onSubmit={changeBranch} valueTypes='json'>
                        <FormControl fullWidth>
                            <InputLabel>{t("branch")}</InputLabel>
                            <Select label={t("branch")} error={error?.branch?.error} name='branch' defaultValue={''} onChange={async (e) => {
                                const resp = await api.get(`leads/department/parent/?branch=${e.target.value}`)
                                setSelectDepartment(resp.data.results)
                            }} >
                                {
                                    branches.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={error?.branch?.error}>{error?.branch?.message}</FormHelperText>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>{t("Bo'lim")}</InputLabel>
                            <Select label={t("Bo'lim")} error={error?.department_parent?.error} name='department_parent' defaultValue={''} onChange={async (e) => {
                                const resp = await api.get(`leads/department/child/?parent=${e.target.value}`)
                                setSelectDepartmentItem(resp.data.results)
                            }} >
                                {
                                    selectDepartment.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={error?.department_parent?.error}>{error?.department_parent?.message}</FormHelperText>
                        </FormControl>

                        {selectDepartmentItem && <FormControl fullWidth>
                            <InputLabel>{t("Bo'lim")}</InputLabel>
                            <Select label={t("Bo'lim")} error={error?.department?.error} name='department' defaultValue={''}>
                                {
                                    selectDepartmentItem.map((el: any) => <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>)
                                }
                            </Select>
                            <FormHelperText error={error?.department?.error}>{error?.department?.message}</FormHelperText>
                        </FormControl>}

                        <LoadingButton variant='contained' type={'submit'} loading={loading}>{t("Saqlash")}</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* SEND SMS */}
            <Dialog open={open === 'sms'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{t("SMS yuborish")}</Typography>
                    <IconifyIcon onClick={() => setOpen(null)} icon={'material-symbols:close'} />
                </DialogTitle>

                <DialogContent sx={{ minWidth: '300px' }}>
                    <Form setError={setError} valueTypes='json' onSubmit={smsDepartmentItem} id='dxdasmowei' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl>
                            <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Shablonlar")}</InputLabel>
                            <Select
                                size='small'
                                label={t("Shablonlar")}
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
                            <TextField label={t("SMS matni")} multiline rows={4} size='small' name='message' value={sms} onChange={(e) => setSMS(e.target.value)} />
                        </FormControl>

                        <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Saqlash")}</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Notes */}
            <Dialog open={open === 'note'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{t("Yangi eslatma")}</Typography>
                    <IconifyIcon onClick={() => setOpen(null)} icon={'material-symbols:close'} />
                </DialogTitle>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Form setError={setError} valueTypes='json' onSubmit={noteDepartmentItem} id='rwerwf' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl fullWidth>
                            <TextField label={t("Eslatma")} multiline rows={4} size='small' name='body' />
                        </FormControl>

                        <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Saqlash")}</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* DELETE */}
            <Dialog open={open === 'delete'} onClose={() => setOpen(null)}>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>{t("O'chirishni tasdiqlang")}</Typography>
                    <Form setError={setError} valueTypes='json' onSubmit={noteDepartmentItem} id='rwerwf' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl fullWidth>
                            <TextField label={t("Sabab (majburiy emas)")} multiline rows={4} size='small' name='body' />
                        </FormControl>

                        <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
                            <LoadingButton variant='outlined' size='small' color='error' onClick={() => setOpen(null)}>{t("Bekor qilish")}</LoadingButton>
                            <LoadingButton loading={loading} type='submit' size='small' variant='contained' onClick={handleDelete}>{t("O'chirish")}</LoadingButton>
                        </Box>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={open === 'recover'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{t("Tiklash")}</Typography>
                    <IconifyIcon onClick={() => setOpen(null)} icon={'material-symbols:close'} />
                </DialogTitle>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Form setError={setError} valueTypes='json' onSubmit={recoverDepartmentItem} id='dasweq423' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl>
                            <InputLabel size='small' id='demo-simple-select-outlined-label'>{t("Bo'lim")}</InputLabel>
                            <Select
                                size='small'
                                label={t("Bo'lim")}
                                defaultValue=''
                                id='demo-simple-select-outlined'
                                labelId='demo-simple-select-outlined-label'
                                onChange={(e) => setSelectBranch(e.target.value)}
                            >
                                {
                                    departmentsState.map((el: any) => (
                                        <MenuItem value={el.id} sx={{ wordBreak: 'break-word' }}>
                                            {el.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        {selectBranch && <FormControl>
                            <InputLabel size='small' id='wrwerwerwerwerwerwe'>{t("Bo'lim")}</InputLabel>
                            <Select
                                size='small'
                                label={t("Bo'lim")}
                                defaultValue=''
                                id='osdlg'
                                labelId='wrwerwerwerwerwerwe'
                                name='department'
                            >
                                {
                                    departmentsState.find((item: any) => item.id === selectBranch).children.map((el: any) => (
                                        <MenuItem value={el.id} sx={{ wordBreak: 'break-word' }}>
                                            {el.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>}

                        <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Saqlash")}</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default KanbanItem
