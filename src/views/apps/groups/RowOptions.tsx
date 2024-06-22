import { IconButton, Menu } from '@mui/material';
import { MouseEvent, useState } from 'react';
import IconifyIcon from 'src/@core/components/icon';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import UserSuspendDialog from 'src/views/apps/groups/view/UserSuspendDialog';
import getMontName from 'src/@core/utils/gwt-month-name';
import { useTranslation } from 'react-i18next';
import useTeachers from 'src/hooks/useTeachers';
import useGroups from 'src/hooks/useGroups';
import useCourses from 'src/hooks/useCourses';
import useRooms from 'src/hooks/useRooms';
import { useAppDispatch, useAppSelector } from 'src/store';
import { deleteGroups, fetchGroups, handleOpenEdit } from 'src/store/apps/groups';
import { useRouter } from 'next/router';

const RowOptions = ({ id }: { id: number | string }) => {
    const { } = useAppSelector(state => state.groups)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const rowOptionsOpen = Boolean(anchorEl)

    const { getTeachers, } = useTeachers()
    const { getGroups, getGroupById } = useGroups()
    const { getCourses } = useCourses()
    const { getRooms } = useRooms()

    const { t } = useTranslation()

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
        setAnchorEl(null)
    }

    const handleDelete = () => {
        handleRowOptionsClose()
        setSuspendDialogOpen(true)
    }

    const handleEdit = async (id: any) => {
        getCourses()
        getTeachers()
        getRooms()
        dispatch(handleOpenEdit(true))
        await getGroupById(id)
    }


    const handleDeleteTeacher = async (id: string | number) => {
        await dispatch(deleteGroups(id))
        await dispatch(fetchGroups({ query: router.query, status: router.query.status }))
        // await getGroups()
    }

    return (
        <>
            <IconButton size='small' onClick={handleRowOptionsClick}>
                <IconifyIcon icon='mdi:dots-vertical' />
            </IconButton>
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
                <MenuItem
                    component={Link}
                    sx={{ '& svg': { mr: 2 } }}
                    onClick={handleRowOptionsClose}
                    href={`/groups/view/security?id=${id}&month=${getMontName(null)}`}
                >
                    <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
                    {t("Ko'rish")}
                </MenuItem>
                <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                    {t("Tahrirlash")}
                </MenuItem>

                <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                    {t("O'chirish")}
                </MenuItem>

                <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='material-symbols-light:recommend-outline' fontSize={20} />
                    {t("Guruhni yakunlash")}
                </MenuItem>
            </Menu>
            <UserSuspendDialog handleOk={() => handleDeleteTeacher(id)} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        </>
    )
}
export default RowOptions