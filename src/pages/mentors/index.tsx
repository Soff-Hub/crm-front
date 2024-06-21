import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  Radio,
  TextField,
  Typography,
} from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import IconifyIcon from 'src/@core/components/icon';
import DataTable from 'src/@core/components/table';
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import Form from 'src/@core/components/form';
import useTeachers from 'src/hooks/useTeachers';
import useBranches from 'src/hooks/useBranch';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/router';
import RowOptions from 'src/views/apps/mentors/RowOptions';
import AddMentorsModal from 'src/views/apps/mentors/AddMentorsModal';

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


export default function GroupsPage() {
  const [openAddGroup, setOpenAddGroup] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const { t } = useTranslation()

  const { createTeacher, getTeachers, teachers, loading, deleteTeacher, updateTeacher, setLoading, setTeachersData, teacherData, getTeacherById } = useTeachers()
  const { branches, getBranches } = useBranches()
  const { push } = useRouter()


  const handleEditSubmit = async (values: any) => {
    setLoading(true)
    // console.log(values);
    // values.append('roles', `${teacherData?.roles.filter(el => el.exists).map(el => el.id).join(',')}`)
    await updateTeacher(teacherData?.id, values).then(() => {
      getTeachers()
      setLoading(false)
      setOpenEdit(false)
      setTeachersData(undefined)
    }).catch(() => setLoading(false))

  }


  const [error, setError] = useState<any>({})
  const [gender, setGender] = useState<'male' | 'female'>('male')

  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t("ID"),
      dataIndex: 'index'
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
      xs: 1,
      dataIndex: 'id',
      title: t("Harakatlar"),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const reqiuredFields: string[] = ['first_name', 'phone']

  const rowClick = (id: any) => {
    push(`/mentors/view/security?id=${id}`)
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
          onClick={() => (setOpenAddGroup(true), getBranches())}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>
      <DataTable columns={columns} data={teachers} rowClick={rowClick} />

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
            {t("O'qituvchi qo'shish")}
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
        <AddMentorsModal />
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
            {t("O'qituvchi malumotlarini tahrirlash")}
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
                <span>{t("Erkak")}</span>
              </FormLabel>
              <FormLabel>
                <Radio checked={teacherData.gender === "female"} onChange={() => setGender('female')} />
                <span>{t("Ayol")}</span>
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
                {t("Rasm qo'shish")}
                <VisuallyHiddenInput name='image' type="file" accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic' />
              </Button>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField label={t("password")} name='password' error={error.password} />
              <FormHelperText error={error.password?.error}>{error.password?.message}</FormHelperText>
            </FormControl>

            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
          </Form> : ""}
        </Box>
      </Drawer>
    </div>
  )
}
