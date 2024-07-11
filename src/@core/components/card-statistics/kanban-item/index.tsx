import React, { useEffect, useState } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'

import { Box, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

import Card from '@mui/material/Card'
import { AvatarProps } from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import IconifyIcon from 'src/@core/components/icon'

// ** Types Imports
import { KanbarItemProps } from 'src/@core/components/card-statistics/types'
import Form from '../../form'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'
import showResponseError from 'src/@core/utils/show-response-error'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { addOpenedUser } from 'src/store/apps/user'
import Status from '../../status'
import useSMS from 'src/hooks/useSMS'
import useBranches from 'src/hooks/useBranch'
import useGroups from 'src/hooks/useGroups'
import { useAppDispatch, useAppSelector } from 'src/store'
import KanbanItemMenu from './KanbanItemMenu'
import EditAnonimDialogDialog from 'src/views/apps/lids/anonimUser/EditAnonimUserDialog'
import AddToGroupForm from 'src/views/apps/lids/anonimUser/AddToGroupForm'
import MergeToDepartment from 'src/views/apps/lids/anonimUser/MergeForm'
import SendSmsAnonimUserForm from 'src/views/apps/lids/anonimUser/SendSmsAnonimUserForm'
import AddNoteAnonimUser from 'src/views/apps/lids/anonimUser/AddNoteAnonimUser'

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
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<string>('tab-2')
    const [leadDetail, setLeadDetail] = useState([])

    const { total } = useAppSelector((state) => state.user)
    const { queryParams } = useAppSelector((state) => state.leads)
    const { smsTemps, getSMSTemps } = useSMS()
    const { branches, getBranches } = useBranches()
    const { getGroups, groups } = useGroups()

    const [selectBranch, setSelectBranch] = useState<any>(null)
    const [selectDepartment, setSelectDepartment] = useState<any>([])
    const [selectDepartmentItem, setSelectDepartmentItem] = useState<any>(null)
    const [departmentsState, setDepartmentsState] = useState<{ id: number, children: [] }[]>([])

    const dispatch = useAppDispatch()


    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
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


    const getDepartmentItem = async (endpoint: 'lead-user-description' | 'anonim-user' | 'sms-history') => {
        setLoading(true)
        setLoadingDetail(true)
        try {
            const resp = await api.get(`leads/${endpoint}/${id}/`)
            setLeadDetail(resp.data)

            setLoading(false)
        } catch {
            setLoading(false)
        }
        setLoadingDetail(false)
    }


    const noteDepartmentItem = async (values: any) => {
        setLoading(true)
        try {
            await api.post(`leads/lead-user-description/${id}/`, {
                anonim_user: id,
                body: values.body
            })
            await getDepartmentItem('lead-user-description')
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

    function togglerTab(value: any) {
        setLoadingDetail(true)
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


    const getLeadData = async () => {
        const resp = await api.get(`leads/department/list/`, { params: { ...queryParams, is_active: true } })
        setDepartmentsState(resp.data)
    }

    useEffect(() => {
        getLeadData()
        if (activeTab === 'tab-1') {
            getDepartmentItem('anonim-user')
        } else if (activeTab === 'tab-2') {
            getDepartmentItem('lead-user-description')
        } else {
            getDepartmentItem('sms-history')
        }
    }, [])


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
                                <Typography onClick={() => togglerTab('tab-2')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-2' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-2' ? 'body1' : 'body2'}>{t("Eslatmalar")}</Typography>
                                <Typography onClick={() => togglerTab('tab-1')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-1' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-1' ? 'body1' : 'body2'}>{t("Malumtlari")}</Typography>
                                <Typography onClick={() => togglerTab('tab-3')} sx={{ fontSize: '12px', borderBottom: activeTab === 'tab-3' ? '2px solid #0d6efd' : '2px solid #c3cccc', px: 1 }} variant={activeTab === 'tab-3' ? 'body1' : 'body2'}>{t("SMS tarix")}</Typography>
                            </Box>
                            {
                                loadingDetail ? <CircularProgress disableShrink sx={{ mt: 1, mb: 2, mx: 'auto' }} size={25} /> : activeTab === 'tab-1' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {
                                            leadDetail.length > 0 ? leadDetail.map((el: any) => (
                                                <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: el?.variants?.length ? '0px' : '6px' }}>
                                                    <Typography fontSize={12}>{t('Savol')}: {el.application_form}</Typography>
                                                    <Typography fontSize={12}>Javob:{el.admin} {el.answer}</Typography>
                                                    {
                                                        el?.variants?.map((item: any) => <Typography style={{ display: 'flex', alignItems: 'center' }} fontSize={10}><Checkbox size='small' checked={item?.is_checked} /> {item.value}</Typography>)
                                                    }
                                                </Box>
                                            )) : <Typography variant='body2' fontSize={'12px'} fontStyle={'italic'} textAlign={'center'} my={5}>{t("Bo'sh")}</Typography>
                                        }
                                    </Box>
                                ) : activeTab === 'tab-2' ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {
                                            leadDetail.length > 0 ? leadDetail.map((el: any) => (
                                                <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <Typography fontSize={12} fontStyle={'italic'}>{el.body}</Typography>
                                                    <Typography fontSize={12}>{el.admin} {el.created_at.split(' ')[0].split('-').reverse().join('/')} {el.created_at.split(' ')[1].split('-').join(':')}</Typography>
                                                </Box>
                                            )) : <Typography variant='body2' fontSize={'12px'} fontStyle={'italic'} textAlign={'center'} my={5}>{t("Bo'sh")}</Typography>
                                        }
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {
                                            leadDetail.length > 0 ? leadDetail.map((el: any) => (
                                                <Box sx={{ border: '1px solid #c3cccc', padding: '5px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <Typography fontSize={12} fontStyle={'italic'}>{el.message}</Typography>
                                                    <Typography fontSize={12}>{el.admin} {el.created_at.split(' ')[0].split('-').reverse().join('/')} {el.created_at.split(' ')[1].split('-').join(':')}</Typography>
                                                </Box>
                                            )) : <Typography variant='body2' fontSize={'12px'} fontStyle={'italic'} textAlign={'center'} my={5}>{t("Bo'sh")}</Typography>
                                        }
                                    </Box>
                                )
                            }
                        </Box>
                    ) : ""
                }
            </CardContent>

            <KanbanItemMenu
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                getSMSTemps={getSMSTemps}
                getGroups={getGroups}
                getBranches={getBranches}
                setOpen={setOpen}
            />

            <EditAnonimDialogDialog open={open} setOpen={setOpen} item={props} reRender={() => reRender(false)} />


            <Dialog open={open === 'add-group'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{t("Guruhga qo'shish")}</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <AddToGroupForm item={props} reRender={() => reRender(false)} groups={groups} loading={loading} setLoading={setLoading} />
                </DialogContent>
            </Dialog>


            <Dialog open={open === 'merge-to'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{t("Boshqa bo'limga")}</Typography>
                    <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
                </DialogTitle>
                <DialogContent>
                    <MergeToDepartment item={props} reRender={() => reRender(false)} />
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

                        <LoadingButton variant='contained' type={'submit'} loading={loading}>{t("Ko'chirish")}</LoadingButton>
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
                    <SendSmsAnonimUserForm smsTemps={smsTemps} user={props.id} closeModal={() => setOpen(null)} reRender={() => getDepartmentItem('sms-history')} />
                </DialogContent>
            </Dialog>

            {/* Notes */}
            <Dialog open={open === 'note'} onClose={() => setOpen(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>{t("Yangi eslatma")}</Typography>
                    <IconifyIcon onClick={() => setOpen(null)} icon={'material-symbols:close'} />
                </DialogTitle>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <AddNoteAnonimUser user={props.id} closeModal={async () => (setOpen(null), await getDepartmentItem('lead-user-description'))} />
                </DialogContent>
            </Dialog>

            {/* DELETE */}
            <Dialog open={open === 'delete'} onClose={() => setOpen(null)}>
                <DialogContent sx={{ minWidth: '300px', maxWidth: '350px' }}>
                    <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>{t("Rostdan ham o'chirib tashlamoqchimisiz?")}</Typography>
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
                                    departmentsState?.length && departmentsState?.find((item: any) => item.id === selectBranch)?.children.map((el: any) => (
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
