import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputLabel,
    Menu,
    TextField,
    Typography
} from '@mui/material'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import useEmployee from 'src/hooks/useEmployee'
import toast from 'react-hot-toast'
import LoadingButton from '@mui/lab/LoadingButton'
import Form from 'src/@core/components/form'
import useBranches from 'src/hooks/useBranch'

export interface customTableProps {
    xs: number
    title: string
    dataIndex?: string | ReactNode
    render?: (source: string) => any | undefined
}

interface UsersTypeDetail {
    id: 1
    first_name: string
    birth_date: string
    password: string
    branches: {
        id: number
        name: string
        exists: boolean
    }[]
    gender: 'male' | 'female'
    phone: string
    roles: {
        id: number
        name: string
        exists: boolean
    }[]
    image: string | null
    avatar: '/images/avatars/4.png'
}

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
    width: 400,
    zIndex: theme.zIndex.modal,
    '& .MuiFormControlLabel-root': {
        marginRight: '0.6875rem'
    },
    '& .MuiDrawer-paper': {
        border: 0,
        width: 400,
        zIndex: theme.zIndex.modal,
        boxShadow: theme.shadows[9]
    }
}))

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
})



export default function GroupsPage() {
    const [openAddGroup, setOpenAddGroup] = useState<boolean>(false)
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [userData, setData] = useState<UsersTypeDetail | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<any>({})

    // Hooks
    const { t } = useTranslation()
    const { updateEmployee, getEmployeeById } = useEmployee()

    // Handle Edit dialog
    const handleEditClose = () => setOpenEdit(false)

    const handleSubmit = async (values: any) => {
        setLoading(true)
        console.log(values);


        const employeeData = await updateEmployee(userData?.id, values, 'one')
        setData(employeeData)
        toast.success('Muvaffaqiyatli yangilandi', {
            position: 'top-center'
        })
        setLoading(false)
        handleEditClose()
    }

    const RowOptions = ({ id }: { id: number | string }) => {
        // ** State
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
        const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

        const rowOptionsOpen = Boolean(anchorEl)

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

        const getUserById = async () => {
            const resp = await getEmployeeById(id)
            setData(resp)
            setOpenEdit(true)
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
                        href={`users/view/security?id=${id}`}
                    >
                        <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
                        Ko'rish
                    </MenuItem>
                    <MenuItem onClick={getUserById} sx={{ '& svg': { mr: 2 } }}>
                        <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
                        Tahrirlash
                    </MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                        <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                        O'chirish
                    </MenuItem>
                </Menu>
                <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            </>
        )
    }

    const columns: customTableProps[] = [
        {
            xs: 0.3,
            title: t("ID"),
            dataIndex: 'id'
        },
        {
            xs: 0.5,
            title: t("Ism Familiya"),
            dataIndex: 'first_name'
        },
        {
            xs: 0.6,
            title: t("Telefon raqam"),
            dataIndex: 'phone'
        },
        {
            xs: 2,
            title: t("Kasbi"),
            dataIndex: 'roles_list',
            render: (roles_list: any) => roles_list.join(', ')
        },
        {
            xs: 0.5,
            dataIndex: 'id',
            title: t("Harakatlar"),
            render: actions => <RowOptions id={actions} />
        }
    ]

    // hooks
    const { employees, getEmployees } = useEmployee()
    const { branches, getBranches } = useBranches()

    useEffect(() => {
        if (employees.length < 1) {
            getEmployees()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <Box
                className='groups-page-header'
                sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
                py={2}
            >
                <Typography variant='h5'>{t("Xodimlar")}</Typography>
                <Button
                    onClick={() => (getBranches(), setOpenAddGroup(true))}
                    variant='contained'
                    size='small'
                    startIcon={<IconifyIcon icon='ic:baseline-plus' />}
                >
                    {t("Yangi qo'shish")}
                </Button>
            </Box>
            <DataTable columns={columns} data={employees} />

            <Drawer open={openAddGroup} hideBackdrop anchor='right' variant='persistent'>
                <Box
                    className='customizer-header'
                    sx={{
                        position: 'relative',
                        p: theme => theme.spacing(3.5, 5),
                        borderBottom: theme => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                        {t("Xodim qo'shish")}
                    </Typography>
                    <IconButton
                        onClick={() => setOpenAddGroup(false)}
                        sx={{
                            right: 20,
                            top: '50%',
                            position: 'absolute',
                            color: 'text.secondary',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <IconifyIcon icon='mdi:close' fontSize={20} />
                    </IconButton>
                </Box>
                <Box sx={{ px: 2, py: 4 }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <TextField size='small' fullWidth label='Ism Familiya' required name='first_name' error={error?.phone} />
                        <TextField size='small' fullWidth label='Telefon raqam' required name='phone' />

                        <FormControl fullWidth>
                            <InputLabel size='small' id='user-view-language-label'>Filial</InputLabel>
                            <Select
                                size='small'
                                label='Filial'
                                multiple
                                id='user-view-language'
                                labelId='user-view-language-label'
                                name='branches'
                                defaultValue={[]}
                            >
                                {
                                    branches.map((branch, index) => <MenuItem key={index} value={branch.id}>{branch.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </form>
                </Box>
            </Drawer>

            <Dialog
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby='user-view-edit'
                sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
                aria-describedby='user-view-edit-description'
            >
                <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                    Xodim ma'lumotlarini tahrirlash
                </DialogTitle>
                <DialogContent>
                    {userData && <Form setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleSubmit} id='edit-emfdployee'>
                        <Grid container spacing={6}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    label='Ism Familiya'
                                    name='first_name'
                                    defaultValue={userData.first_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField size='small' fullWidth label='Contact' name='phone' defaultValue={`${userData.phone}`} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id='user-view-language-label'>Filial</InputLabel>
                                    <Select
                                        size='small'
                                        label='Filial'
                                        multiple
                                        defaultValue={
                                            userData.branches.find(el => el.exists)
                                                ? [...userData.branches.filter(el => el.exists).map(el => el.id)]
                                                : []
                                        }
                                        id='user-view-language'
                                        labelId='user-view-language-label'
                                        name='branches'
                                    >
                                        {userData.branches.map(branch => (
                                            <MenuItem key={branch?.id} value={branch.id}>
                                                {branch.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id='user-view-country-label'>Roli</InputLabel>
                                    <Select
                                        size='small'
                                        label='Roli'
                                        multiple
                                        defaultValue={
                                            userData.roles.find(el => el.exists)
                                                ? [...userData.roles.filter(el => el.exists).map(el => el.id)]
                                                : []
                                        }
                                        id='user-view-language'
                                        labelId='user-view-language-label'
                                        name='roles'
                                    >
                                        {userData.roles.map(branch => (
                                            <MenuItem key={branch?.id} value={branch.id}>
                                                {branch.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <Button
                                        component='label'
                                        role={undefined}
                                        variant='contained'
                                        tabIndex={-1}
                                        startIcon={<IconifyIcon icon={'subway:cloud-upload'} />}
                                    >
                                        Rasm qo'shish
                                        <VisuallyHiddenInput

                                            // name='image'
                                            type='file'
                                            accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic'
                                        />
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField size='small' fullWidth label='Yangi parol' name='password' />
                            </Grid>
                        </Grid>
                        <DialogActions sx={{ justifyContent: 'center' }}>
                            <LoadingButton type='submit' loading={loading} variant='contained' sx={{ mr: 1 }}>
                                {t('Saqlash')}
                            </LoadingButton>
                            <Button variant='outlined' type='button' color='secondary'>
                                {t('Bekor Qilish')}
                            </Button>
                        </DialogActions>
                    </Form>}
                </DialogContent>
            </Dialog>
        </div>
    )
}
