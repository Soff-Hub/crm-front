import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  Menu,
  Select,
  TextField,
  Typography
} from '@mui/material'
import React, { MouseEvent, ReactNode, useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DataTable from 'src/@core/components/table'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import useBranches from 'src/hooks/useBranch'
import Form from 'src/@core/components/form'
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

export default function RoomsPage() {
  const [openAddGroup, setOpenAddGroup] = useState<boolean>(false)
  const [openAddGroupEdit, setOpenAddGroupEdit] = useState<boolean>(false)
  const [dataRow, setData] = useState([])
  const [dataRowEdit, setDataRowEdit] = useState<any>(null)
  const [error, setError] = useState<any>({})
  const { t } = useTranslation()
  const { getBranches, branches } = useBranches()

  const RowOptions = ({ id }: any) => {
    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
      setDataRowEdit(null)
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
        await api.delete(`${ceoConfigs.rooms_delete}/${id}`)
        toast.success("Muvaffaqiyatli! o'chirildi", { position: 'top-center' })
        getUsers()
      } catch (error: any) {
        toast.error('Xatolik yuz berdi!', { position: 'top-center' })
      }
    }

    // Get functions

    async function handleEdit(id: number) {
      handleRowOptionsClose()
      try {
        setOpenAddGroupEdit(true)
        const resp = await api.get(`${ceoConfigs.rooms_detail}/${id}`)
        setDataRowEdit(resp.data)
        getUsers()
      } catch (error: any) {
        toast.error('Xatolik yuz berdi!', { position: 'top-center' })
      }
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
          {dataRow?.some((item: any) => item?.id == id && item?.is_delete) ? (
            <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
              {t("O'chirish")}
            </MenuItem>
          ) : (
            <></>
          )}
        </Menu>
        <UserSuspendDialog
          handleOk={() => handleDeletePosts(id)}
          open={suspendDialogOpen}
          setOpen={setSuspendDialogOpen}
        />
      </>
    )
  }


  // Getdata functions

  async function getUsers() {
    try {
      const resp = await api.get(ceoConfigs.rooms)
      setData(resp.data.results)
    } catch (err) {
      toast.error('Xatolik yuz berdi!', { position: 'top-center' })
    }
  }

  useEffect(() => {
    getUsers()
    getBranches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Post functions

  async function handelCliclPosts(value: any) {
    try {
      await api.post(ceoConfigs.rooms_posts, value)
      setOpenAddGroup(false)
      toast.success("Muvaffaqiyatli! qo'shildi", { position: 'top-center' })
      getUsers()
    } catch (error: any) {
      toast.error('Xatolik yuz berdi!', { position: 'top-center' })
    }
  }

  // Edit functions

  async function handelClickEditCourses(value: any) {
    await api.patch(`${ceoConfigs.rooms_update}/${dataRowEdit?.id}`, value)
    setOpenAddGroupEdit(false)
    getUsers()
  }

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'id'
    },
    {
      xs: 1.4,
      title: t('Nomi'),
      dataIndex: 'name'
    },
    {
      xs: 1.5,
      title: t('branch'),
      dataIndex: 'branch',
      render: (branch: any) => <span>{branch?.name}</span>
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
        <Typography variant='h5'>{t('Xonalar')}</Typography>
        <Button
          onClick={() => setOpenAddGroup(true)}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi xona qo'shish")}
        </Button>
      </Box>
      <DataTable columns={columns} data={dataRow} minWidth='700px' maxWidth='700px' />

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
            {t("Yangi xona qo'shish")}
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

        <Form
          setError={setError}
          reqiuredFields={['name', 'branch']}
          valueTypes='form-data'
          onSubmit={handelCliclPosts}
          id='posts-courses-id'
          sx={{
            padding: '10px 20px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginTop: '15px'
          }}
        >
          <FormControl fullWidth>
            <TextField error={error.name} label={t('Nomi')} size='small' name='name' />
            <FormHelperText error={error.name}>{error.name?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('branch')}
            </InputLabel>
            <Select
              error={error.branch}
              size='small'
              label={t('branch')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              name='branch'
              defaultValue={''}
            >
              {branches?.length > 0 && branches?.map((item: any) => <MenuItem key={item.id} value={item.id}>{item?.name}</MenuItem>)}
            </Select>

            <FormHelperText error={error.branch}>{error.branch?.message}</FormHelperText>
          </FormControl>

          <Button type='submit' variant='contained' color='success' fullWidth>
            {' '}
            {t('Saqlash')}
          </Button>
        </Form>
      </Drawer>

      <Drawer open={openAddGroupEdit} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t('Tahrirlash')}
          </Typography>
          <IconButton
            onClick={() => setOpenAddGroupEdit(false)}
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
        {dataRowEdit !== null && (
          <Form
            setError={setError}
            reqiuredFields={['name', 'branch']}
            valueTypes='form-data'
            onSubmit={handelClickEditCourses}
            id='posts-courses-id-edit'
            sx={{
              padding: '10px 20px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginTop: '15px'
            }}
          >
            <FormControl fullWidth>
              <TextField
                error={error.name}
                label={t('Nomi')}
                size='small'
                name='name'
                defaultValue={dataRowEdit?.name}
              />
              <FormHelperText error={error.name}>{error.name?.message}</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel size='small' id='demo-simple-select-outlined-label'>
                {t('branch')}
              </InputLabel>
              <Select
                error={error.branch}
                size='small'
                label={t('branch')}
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                name='branch'
                defaultValue={dataRowEdit?.branch?.id}
              >
                {branches?.length > 0 &&
                  branches?.map((item: any) => <MenuItem key={item.id} value={item.id}>{item?.name}</MenuItem>)}
              </Select>

              <FormHelperText error={error.branch}>{error.branch?.message}</FormHelperText>
            </FormControl>
            <Button type='submit' variant='contained' color='success' fullWidth>
              {' '}
              {t('Saqlash')}
            </Button>
          </Form>
        )}
      </Drawer>
    </div>
  )
}
