// ** MUI Imports
import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { Box, CircularProgress, MenuItem, Typography } from '@mui/material'
import IconifyIcon from '../icon'
import api from 'src/@core/utils/api'
import KanbanItem from '../card-statistics/kanban-item'

interface AccordionProps {
    title?: string
    onView: () => void
    item: any
}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
    '& .MuiMenu-paper': {
        border: `1px solid${theme.palette.divider}`
    }
}))


export default function AccordionCustom({ onView, item }: AccordionProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [leadData, setLeadData] = useState<any[]>([])

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    const handleGetLeads = async () => {
        setLoading(true)
        setOpen(!open)
        try {
            const resp = await api.get(`leads/department-user-list/${item.id}/`)
            setLeadData(resp.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) onView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Box sx={{ width: '100%', border: '1px solid #cfcccc', borderRadius: 1 }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px' }}>
                <Typography fontSize={16}>{item.name}</Typography>
                <Typography fontSize={16} fontWeight={'700'} sx={{ marginLeft: 'auto', marginRight: 2 }}>{item.student_count}</Typography>
                <IconifyIcon
                    style={{ cursor: 'pointer', transform: open ? 'rotateZ(180deg)' : '' }}
                    onClick={() => !open ? handleGetLeads() : setOpen(!open)} icon={'mingcute:list-collapse-line'}
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
                                leadData.map((lead) => <KanbanItem key={lead.id} status={'success'} title={lead.first_name} phone={lead.phone} />)
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
                <MenuItem onClick={undefined} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:sms' fontSize={20} />
                    SMS yuborish
                </MenuItem>
                <MenuItem onClick={undefined} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:edit' fontSize={20} />
                    Tahrirlash
                </MenuItem>
                <MenuItem onClick={undefined} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete' fontSize={20} />
                    O'chirish
                </MenuItem>
            </Menu>
        </Box>
    )
}
