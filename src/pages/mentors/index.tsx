import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  Menu,
  Radio,
  TextField,
  Typography
} from '@mui/material'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import Form from 'src/@core/components/form'
import useTeachers from 'src/hooks/useTeachers'
import showResponseError from 'src/@core/utils/show-response-error'
import useBranches from 'src/hooks/useBranch'
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
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
  width: 1,
});


export default function GroupsPage() {
  const [openAddGroup, setOpenAddGroup] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const { t } = useTranslation()

  const { createTeacher, getTeachers, teachers, loading, deleteTeacher, updateTeacher, setLoading, setTeachersData, teacherData, getTeacherById } = useTeachers()
  const { branches, getBranches } = useBranches()

  const handleDeleteTeacher = async (id: string | number) => {
    try {
      await deleteTeacher(id)
      toast.success("Mentorlar ro'yxatidan o'chirildi", { position: 'top-center' })
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleEdit = async (id: any) => {
    setOpenEdit(true)
    await getTeacherById(id)
  }

  const handleEditSubmit = async (values: any) => {
    setLoading(true)
    console.log(values);
    values.append('roles', `${teacherData?.roles.filter(el => el.exists).map(el => el.id).join(',')}`)
    await updateTeacher(teacherData?.id, values).then(() => {
      getTeachers()
      setLoading(false)
      setOpenEdit(false)
      setTeachersData(undefined)
    }).catch(() => setLoading(false))

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
            href={`/mentors/view/security?id=${id}`}
          >
            <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
            Ko'rish
          </MenuItem>
          <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
            Tahrirlash
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
            O'chirish
          </MenuItem>
        </Menu>
        <UserSuspendDialog handleOk={() => handleDeleteTeacher(id)} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
      </>
    )
  }
  const [error, setError] = useState<any>({})
  const [gender, setGender] = useState<'male' | 'female'>('male')

  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t("ID"),
      dataIndex: 'id'
    },
    {
      xs: 1.5,
      title: t("first_name"),
      dataIndex: 'first_name'
    },
    {
      xs: 1.3,
      title: t("phone"),
      dataIndex: 'phone'
    },
    {
      xs: 1,
      title: t("roles_list"),
      dataIndex: 'roles_list',
      render: (roles_list: any) => roles_list.join(',')
    },
    {
      xs: 1.3,
      title: t("birth_date"),
      dataIndex: 'birth_date'
    },
    {
      xs: 1.3,
      title: t("gender"),
      dataIndex: 'gender',
      render: (roles_list: any) => roles_list === "male" ? "Erkak" : "Ayol"
    },
    {
      xs: 1,
      dataIndex: 'id',
      title: t("Harakatlar"),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const reqiuredFields: string[] = ['first_name', 'birth_date', 'phone']

  const handleAddTeacher = async (values: any) => {
    try {
      await createTeacher(values)
      await getTeachers()
      setOpenAddGroup(false)
    } catch (error: any) {
      showResponseError(error.response.data, setError)
    }

    const form: any = document.getElementById('create-teacher-form')
    form.reset()
  }

  useEffect(() => {
    getBranches()
    getTeachers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t("Mentorlar")}</Typography>
        <Button
          onClick={() => setOpenAddGroup(true)}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>
      <DataTable columns={columns} data={teachers} />

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
            {t("Mentor qo'shish")}
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
        <Box width={'100%'}>
          <Form valueTypes='form-data' onSubmit={(values: any) => handleAddTeacher(values)} reqiuredFields={reqiuredFields} id='create-teacher-form' setError={setError} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField label={t("first_name")} name='first_name' error={error.first_name?.error} />
              <FormHelperText error={error.first_name}>{error.first_name?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField label={t("phone")} name='phone' error={error.phone} />
              <FormHelperText error={error.phone?.error}>{error.phone?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField type='date' label={t("birth_date")} name='birth_date' error={error.birth_date} />
              <FormHelperText error={error.birth_date?.error}>{error.birth_date?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id='user-view-language-label'>Filial</InputLabel>
              <Select
                error={error.branches?.error}
                label={t('branches')}
                multiple
                id='user-view-language'
                labelId='user-view-language-label'
                name='branches'
                defaultValue={[]}
              >
                {
                  branches.map(branch => <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.branches?.error}>{error.branches?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10 }}>
              <FormLabel>
                <Radio checked={gender === "male"} onChange={() => setGender('male')} />
                <span>Erkak</span>
              </FormLabel>
              <FormLabel>
                <Radio checked={gender === "female"} onChange={() => setGender('female')} />
                <span>Ayol</span>
              </FormLabel>
            </FormControl>

            <FormControl fullWidth sx={{ my: 2 }}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                color='warning'
                startIcon={<IconifyIcon icon={'subway:cloud-upload'} />}
              >
                Rasm qo'shish
                <VisuallyHiddenInput name='image' type="file" accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic' />
              </Button>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField label={t("password")} name='password' error={error.password} />
              <FormHelperText error={error.password?.error}>{error.password?.message}</FormHelperText>
            </FormControl>

            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>Saqlash</LoadingButton>
          </Form>
        </Box>
      </Drawer>

      <Drawer open={openEdit} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t("Mentor malumotlarini tahrirlash")}
          </Typography>
          <IconButton
            onClick={() => (setOpenEdit(false), setTeachersData(undefined))}
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
        <Box width={'100%'}>
          {teacherData ? <Form valueTypes='form-data' onSubmit={(values: any) => handleEditSubmit(values)} reqiuredFields={reqiuredFields} id='edit-teacher-form' setError={setError} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField label={t("first_name")} name='first_name' error={error.first_name?.error} defaultValue={teacherData.first_name} />
              <FormHelperText error={error.first_name}>{error.first_name?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField label={t("phone")} name='phone' error={error.phone} defaultValue={teacherData.phone} />
              <FormHelperText error={error.phone?.error}>{error.phone?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField type='date' label={t("birth_date")} name='birth_date' error={error.birth_date} defaultValue={teacherData.birth_date} />
              <FormHelperText error={error.birth_date?.error}>{error.birth_date?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id='user-view-language-label'>{t('branch')}</InputLabel>
              <Select
                error={error.branches?.error}
                label={t('branch')}
                multiple
                id='user-view-language'
                labelId='user-view-language-label'
                name='branches'
                defaultValue={teacherData.branches.filter(el => el.exists).map(el => el.id)}
              >
                {
                  branches.map(branch => <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.branches?.error}>{error.branches?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10 }}>
              <FormLabel>
                <Radio checked={teacherData.gender === "male"} onChange={() => setGender('male')} />
                <span>Erkak</span>
              </FormLabel>
              <FormLabel>
                <Radio checked={teacherData.gender === "female"} onChange={() => setGender('female')} />
                <span>Ayol</span>
              </FormLabel>
            </FormControl>

            <FormControl fullWidth sx={{ my: 2 }}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                color='warning'
                startIcon={<IconifyIcon icon={'subway:cloud-upload'} />}
              >
                Rasm qo'shish
                <VisuallyHiddenInput name='image' type="file" accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic' />
              </Button>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField label={t("password")} name='password' error={error.password} />
              <FormHelperText error={error.password?.error}>{error.password?.message}</FormHelperText>
            </FormControl>

            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>Saqlash</LoadingButton>
          </Form> : ""}
        </Box>
      </Drawer>
    </div>
  )
}
