import React from 'react'
import { Box, Typography } from '@mui/material'
import Status from 'src/@core/components/status'
import { formatDateTime } from 'src/@core/utils/date-formatter';
import { useTranslation } from 'react-i18next';


interface ItemTypes {
    id: number
    created_at: string
    message?: string | undefined
    description?: string | undefined
}

interface ItemChildTypes {
    item: ItemTypes
    setOpenEdit?: any
}


export const UserViewStudentsItem = ({ item, setOpenEdit }: ItemChildTypes) => {
    const { created_at, message, description } = item

    const { t } = useTranslation()

    return (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Status color='success' />
                <Typography fontStyle={'italic'} variant='body1' fontSize={14}>{message || description}</Typography>
                <Box sx={{ display: 'flex', gap: '15px' }}>
                    <Typography fontSize={10}>{formatDateTime(created_at)}</Typography>
                </Box>
            </Box>
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
