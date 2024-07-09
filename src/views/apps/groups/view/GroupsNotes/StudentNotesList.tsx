import React from 'react';
import { Box, Typography } from '@mui/material';
import Status from 'src/@core/components/status';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconifyIcon from 'src/@core/components/icon';
import { formatDateTime } from 'src/@core/utils/date-formatter';
import { handleOpenDeleteNote } from 'src/store/apps/groupDetails';
import { useAppDispatch } from 'src/store';
import Delete from './Delete';


interface ItemTypes {
    id: number
    created_at: string
    body: string
    admin: string | null
}

interface ItemChildTypes {
    item: ItemTypes
    setOpenEdit?: any
}


export const UserViewStudentsItem = ({ item, setOpenEdit }: ItemChildTypes) => {
    const { created_at, body, admin, id } = item
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value: string | boolean) => {
        setAnchorEl(null);
        setOpenEdit?.(value)
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Status color='success' />
                <Typography fontStyle={'italic'} variant='body1' fontSize={14}>{body}</Typography>
                <Box sx={{ display: 'flex', gap: '15px' }}>
                    <Typography sx={{ cursor: 'pointer' }} fontSize={10}>{admin || "Unknown Sender"}</Typography>
                    <Typography fontSize={10}>{formatDateTime(created_at)}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default function StudentsNotesList({ getNotes, comment, setOpenEdit }: any) {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '5px' }}>
            <UserViewStudentsItem setOpenEdit={setOpenEdit} item={comment} />
            <Delete getNotes={getNotes} />
        </Box>
    )
}
