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

    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
      
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
          return dateString;
        }
      
        const pad = (num: number): string => num.toString().padStart(2, '0');
      
        if (dateString.includes('T')) {
          const year = date.getFullYear();
          const month = pad(date.getMonth() + 1); 
          const day = pad(date.getDate());
          const hours = pad(date.getHours());
          const minutes = pad(date.getMinutes());
          const seconds = pad(date.getSeconds());
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        
        const altFormatRegex = /^(\d{4}-\d{2}-\d{2}\s+\d{2})-(\d{2})(?:-(\d{2}))?$/;
        const match = dateString.match(altFormatRegex);
        if (match) {
          if (match[3]) {
            return `${match[1]}:${match[2]}:${match[3]}`;
          }
          return `${match[1]}:${match[2]}`;
        }
      
        return dateString;
      }

    const { t } = useTranslation()
    console.log(item);
    

    return (
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Status color='success' />
                <Typography fontStyle={'italic'} variant='body1' fontSize={14}>{message || description}</Typography>
                <Box sx={{ display: 'flex', gap: '15px' }}>
                    {/* {admin_data &&<Typography fontSize={10}>{admin_data}</Typography>} */}
                    <Typography fontSize={10}>{formatDate(created_at)}</Typography>
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
