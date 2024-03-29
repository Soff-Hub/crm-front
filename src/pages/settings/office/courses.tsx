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


export function addPeriodToThousands(number: any) {
  const numStr = String(number)

  const [integerPart, decimalPart] = numStr.split('.')

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  const formattedNumber = decimalPart !== undefined ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart

  return formattedNumber
}

export default function GroupsPage() {
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
        await api.delete(`${ceoConfigs.courses_delete}/${id}`)
        setSuspendDialogOpen(false)
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
        const resp = await api.get(`${ceoConfigs.courses_detail}/${id}`)
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
            Tahrirlash
          </MenuItem>
          {dataRow?.some((item: any) => item?.id == id && item?.is_delete) ? (
            <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
              O'chirish
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
      const resp = await api.get(ceoConfigs.courses)
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
      await api.post(ceoConfigs.courses_posts, value)
      setOpenAddGroup(false)
      toast.success("Muvaffaqiyatli! qo'shildi", { position: 'top-center' })
      getUsers()
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi!', { position: 'top-center' })
    }

    const form: any = document.getElementById('posts-courses-id')
    form.reset()
  }

  // Edit functions

  async function handelClickEditCourses(value: any) {
    try {
      await api.patch(`${ceoConfigs.courses_update}/${dataRowEdit?.id}`, value)
      setOpenAddGroupEdit(false)
      toast.success('Muvaffaqiyatli! tahrirlandi', { position: 'top-center' })
      getUsers()
    } catch (error: any) {
      toast.error('Xatolik yuz berdi!', { position: 'top-center' })
    }

    const form: any = document.getElementById('posts-courses-id-edit')
    form.reset()
  }

  const columns: customTableProps[] = [
    {
      xs: 1,
      title: t('Kurslar'),
      dataIndex: 'name'
    },
    {
      xs: 1.2,
      title: t('Kurs haqida malumot'),
      dataIndex: 'description'
    },
    {
      xs: 0.8,
      title: t('Kurs narxi'),
      dataIndex: 'price',
      render: text => addPeriodToThousands(Number(text) + ' ' + "so'm")
    },
    {
      xs: 1,
      title: t('Filial'),
      dataIndex: 'branch',
      render: (branch: any) => {
        if (branch?.length > 1) {
          return branch?.map((item: any) => <span key={item.id}> {item?.name}, </span>)
        } else {
          return branch?.map((item: any) => <span key={item.id}> {item?.name} </span>)
        }
      }
    },
    {
      xs: 1.5,
      title: t('Kurs davomiyligi'),
      dataIndex: 'month_duration',
      render: month => <span>{month} oy</span>
    },
    {
      xs: 1.3,
      title: t('Dars davomiyligi'),
      dataIndex: 'lesson_duration_seconds',
      render: date =>
        Number(date) === 5400
          ? '1 soat 30 daqiqa'
          : Number(date) === 7200
            ? '2 soat '
            : Number(date) === 9000
              ? '2 soat 30 daqiqa'
              : '3 soat'
    },
    {
      xs: 1,
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
        <Typography variant='h5'>{t('Talabalar')}</Typography>
        <Button
          onClick={() => setOpenAddGroup(true)}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi kurs qo'shish")}
        </Button>
      </Box>
      <DataTable columns={columns} data={dataRow} color />

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
            {t("Kurs qo'shish")}
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
          reqiuredFields={['name', 'branch', 'price', 'month_duration', 'lesson_duration']}
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
            <TextField error={error.name} label='* Kurs nomi' size='small' name='name' />
            <FormHelperText error={error.name}>{error.name?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              * Filial tanlang
            </InputLabel>
            <Select
              error={error.branch}
              size='small'
              label='* Filial tanlang'
              multiple
              defaultValue={[]}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              name='branch'
            >
              {branches?.length > 0 && branches?.map((item: any) => <MenuItem key={item.id} value={item.id}>{item?.name}</MenuItem>)}
            </Select>

            <FormHelperText error={error.branch}>{error.branch?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <TextField error={error.price} label='* Kurs narxi' size='small' name='price' />
            <FormHelperText error={error.price}>{error.price?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              * Dars davomiyligi
            </InputLabel>
            <Select
              error={error.lesson_duration}
              size='small'
              label='* Dars davomiyligi'
              defaultValue={''}
              id='demo-simple-select-outlined2'
              labelId='demo-simple-select-outlined-label2'
              name='lesson_duration'
            >
              <MenuItem value={5400}>1 soat 30 daqiqa</MenuItem>
              <MenuItem value={7200}>2 soat </MenuItem>
              <MenuItem value={9000}>2 soat 30 daqiqa</MenuItem>
              <MenuItem value={10800}>3 soat</MenuItem>
            </Select>
            <FormHelperText error={error.lesson_duration}>{error.lesson_duration?.message}</FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <TextField error={error?.month_duration} type='number' label='* Kurs davomiyligi (oy)' size='small' name='month_duration' />
            <FormHelperText error={error.month_duration}>{error.month_duration?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              error={error?.description}
              rows={4}
              multiline
              label="Kurs haqida to'liq  malumot"
              name='description'
              defaultValue={''}
            />
            <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              error={error?.color}
              label="Rangi"
              name='color'
              type='color'
              defaultValue={'#FFFFFF'}
            />
            <FormHelperText error={error.color}>{error.color?.message}</FormHelperText>
          </FormControl>
          <Button type='submit' variant='contained' color='success' fullWidth>
            {' '}
            Saqlash
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
            {t('Kurs Tahrirlash')}
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
            reqiuredFields={['name', 'branch', 'price', 'month_duration', 'lesson_duration']}
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
                label='* Kurs nomi'
                size='small'
                name='name'
                defaultValue={dataRowEdit?.name}
              />
              <FormHelperText error={error.name}>{error.name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='demo-simple-select-outlined-label'>
                * Filial tanlang
              </InputLabel>
              <Select
                error={error.branch}
                size='small'
                label='* Filial tanlang'
                multiple
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                name='branch'
                defaultValue={dataRowEdit.branch.map((branch: any) => branch.id)}
              >
                {branches?.length > 0 &&
                  branches?.map((item: any) => <MenuItem key={item.id} value={item.id}>{item?.name}</MenuItem>)}
              </Select>

              <FormHelperText error={error.branch}>{error.branch?.message}</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                error={error.price}
                label='* Kurs narxi'
                size='small'
                name='price'
                defaultValue={Number(dataRowEdit?.price)}
              />
              <FormHelperText error={error.price}>{error.price?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='demo-simple-select-outlined-label'>
                * Dars davomiyligi
              </InputLabel>
              <Select
                error={error.lesson_duration}
                size='small'
                label='* Dars davomiyligi'
                defaultValue={dataRowEdit?.lesson_duration_seconds}
                id='demo-simple-select-outlined2'
                labelId='demo-simple-select-outlined-label2'
                name='lesson_duration'
              >
                <MenuItem value={5400}>1 soat 30 daqiqa</MenuItem>
                <MenuItem value={7200}>2 soat </MenuItem>
                <MenuItem value={9000}>2 soat 30 daqiqa</MenuItem>
                <MenuItem value={10800}>3 soat</MenuItem>
              </Select>
              <FormHelperText error={error.lesson_duration}>{error.lesson_duration?.message}</FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                error={error?.month_duration}
                label='* Kurs davomiyligi (oy)'
                size='small'
                name='month_duration'
                defaultValue={dataRowEdit?.month_duration}
              />
              <FormHelperText error={error.month_duration}>{error.month_duration?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.description}
                rows={4}
                multiline
                label="Kurs haqida to'liq  malumot"
                name='description'
                defaultValue={dataRowEdit?.description}
              />
              <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField
                error={error?.color}
                label="Rangi"
                name='color'
                type='color'
                defaultValue={dataRowEdit?.color}
              />
              <FormHelperText error={error.color}>{error.color?.message}</FormHelperText>
            </FormControl>
            <Button type='submit' variant='contained' color='success' fullWidth>
              {' '}
              Saqlash
            </Button>
          </Form>
        )}
      </Drawer>
    </div>
  )
}
