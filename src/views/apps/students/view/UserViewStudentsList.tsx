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
    admin_data?: string
}

interface ItemChildTypes {
    item: ItemTypes
    setOpenEdit?: any
}


export const UserViewStudentsItem = ({ item }: ItemChildTypes) => {
    const { created_at, message, description, admin_data } = item

    const { t } = useTranslation()
    console.log(item);
    

    return (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Status color='success' />
                <Typography fontStyle={'italic'} variant='body1' fontSize={14}>{message || description}</Typography>
                <Box sx={{ display: 'flex', gap: '15px' }}>
                    {admin_data &&<Typography fontSize={10}>{admin_data}</Typography>}
                    <Typography fontSize={10}>{created_at}</Typography>
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
