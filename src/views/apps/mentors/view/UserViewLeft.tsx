// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import LoadingButton from '@mui/lab/LoadingButton';
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
import IconifyIcon from 'src/@core/components/icon';

import { styled } from '@mui/material/styles';
import { FormHelperText } from '@mui/material';
import Form from 'src/@core/components/form';
import useTeachers from 'src/hooks/useTeachers';
import showResponseError from 'src/@core/utils/show-response-error';

interface ColorsType {
  [key: string]: ThemeColor
}

interface UsersType {
  id: 1,
  first_name: string,
  birth_date: string,
  password: string,
  branches: {
    id: number,
    name: string,
    exists: boolean
  }[],
  gender: 'male' | 'female',
  phone: string,
  roles: {
    id: number,
    name: string,
    exists: boolean
  }[],
  image: string | null,
  _groups: any[]
}

const roleColors: ColorsType = {
  ceo: 'error',
  admin: 'info',
  teacher: 'warning',
  director: 'success',
}

const branchColors: ColorsType = {
  4: 'warning',
  2: 'error',
  3: 'success',
  1: 'info',
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
  width: 1,
});




const UserViewLeft = ({ userData }: { userData?: UsersType | undefined }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [data, setData] = useState<UsersType | undefined>(userData)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const [file, setFile] = useState<any>(null)

  // Hooks
  const { t } = useTranslation()
  const { updateTeacher } = useTeachers()

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => {
    const form: any = document.getElementById('edit-employee')
    form.reset()
    setError({})
    setOpenEdit(false)
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    if (file) {
      values.append('image', file)
    }
    try {
      const employeeData = await updateTeacher(data?.id, values)
      setData(employeeData)
      setLoading(false)
      setFile(null)
      handleEditClose()
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }


  useEffect(() => {
    setData(userData)
  }, [userData])


  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 5, display: 'flex', gap: 5 }}>
              {data?.image ? (
                <CustomAvatar
                  src={data.image}
                  variant='rounded'
                  alt={data.first_name}
                  sx={{ width: 120, height: 120, fontWeight: 600, fontSize: '3rem' }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={'primary'}
                  sx={{ width: 120, height: 120, fontWeight: 600, fontSize: '3rem' }}
                >
                  {getInitials(data.first_name)}
                </CustomAvatar>
              )}
              <Box>
                <Typography variant='h6'>
                  {data.first_name}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: 10 }}>
                  <Typography variant='body2'>{t("Faol Guruhlari")}:  </Typography>
                  <Typography variant='body1' sx={{ lineHeight: 1.3 }}>
                    {data?._groups?.length || 0} ta
                  </Typography>
                </div>
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant='h6' sx={{ textAlign: 'center', mb: 4 }}>{t("Boshqa Tafsilotlar")}</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {t("Tizimdagi rollari")} : {
                  data.roles.map((role) => {
                    return role.exists ? (<CustomChip
                      key={role.id}
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
                    />) : ''
                  })
                }
              </Box>
              <Box sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t("phone")}:</Typography>
                  <Typography variant='body2'>{data.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t("birth_date")}:</Typography>
                  <Typography variant='body2'>{data.birth_date?.split('-').reverse().join(',')}</Typography>
                </Box>
              </Box>
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>{t("Biriktirilgan Filiallar")}:</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    {
                      data.branches.map((branch, index) => {
                        return branch.exists ? (<CustomChip
                          key={index}
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
                        />) : ''
                      })
                    }
                  </Box>
                </Box>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
