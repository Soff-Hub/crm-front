import {
    Box,
    Button,
    IconButton,
    Menu,
    Typography
} from '@mui/material'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import MenuItem from '@mui/material/MenuItem'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchWekends, setOpenCreateSms, setWekendData } from 'src/store/apps/settings'
import EditWekendDialog from 'src/views/apps/settings/wekends/EditWekendDialog'
import CreateWekendDialog from 'src/views/apps/settings/wekends/CreateWekendDialog'

export interface customTableProps {
    xs: number
    title: string
    dataIndex?: string | ReactNode
    render?: (source: string) => any | undefined
}


export default function RoomsPage() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { wekends, is_pending } = useAppSelector(state => state.settings)

    const RowOptions = ({ id }: any) => {
        // ** State
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
        const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
        const [loading, setLoading] = useState<boolean>(false)

        const rowOptionsOpen = Boolean(anchorEl)

        const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget)
        }
        const handleRowOptionsClose = () => {
            setAnchorEl(null)
        }

        // Delete functions

        async function handleDelete() {
            handleRowOptionsClose()
            setSuspendDialogOpen(true)
        }

        async function handleDeletePosts(id: number) {
            handleRowOptionsClose()
            try {
                setLoading(true)
                await api.delete(`common/weekend/delete/${id}/`)
                toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
                dispatch(fetchWekends())
            } catch (error: any) {
                toast.error('Xatolik yuz berdi!', { position: 'top-center' })
            }

            setLoading(false)
        }

        // Get functions

        function handleEdit(id: number) {
            handleRowOptionsClose()
            const find = wekends.find(el => el.id === id)
            dispatch(setWekendData(find))
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
                    <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
                        <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                        {t("Tahrirlash")}
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                        <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                        {t("O'chirish")}
                    </MenuItem>
                </Menu>
                <UserSuspendDialog
                    loading={loading}
                    handleOk={() => handleDeletePosts(id)}
                    open={suspendDialogOpen}
                    setOpen={setSuspendDialogOpen}
                />
            </>
        )
    }

    useEffect(() => {
        dispatch(fetchWekends())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns: customTableProps[] = [
        {
            xs: 0.2,
            title: t('ID'),
            dataIndex: 'id'
        },
        {
            xs: 1,
            title: t('Sana'),
            dataIndex: 'date',
            render: (date) => date.split('-').reverse().join('.')
        },
        {
            xs: 2,
            title: t('Sabab'),
            dataIndex: 'description',
            render: (description) => <span>{description}</span>
        },
        {
            xs: 0.38,
            title: t('Harakatlar'),
            dataIndex: 'id',
            render: id => <RowOptions id={id} />
        }
    ]

    return (
        <div>
            <Box
                className='groups-page-header'
                sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
                py={2}
            >
                <Typography variant='h5'>{t('Dam olish kunlari')}</Typography>
                <Button
                    onClick={() => dispatch(setOpenCreateSms(true))}
                    variant='contained'
                    size='small'
                    startIcon={<IconifyIcon icon='ic:baseline-plus' />}
                >
                    {t("Yangi qo'shish")}
                </Button>
            </Box>
            <DataTable loading={is_pending} columns={columns} data={wekends} />

            <CreateWekendDialog />

            <EditWekendDialog />
        </div>
    )
}
