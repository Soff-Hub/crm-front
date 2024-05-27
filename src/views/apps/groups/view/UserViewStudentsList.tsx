import React, { useContext, useState } from 'react'
import { Box, Button, Dialog, DialogContent, FormControl, FormHelperText, InputLabel, Select, TextField, Typography } from '@mui/material'
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
import LoadingButton from '@mui/lab/LoadingButton';
import api from 'src/@core/utils/api';
import toast from 'react-hot-toast';
import Form from 'src/@core/components/form';
import showResponseError from 'src/@core/utils/show-response-error';
import { today } from 'src/@core/components/card-statistics/kanban-item';


interface StudentType {
    id: number | string
    student: {
        first_name: string
        phone: string
        balance: number
        added_at: string
        activated_at: string
        created_at: string
        comment: {
            comment: string
            user: string
            created_at: string
        }
        id: string
        status: string
    }
}

interface ItemTypes {
    item: StudentType
    index: any,
    status?: any,
    activeId?: any
    reRender: any
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        width: '300px',
        height: '300px',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 300,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export const UserViewStudentsItem = ({ item, index, status, activeId, reRender }: ItemTypes) => {
    const { student } = item
    const { first_name, phone, added_at, created_at, balance, comment, id, activated_at } = student
    const { push, query } = useRouter()
    const { user } = useContext(AuthContext)
    const [error, setError] = useState<any>({})

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openLeft, setOpenLeft] = useState<boolean>(false)
    const [activate, setActivate] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value: 'none' | 'left' | 'payment' | 'notes') => {
        setAnchorEl(null);
        if (value === 'notes') push(`/students/view/comments/?student=${id}`)
        else if (value === 'payment') push(`/students/view/security/?student=${id}`)
        else if (value === 'left') {
            setOpenLeft(true)
        }
    };

    const handleLeft = async () => {
        setLoading(true)
        try {
            await api.post('common/group-student/destroy/', {
                group: query.id,
                student: id
            })
            toast.success("O'quvchi guruhdan chetlatildi", { position: 'top-center' })
            setLoading(false)
            setOpenLeft(false)
            reRender()
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    const handleActivate = async (values: any) => {
        setLoading(true)
        try {
            await api.patch(`common/group-student-update/${activeId}`, values)
            toast.success("O'quvchi malumotlari o'zgartirildi", { position: 'top-center' })
            setLoading(false)
            setActivate(false)
            reRender()
        } catch (err: any) {
            showResponseError(err?.response?.data, setError)
            setLoading(false)
        }
    }



    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ width: '20px' }}>{index}.</Typography>
            <Status color={status == 'active' ? 'success' : status == 'new' ? 'warning' : 'error'} />
            {!(user?.role.length === 1 && user?.role.includes('teacher')) ? <HtmlTooltip className='' title={
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Box>
                            <Typography fontSize={12}>{first_name}</Typography>
                            <Typography variant='body2' fontSize={12}>{status == 'active' ? 'Faol' : status == 'new' ? 'Sinov darsida' : 'Arxiv'}</Typography>
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
                        <Typography fontSize={12}>{formatDateTime(added_at)}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>Aktivlashtirilgan sana</Typography>
                        <Typography fontSize={12}>{formatDateTime(activated_at)}</Typography>
                    </Box>
                    {comment && <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>Eslatma</Typography>
                        <Typography fontSize={12} fontStyle={'italic'}>{comment.comment}</Typography>
                        <Typography fontSize={12} variant='body2'>{`${comment.user} ${formatDateTime(comment.created_at)}`}</Typography>
                    </Box>}
                </Box>
            }>
                <Link href={`/students/view/security/?student=${id}`} style={{ textDecoration: 'underline', color: 'gray' }}>
                    <Typography sx={{ cursor: 'pointer' }} fontSize={10}>{first_name}</Typography>
                </Link>
            </HtmlTooltip> : <Typography sx={{ cursor: 'pointer' }} fontSize={10}>{first_name}</Typography>}
            <Typography fontSize={10} flexGrow={1} textAlign={'end'} mr={5}>{phone}</Typography>
            <Typography
                fontSize={11}
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={!(user?.role.length === 1 && user?.role.includes('teacher')) ? handleClick : undefined}
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
                <MenuItem onClick={() => handleClose('notes')}>Eslatmalar</MenuItem>
                <MenuItem onClick={() => setActivate(true)}>Tahrirlash</MenuItem>
            </Menu>

            <Dialog open={openLeft} onClose={() => setOpenLeft(false)}>
                <DialogContent sx={{ maxWidth: '350px' }}>
                    <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>O'quvchini guruhdan chetlatishni tasdiqlang</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Button onClick={() => setOpenLeft(false)} size='small' variant='outlined' color='error'>bekor qilish</Button>
                        <LoadingButton loading={loading} onClick={handleLeft} size='small' variant='contained' color='success'>Tasdiqlash</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={activate} onClose={() => setActivate(false)}>
                <DialogContent sx={{ minWidth: '350px' }}>
                    <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>O'quvchini tahrirlash</Typography>

                    <Form id='weqe' onSubmit={handleActivate} setError={setError} sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                        <FormControl>
                            <TextField defaultValue={added_at || today} name='added_at' type='date' error={error?.added_at?.error} label={"Qo'shilgan sana"} size='small' />
                            <FormHelperText error={error?.added_at?.error}>{error?.added_at?.message}</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <TextField defaultValue={activated_at || today} name='activated_at' type='date' error={error?.activated_at?.error} label={"Aktivlashtirilgan sana"} size='small' />
                            <FormHelperText error={error?.activated_at?.error}>{error?.activated_at?.message}</FormHelperText>
                        </FormControl>

                        <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
                            <InputLabel size='small' id='demo-simple-select-outlined-label'>Status (holati)</InputLabel>
                            <Select
                                size='small'
                                label="Status (holati)"
                                defaultValue={status}
                                id='demo-simple-select-outlined'
                                labelId='demo-simple-select-outlined-label'
                                name='status'
                            >
                                <MenuItem value={'active'}>Aktiv</MenuItem>
                                <MenuItem value={'new'}>Sinov darsi</MenuItem>
                                <MenuItem value={'archive'}>Arxiv</MenuItem>
                                <MenuItem value={'frozen'}>Muzlatish</MenuItem>
                            </Select>
                        </FormControl>


                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                            <Button onClick={() => setActivate(false)} size='small' variant='outlined' color='error'>bekor qilish</Button>
                            <LoadingButton loading={loading} type='submit' size='small' variant='contained' color='success'>Saqlash</LoadingButton>
                        </Box>
                    </Form>

                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default function UserViewStudentsList({ data, reRender }: any) {

    return (
        <Box>
            <TextField autoComplete='off' placeholder='Qidirish...' size='small' fullWidth />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: '10px', gap: '5px' }}>
                {
                    data.map((el: any, index: any) => (
                        <UserViewStudentsItem reRender={reRender} key={el.id} activeId={el.id} item={el} index={index + 1} status={el.status} />
                    ))
                }
            </Box>
        </Box>
    )
}
