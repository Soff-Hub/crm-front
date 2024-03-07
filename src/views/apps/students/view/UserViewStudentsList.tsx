import React from 'react'
import { Box, Typography } from '@mui/material'
import Status from 'src/@core/components/status'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconifyIcon from 'src/@core/components/icon';
import { formatDateTime } from 'src/@core/utils/date-formatter';


interface ItemTypes {
    id: number
    created_at: string
    message: string
}

interface ItemChildTypes {
    item: ItemTypes
    setOpenEdit?: any
}


export const UserViewStudentsItem = ({ item, setOpenEdit }: ItemChildTypes) => {
    const { created_at, message } = item

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (value: string) => {
        setAnchorEl(null);
        setOpenEdit(value)
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Status color='success' />
                <Typography fontStyle={'italic'} variant='body1' fontSize={14}>{message}</Typography>
                <Box sx={{ display: 'flex', gap: '15px' }}>
                    <Typography fontSize={10}>{formatDateTime(created_at)}</Typography>
                </Box>
            </Box>
            <Box>
                <Typography
                    fontSize={20}
                    id="fade-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ cursor: 'pointer' }}
                >
                    <IconifyIcon icon={"charm:menu-kebab"} fontSize={17} />
                </Typography>
            </Box>

            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={() => handleClose('notes')}>Yangi eslatma</MenuItem>
                <MenuItem onClick={() => handleClose('delete')}>O'chirish</MenuItem>
            </Menu>
        </Box>
    )
}

export default function UserViewStudentsList({ comment, setOpenEdit }: any) {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '5px' }}>
            <UserViewStudentsItem setOpenEdit={setOpenEdit} item={comment} />
        </Box>
    )
}
