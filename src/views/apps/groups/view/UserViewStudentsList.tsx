import React, { useContext } from 'react'
import { Box, Dialog, DialogContent, TextField, Typography } from '@mui/material'
import Status from 'src/@core/components/status'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconifyIcon from 'src/@core/components/icon';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Link from 'next/link';
import { formatDateTime } from 'src/@core/utils/date-formatter';
import { useRouter } from 'next/router';
import { AuthContext } from 'src/context/AuthContext';


interface StudentType {
    id: number | string
    student: {
        first_name: string
        phone: string
        balance: number
        added_at: string
        created_at: string
        comment: {
            comment: string
            user: string
            created_at: string
        }
        id: string
    }
}

interface ItemTypes {
    item: StudentType
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        width: '300px',
        height: '330px',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 300,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export const UserViewStudentsItem = ({ item }: ItemTypes) => {
    const { student } = item
    const { first_name, phone, added_at, created_at, balance, comment, id } = student
    const { push } = useRouter()
    const { user } = useContext(AuthContext)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (value: 'none' | 'left' | 'payment' | 'notes') => {
        setAnchorEl(null);
        if (value === 'notes') push(`/students/view/comments/?student=${id}`)
        else if (value === 'payment') push(`/students/view/security/?student=${id}`)
        else if (value === 'left') {

        }
    };


    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant='body2' sx={{ width: '20px' }}>{id}.</Typography>
            <Status color={balance < 0 ? 'error' : 'success'} />
            {user?.role !== 'teacher' ? <HtmlTooltip className='' title={
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Box>
                            <Typography fontSize={12}>{first_name}</Typography>
                            <Typography variant='body2' fontSize={12}>Faol</Typography>
                        </Box>
                        <Typography variant='body2' fontSize={10}>{`( ID: 134 )`}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>Telefon</Typography>
                        <Typography fontSize={12}>{phone}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>Balans</Typography>
                        <Typography fontSize={12}>{`${balance} so'm`}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>Talaba qo'shilgan sana</Typography>
                        <Typography fontSize={12}>{added_at}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>Faollashtirilgan</Typography>
                        <Typography fontSize={12}>{formatDateTime(created_at)}</Typography>
                    </Box>
                    {comment && <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>Eslatma</Typography>
                        <Typography fontSize={12} fontStyle={'italic'}>{comment.comment}</Typography>
                        <Typography fontSize={12} variant='body2'>{`${comment.user} ${formatDateTime(comment.created_at)}`}</Typography>
                    </Box>}
                    <Link href={`/students/view/security/?student=${id}`} style={{ color: 'black', marginTop: 5 }}>
                        <span>Profilga o'tish</span>
                        <IconifyIcon fontSize={12} icon={'ion:arrow-redo-outline'} />
                    </Link>
                </Box>
            }>
                <Typography sx={{ cursor: 'pointer' }} variant='body2' fontSize={10}>{first_name}</Typography>
            </HtmlTooltip> : <Typography sx={{ cursor: 'pointer' }} variant='body2' fontSize={10}>{first_name}</Typography>}
            <Typography variant='body2' fontSize={10} flexGrow={1} textAlign={'end'} mr={5}>{phone}</Typography>
            <Typography
                fontSize={11}
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={user?.role !== 'teacher' ? handleClick : undefined}
            >
                <IconifyIcon icon={"charm:menu-kebab"} fontSize={11} />
            </Typography>

            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose('none')}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={() => handleClose('payment')}>To'lov</MenuItem>
                <MenuItem onClick={() => handleClose('left')}>Guruhdan chiqarish</MenuItem>
                <MenuItem onClick={() => handleClose('notes')}>Eslatmala</MenuItem>
            </Menu>

            <Dialog open={false}>
                <DialogContent>
                    SA
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default function UserViewStudentsList({ data }: any) {

    return (
        <Box>
            <TextField autoComplete='off' placeholder='Qidirish...' size='small' fullWidth />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: '10px', gap: '5px' }}>
                {
                    data.map((el: any) => (
                        <UserViewStudentsItem key={el.id} item={el} />
                    ))
                }
            </Box>
        </Box>
    )
}
