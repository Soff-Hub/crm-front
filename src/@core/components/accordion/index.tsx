// ** MUI Imports
import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { Box, Typography } from '@mui/material'
import IconifyIcon from '../icon'

interface AccordionProps {
    children?: ReactNode
    title?: string
    onView: () => void
    item: any
}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
    '& .MuiMenu-paper': {
        border: `1px solid${theme.palette.divider}`
    }
}))

// Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
    '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.common.white
        }
    }
}))

export default function AccordionCustom({ children, onView, item }: AccordionProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        if (open) onView();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Box sx={{ width: '100%', border: '1px solid #cfcccc', borderRadius: 1 }}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px' }}>
                <Typography fontSize={16}>{item.name}</Typography>
                <IconifyIcon
                    style={{ marginLeft: 'auto', cursor: 'pointer', transform: open ? 'rotateZ(180deg)' : '' }}
                    onClick={() => setOpen(!open)} icon={'mingcute:list-collapse-line'}
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
                {open && children}
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
