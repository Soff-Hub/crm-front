// ** MUI Imports
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'

import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, MenuItem, TextField, Typography } from '@mui/material'
import IconifyIcon from '../icon'
import api from 'src/@core/utils/api'
import KanbanItem from '../card-statistics/kanban-item'
import Form from '../form'
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'

interface AccordionProps {
    title?: string
    onView: () => void
    item: any
    reRender: any
}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
    '& .MuiMenu-paper': {
        border: `1px solid${theme.palette.divider}`
    }
}))


export default function AccordionCustom({ onView, item, reRender }: AccordionProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [leadData, setLeadData] = useState<any[]>([])
    const [openDialog, setOpenDialog] = useState<'sms' | 'edit' | 'delete' | null>(null)
    const [error, setError] = useState<any>({})
    const [count, setCount] = useState<any>(item.student_count)
    const [name, setName] = useState<any>(item.name)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    const handleGetLeads = async (isLoad: boolean) => {
        if (isLoad) setOpen(!open)
        setLoading(true)
        try {
            const resp = await api.get(`leads/department-user-list/${item.id}/`)
            setLeadData(resp.data)
            setCount(resp.data.length)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    const handleEditLead = async (id: any, values: any) => {
        // setOpen(false)
        try {
            const resp = await api.patch(`leads/department-user-list/${id}/`, values)
            await handleGetLeads(false)
            return Promise.resolve(resp)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    const editDepartmentItem = async (values: any) => {
        setLoading(true)
        try {
            await api.patch(`leads/department-update/${item.id}`, values)
            setName(values.name)
            setLoading(false)
            setOpenDialog(null)
        } catch {
            setLoading(false)
        }
    }


    const smsDepartmentItem = async (values: any) => {
        setLoading(true)
        try {
            await api.post(`common/send-message-user/`, {
                users: leadData.map(el => Number(el.id)),
                message: values.message,
                for_lead: true
            })
            toast.success('SMS muvaffaqiyatli jo\'natildi!', {
                position: 'top-center'
            })
            setAnchorEl(null)
            setLoading(false)
            setOpenDialog(null)
        } catch {
            setLoading(false)
        }
    }


    const deleteDepartmentItem = async () => {
        setLoading(true)
        try {
            await api.patch(`leads/department-update/${item.id}`, { is_active: false })
            setLoading(false)
            setOpenDialog(null)
            toast.success('Muvaffaqiyatli o\'chirildi', {
                position: 'top-center'
            })
            reRender()
        } catch {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) onView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    useEffect(() => {
        if (open) {
            handleGetLeads(false)
        }
        setCount(item.student_count)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.student_count])

    return (
        <Box sx={{ width: '100%', border: '1px solid #cfcccc', borderRadius: 1 }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px' }}>
                <Typography fontSize={16}>{name}</Typography>
                <Typography fontSize={16} fontWeight={'700'} sx={{ marginLeft: 'auto', marginRight: 2 }}>{count}</Typography>
                <IconifyIcon
                    style={{ cursor: 'pointer', transform: open ? 'rotateZ(180deg)' : '' }}
                    onClick={() => !open ? handleGetLeads(true) : setOpen(!open)} icon={'mingcute:list-collapse-line'}
                />
                <IconifyIcon
                    icon="system-uicons:circle-menu"
                    style={{ marginLeft: 10, cursor: 'pointer' }}
                    aria-haspopup='true'
                    aria-controls='customized-menu'
                    onClick={handleClick}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', px: 2, gap: 2, marginY: open ? 2 : 0 }}>
                {
                    open ? (
                        loading ? (
                            <CircularProgress disableShrink sx={{ mt: 1, mb: 2, mx: 'auto' }} size={25} />
                        ) : (
                            leadData.length > 0 ? (
                                leadData.map((lead) => <KanbanItem is_view={lead.is_view} id={lead.id} handleEditLead={handleEditLead} key={lead.id} status={'success'} title={lead.first_name} phone={lead.phone} />)
                            ) : <Typography variant='body2' sx={{ fontStyle: 'italic', textAlign: 'center' }}>no data</Typography>
                        )
                    ) : ''
                }
            </Box>
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
                <MenuItem onClick={() => setOpenDialog('sms')} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:sms' fontSize={20} />
                    SMS yuborish
                </MenuItem>
                <MenuItem onClick={() => setOpenDialog('edit')} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:edit' fontSize={20} />
                    Tahrirlash
                </MenuItem>
                <MenuItem onClick={() => setOpenDialog('delete')} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete' fontSize={20} />
                    O'chirish
                </MenuItem>
            </Menu>

            {/* EDIT Item*/}
            <Dialog open={openDialog === 'edit'} onClose={() => setOpenDialog(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Tahrirlash</Typography>
                    <IconifyIcon onClick={() => setOpenDialog(null)} icon={'material-symbols:close'} />
                </DialogTitle>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Form setError={setError} valueTypes='json' onSubmit={editDepartmentItem} id='dmowei' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl fullWidth>
                            <TextField label="Nomi" size='small' defaultValue={item.name} name='name' />
                        </FormControl>

                        <FormControl fullWidth>
                            <TextField label="Tartibi" size='small' name='order' />
                        </FormControl>

                        <LoadingButton loading={loading} type='submit' variant='outlined'>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* SEND SMS */}
            <Dialog open={openDialog === 'sms'} onClose={() => setOpenDialog(null)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>SMS yuborish</Typography>
                    <IconifyIcon onClick={() => setOpenDialog(null)} icon={'material-symbols:close'} />
                </DialogTitle>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Form setError={setError} valueTypes='json' onSubmit={smsDepartmentItem} id='dmowei' sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <FormControl fullWidth>
                            <TextField label="SMS matni" multiline rows={4} size='small' name='message' />
                        </FormControl>

                        <LoadingButton loading={loading} type='submit' variant='outlined'>Saqlash</LoadingButton>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* DELETE */}
            <Dialog open={openDialog === 'delete'} onClose={() => setOpenDialog(null)}>
                <DialogContent sx={{ minWidth: '300px' }}>
                    <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>O'chirishni tasdiqlang</Typography>
                    <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
                        <LoadingButton variant='outlined' size='small' color='error'>Bekor qilish</LoadingButton>
                        <LoadingButton loading={loading} size='small' variant='outlined' onClick={deleteDepartmentItem}>O'chirish</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}
