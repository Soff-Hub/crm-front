import React, { useState } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { Box, Typography } from '@mui/material'

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

import Card from '@mui/material/Card'
import { AvatarProps } from '@mui/material/Avatar'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icon Imports
import IconifyIcon from 'src/@core/components/icon'

// ** Types Imports
import { KanbarItemProps } from 'src/@core/components/card-statistics/types'

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

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
    }

    // const handleClose = () => {
    //     setAnchorEl(null)
    // }



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
                <MenuItem onClick={undefined} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:edit' fontSize={20} />
                    Tahrirlash
                </MenuItem>
                <MenuItem onClick={undefined} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete' fontSize={20} />
                    O'chirish
                </MenuItem>
            </Menu>
        </Card>
    )
}

export default KanbanItem
