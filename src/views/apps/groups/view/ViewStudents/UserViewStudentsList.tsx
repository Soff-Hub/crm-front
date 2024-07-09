import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, TextField, Typography } from '@mui/material';
import Status from 'src/@core/components/status';
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
import useSMS from 'src/hooks/useSMS';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/store';
import { getAttendance, getStudents, setGettingAttendance, studentsUpdateParams } from 'src/store/apps/groupDetails';
import SubLoader from '../../../loaders/SubLoader';
import useDebounce from 'src/hooks/useDebounce';
import { getMontNumber } from 'src/@core/utils/gwt-month-name';
import SentSMS from './SentSMS';
import AddNote from './AddNote';
import EditStudent from './EditStudent';
import EmptyContent from 'src/@core/components/empty-content';


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

export const UserViewStudentsItem = ({ item, index, status, activeId }: ItemTypes) => {
    const { studentsQueryParams, queryParams } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()

    const { student } = item
    const { first_name, phone, added_at, created_at, balance, comment, id, activated_at } = student
    const { push, query } = useRouter()
    const { user } = useContext(AuthContext)
    const [error, setError] = useState<any>({})

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openLeft, setOpenLeft] = useState<boolean>(false)
    const [activate, setActivate] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [modalRef, setModalRef] = useState<'sms' | 'note' | null>(null)
    const { smsTemps, getSMSTemps } = useSMS()
    const { t } = useTranslation()

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value: 'none' | 'left' | 'payment' | 'notes' | 'sms') => {
        setAnchorEl(null);
        if (value === 'notes') setModalRef('note')
        else if (value === 'sms') setModalRef('sms')
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
            const queryString = new URLSearchParams(studentsQueryParams).toString()
            const queryStringAttendance = new URLSearchParams(queryParams).toString()
            await dispatch(getStudents({ id: query.id, queryString: queryString }))
            dispatch(setGettingAttendance(true))
            if (query.month && query?.id) {
                await dispatch(getAttendance({ date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`, group: query?.id, queryString: queryStringAttendance }))
            }
            dispatch(setGettingAttendance(false))
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{ width: '20px' }}>{index}.</Typography>
            <Status color={status == 'active' ? 'success' : status == 'new' ? 'warning' : status == 'frozen' ? "secondary" : 'error'} />
            {!(user?.role.length === 1 && user?.role.includes('teacher')) ? <HtmlTooltip className='' title={
                <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                        <Box>
                            <Typography fontSize={12}>{first_name}</Typography>
                            <Typography variant='body2' fontSize={12}>{t(status)}</Typography>
                        </Box>
                        <Typography variant='body2' fontSize={10}>{`( ID: 134 )`}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>{t('phone')}</Typography>
                        <Typography fontSize={12}>{phone}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>{t('Balans')}</Typography>
                        <Typography fontSize={12}>{`${balance} so'm`}</Typography>
                    </Box>
                    <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>{t("Talaba qo'shilgan sana")}</Typography>
                        <Typography fontSize={12}>{formatDateTime(added_at)}</Typography>
                    </Box>
                    {comment && <Box py={1} borderTop={'1px solid #c3cccc'}>
                        <Typography variant='body2' fontSize={12}>{t('Eslatma')}</Typography>
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
                style={{ cursor: 'pointer' }}
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
                <MenuItem onClick={() => handleClose('payment')}>{t("To'lov")}</MenuItem>
                <MenuItem onClick={() => handleClose('left')}>{t('Guruhdan chiqarish')}</MenuItem>
                <MenuItem onClick={() => handleClose('notes')}>{t('Eslatma')} +</MenuItem>
                <MenuItem onClick={() => (handleClose('sms'), getSMSTemps())}>{t('Xabar (sms)')} +</MenuItem>
                <MenuItem onClick={() => (setActivate(true), handleClose('none'))}>{t('Tahrirlash')}</MenuItem>
            </Menu>

            <Dialog open={openLeft} onClose={() => setOpenLeft(false)}>
                <DialogContent sx={{ maxWidth: '350px' }}>
                    <Typography sx={{ fontSize: '20px', textAlign: 'center', mb: 3 }}>O'quvchini guruhdan chetlatishni tasdiqlang</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Button onClick={() => setOpenLeft(false)} size='small' variant='outlined' color='error'>bekor qilish</Button>
                        <LoadingButton loading={loading} onClick={handleLeft} size='small' variant='contained'>Tasdiqlash</LoadingButton>
                    </Box>
                </DialogContent>
            </Dialog>
            <EditStudent status={status} student={student} id={activeId} activate={activate} setActivate={setActivate} />
            <AddNote id={id} modalRef={modalRef} setModalRef={setModalRef} />
            <SentSMS id={id} modalRef={modalRef} setModalRef={setModalRef} />
        </Box>
    )
}



export default function UserViewStudentsList() {
    const { students, studentsQueryParams, isGettingStudents } = useAppSelector(state => state.groupDetails)
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const [search, setSearch] = useState("")
    const debounce = useDebounce(search, 500)
    const { query } = useRouter()

    useEffect(() => {
        (function () {
            const queryString = new URLSearchParams({ ...studentsQueryParams, search: debounce }).toString()
            dispatch(getStudents({ id: query.id, queryString: queryString }))
            dispatch(studentsUpdateParams({ search: debounce }))
        })()
    }, [debounce])

    return (
        <Box>
            <TextField onChange={(e) => setSearch(e.target.value)} autoComplete='off' placeholder={t('Qidirish')} size='small' fullWidth />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mt: '10px', gap: '5px' }}>
                {isGettingStudents ? <SubLoader /> : students?.length ?
                    students?.map((el: any, index: any) => (
                        <UserViewStudentsItem reRender={() => { }} key={el.id} activeId={el.id} item={el} index={index + 1} status={el.status} />
                    )) : <Box sx={{ paddingX: "50px" }}><EmptyContent /></Box>
                }
            </Box>
        </Box>
    )
}


