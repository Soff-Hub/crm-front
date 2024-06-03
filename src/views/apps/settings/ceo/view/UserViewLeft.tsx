// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import LoadingButton from '@mui/lab/LoadingButton'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useTranslation } from 'react-i18next'
import useEmployee from 'src/hooks/useEmployee'
import IconifyIcon from 'src/@core/components/icon'

import { styled } from '@mui/material/styles'
import toast from 'react-hot-toast'

interface ColorsType {
  [key: string]: ThemeColor
}

interface UsersType {
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

const roleColors: ColorsType = {
  ceo: 'error',
  admin: 'info',
  teacher: 'warning',
  director: 'success'
}

const branchColors: ColorsType = {
  4: 'warning',
  2: 'error',
  3: 'success',
  1: 'info'
}

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

const UserViewLeft = ({ userData }: { userData?: UsersType | undefined }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [data, setData] = useState<UsersType | undefined>(userData)
  const [loading, setLoading] = useState<boolean>(false)

  // Hooks
  const { t } = useTranslation()
  const { updateEmployee } = useEmployee()

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const form: any = document.getElementById('edit-employee')
    const formData = new FormData(form)
    for (const [key, value] of formData) {
      if (key === 'branches' || key === 'roles') {
        if (value === '') {
          setLoading(false)
          handleEditClose()

          return toast.error("Filial yoki Rol bo'sh bo'lmasligi kerak", {
            position: 'top-center',
            duration: 3000
          })
        }
      }

    }
    const employeeData = await updateEmployee(data?.id, formData, 'one')
    setData(employeeData)
    toast.success('Muvaffaqiyatli yangilandi', {
      position: 'top-center'
    })
    setLoading(false)
    handleEditClose()
  }

  useEffect(() => {
    setData(userData)
  }, [userData])

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data?.image ? (
                <CustomAvatar
                  src={data.image}
                  variant='rounded'
                  alt={data.first_name}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={'primary'}
                  sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data.first_name)}
                </CustomAvatar>
              )}
              <Typography variant='h6' sx={{ mb: 2 }}>
                {data.first_name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {data.roles.map(role => {
                  return role.exists ? (
                    <CustomChip
                      skin='light'
                      size='small'
                      label={role.name}
                      color={roleColors[role.name.toLocaleLowerCase()]}
                      sx={{
                        height: 20,
                        fontWeight: 600,
                        borderRadius: '5px',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { mt: -0.25 }
                      }}
                    />
                  ) : (
                    ''
                  )
                })}
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant='h6'>{t('Izoh')}</Typography>
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t('phone')}:</Typography>
                  <Typography variant='body2'>{data.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t('birth_date')}:</Typography>
                  <Typography variant='body2'>{data.birth_date}</Typography>
                </Box>
              </Box>
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t('branch')}:</Typography>
                  <Box
                    sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
                  >
                    {data.branches.map((branch, index) => {
                      return branch.exists ? (
                        <CustomChip
                          skin='light'
                          size='small'
                          label={branch.name}
                          color={branchColors[index + 1]}
                          sx={{
                            height: 20,
                            fontWeight: 600,
                            borderRadius: '5px',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { mt: -0.25 }
                          }}
                        />
                      ) : (
                        ''
                      )
                    })}
                  </Box>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                {t('Tahrirlash')}
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby='user-view-edit-description'
            >
              <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                {t("Xodim ma'lumotlarini tahrirlash")}
              </DialogTitle>
              <DialogContent>
                <form style={{ marginTop: 10 }} onSubmit={handleSubmit} id='edit-employee'>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        size='small'
                        fullWidth
                        label={t('first_name')}
                        name='first_name'
                        defaultValue={data.first_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField size='small' fullWidth label={t('phone')} name='phone' defaultValue={`${data.phone}`} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id='user-view-language-label'>{t('branch')}</InputLabel>
                        <Select
                          size='small'
                          label={t('branch')}
                          multiple
                          defaultValue={
                            data.branches.find(el => el.exists)
                              ? [...data.branches.filter(el => el.exists).map(el => el.id)]
                              : []
                          }
                          id='user-view-language'
                          labelId='user-view-language-label'
                          name='branches'
                        >
                          {data.branches.map(branch => (
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
                            data.roles.find(el => el.exists)
                              ? [...data.roles.filter(el => el.exists).map(el => el.id)]
                              : []
                          }
                          id='user-view-language'
                          labelId='user-view-language-label'
                          name='roles'
                        >
                          {data.roles.map(branch => (
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
                          {t("Rasm qo'shish")}
                          <VisuallyHiddenInput
                            name='image'
                            type='file'
                            accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic'
                          />
                        </Button>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField size='small' fullWidth label={t('Yangi parol')} name='password' />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={loading} variant='contained' sx={{ mr: 1 }} onClick={handleSubmit}>
                  {t('Saqlash')}
                </LoadingButton>
                <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                  {t('Bekor qilish')}
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
