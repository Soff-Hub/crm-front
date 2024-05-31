import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  Menu,
  Pagination,
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
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'
import useStudent from 'src/hooks/useStudents'
import useGroups from 'src/hooks/useGroups'
import useDebounce from 'src/hooks/useDebounce'
import { useRouter } from 'next/router'
import Status from 'src/@core/components/status'
import useCourses from 'src/hooks/useCourses'
import useResponsive from 'src/@core/hooks/useResponsive'
import { today } from 'src/@core/components/card-statistics/kanban-item'

export interface customTableProps {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: any) => any | undefined
}

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 350,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

export default function GroupsPage() {
  const [openAddGroup, setOpenAddGroup] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [isGroup, setIsGroup] = useState(false)
  const [isPassword, setIsPassword] = useState(false)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [search, setSearch] = useState<string>('')


  const { t } = useTranslation()
  const router = useRouter()
  const { loading, setLoading } = useTeachers()
  const { students, getStudents, getStudentById, studentData, updateStudent, setStudentData, createStudent, deleteStudent } = useStudent()
  const { groups, getGroups } = useGroups()
  const [error, setError] = useState<any>({})
  const { getCourses, courses } = useCourses()
  const { isMobile } = useResponsive()
  const { query } = useRouter()

  const searchDebounce = useDebounce(search, 1000)

  const handleCloseAddModal = () => {
    setIsGroup(false)
    setIsPassword(false)
    setStudentData(null)
    setError({})
  }

  const handleActivateStudent = async (id: string | number) => {
    try {
      await updateStudent(id, { status: 'active' })
      await getStudents(searchDebounce)
      toast.success("O'quvchi aktivlashtirildi", { position: 'top-center' })
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleDeleteTeacher = async (id: string | number) => {
    try {
      await deleteStudent(id)
      await getStudents(searchDebounce)
      toast.success("O'quvchilar ro'yxatidan o'chirildi", { position: 'top-center' })
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleEdit = async (id: any) => {
    await getStudentById(id)
    setOpenEdit(true)
    if (groups.length < 1) {
      await getGroups()
    }
  }

  const handleEditSubmit = async (values: any) => {
    setLoading(true)
    const valuesNew = { ...values, gender }
    try {
      await updateStudent(studentData?.id, valuesNew)
      await getStudents(searchDebounce)
      setLoading(false)
      setOpenEdit(false)
      setStudentData(null)
    } catch (err: any) {
      setLoading(false)
      showResponseError(err.response.data, setError)
    }

  }

  const RowOptions = ({ id }: { id: number | string }) => {
    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
    const [recoveModal, setRecoveModal] = useState<boolean>(false)

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
            href={`/students/view/security?student=${id}`}
          >
            <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
            {t("Ko'rish")}
          </MenuItem>
          <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
            {t("Tahrirlash")}
          </MenuItem>
          {
            query?.status === 'archive' ? (
              <MenuItem onClick={() => setRecoveModal(true)} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='bytesize:reload' fontSize={20} />
                {t("Tiklash")}
              </MenuItem>
            ) : (
              <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                {t("O'chirish")}
              </MenuItem>
            )
          }
        </Menu>
        <UserSuspendDialog handleOk={() => handleDeleteTeacher(id)} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
        <UserSuspendDialog handleOk={() => handleActivateStudent(id)} open={recoveModal} setOpen={setRecoveModal} okText='Tiklash' />
      </>
    )
  }

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t("ID"),
      dataIndex: 'index'
    },
    {
      xs: 1.4,
      title: t("first_name"),
      dataIndex: 'first_name'
    },
    {
      xs: 1.1,
      title: t("phone"),
      dataIndex: 'phone'
    },
    {
      xs: 1.3,
      title: t("Guruhlar"),
      dataIndex: 'group',
      render: (group: {
        group_data: {
          id: number
          name: string
        }
        start_at: string
      }[]) => group.map((item, i) => (
        <Typography fontSize={12} key={i}>
          {item.start_at} {" - "}
          {item.group_data.name}
        </Typography>
      ))
    },
    {
      xs: 1.3,
      title: t("O'qituvchilari"),
      dataIndex: 'group',
      render: (group: {
        teacher: {
          id: number | string
          first_name: string
          phone: string
        }
      }[]) => group.map((item) => (
        <Typography fontSize={12} key={item.teacher.id}>
          {item.teacher.first_name}
        </Typography>
      ))
    },
    {
      xs: 0.7,
      title: t("Balans"),
      dataIndex: 'balance',
      render: (balance: string) => `${+balance} so'm`
    },
    {
      xs: 0.8,
      dataIndex: 'id',
      title: t("Harakatlar"),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const handleAddTeacher = async (values: any) => {
    setLoading(true)
    const newValues = { ...values }
    if (isGroup) {
      Object.assign(newValues, { group: [values.group] })
    }
    try {
      await createStudent(newValues)
      await getStudents(searchDebounce)
      const form: any = document.getElementById('create-teacher-form')
      form.reset()
      setOpenAddGroup(false)
      setLoading(false)
    } catch (error: any) {
      showResponseError(error.response.data, setError)
      setLoading(false)
    }
  }

  const handlePagination = (page: any) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    })
  }

  const rowClick = (id: any) => {
    router.push(`/students/view/security?student=${id}`)
  }


  useEffect(() => {
    getStudents(searchDebounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce, router.query])


  useEffect(() => {
    getCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t("O'quvchilar")}</Typography>
        <Button
          onClick={() => setOpenAddGroup(true)}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: '20px', flexDirection: isMobile ? 'column' : 'row' }}>
        <TextField fullWidth placeholder={t('Qidirish')} onChange={(e: any) => setSearch(e.target.value)} size='small' />

        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Kurslar')}</InputLabel>
          <Select
            size='small'
            label={t('Kurslar')}
            defaultValue=''
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => router.replace({
              pathname: router.pathname,
              query: e.target.value === '' ? {} : { ...router.query, course: e.target.value }
            })}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {
              courses.map(course => (
                <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>{t('Holat')}</InputLabel>
            <Select
              size='small'
              label={t('Holat')}
              defaultValue=''
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              onChange={(e: any) => router.replace({
                pathname: router.pathname,
                query: { ...router.query, status: e.target.value }
              })}
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'active'}>{t('aktiv')}</MenuItem>
              <MenuItem value={'archive'}>{t('arxiv')}</MenuItem>
              <MenuItem value={'new'}>{t('sinov')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <DataTable columns={columns} data={students.data} rowClick={rowClick} />
      {students.count > 9 && <Pagination defaultPage={router?.query?.page ? Number(router?.query?.page) : 1} count={Math.ceil(students.count / 10)} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(page)} />}

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
            {t("O'quvchi qo'shish")}
          </Typography>
          <IconButton
            onClick={() => (setOpenAddGroup(false), handleCloseAddModal())}
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
          <Form valueTypes='json' onSubmit={handleAddTeacher} id='create-teacher-form' setError={setError} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("first_name")} name='first_name' error={error.first_name?.error} />
              <FormHelperText error={error.first_name}>{error.first_name?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("phone")} name='phone' error={error.phone} defaultValue={"+998"} />
              <FormHelperText error={error.phone?.error}>{error.phone?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='date' label={t("birth_date")} name='birth_date' error={error.birth_date} defaultValue={today} />
              <FormHelperText error={error.birth_date?.error}>{error.birth_date?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10 }}>
              <FormLabel>
                <Radio checked={gender === "male"} onChange={() => setGender('male')} />
                <span>{t('Erkak')}</span>
              </FormLabel>
              <FormLabel>
                <Radio checked={gender === "female"} onChange={() => setGender('female')} />
                <span>{t('Ayol')}</span>
              </FormLabel>
            </FormControl>

            {
              isGroup ? (
                <FormControl fullWidth>
                  <InputLabel size='small' id='user-view-language-label'>{t('Guruhlar')}</InputLabel>
                  <Select
                    size='small'
                    error={error.group?.error}
                    label={t('Guruhlar')}
                    id='user-view-language'
                    labelId='user-view-language-label'
                    name='group'
                    defaultValue=''
                    sx={{ mb: 1 }}
                  >
                    {
                      groups.map(branch => <MenuItem key={branch.id} value={Number(branch.id)}>{branch.name}</MenuItem>)
                    }
                  </Select>
                  <FormHelperText error={error.branches?.error}>{error.branches?.message}</FormHelperText>

                  <TextField size='small' type='date' label={t("Qo'shilish sanasi")} name='start_at' error={error.start_at} defaultValue={today} />
                  <FormHelperText error={error.start_at?.error}>{error.start_at?.message}</FormHelperText>
                </FormControl>
              ) : ''
            }

            {
              isPassword ? (
                <FormControl sx={{ width: '100%' }}>
                  <TextField size='small' label={t("password")} name='password' error={error.password} />
                  <FormHelperText error={error.password?.error}>{error.password?.message}</FormHelperText>
                </FormControl>
              ) : ''
            }

            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t('Saqlash')}</LoadingButton>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              {!isGroup && <Button onClick={() => (getGroups(), setIsGroup(true))} type='button' variant='outlined' size='small' startIcon={<IconifyIcon icon={'material-symbols:add'} />}>{t("Guruhga qo'shish")}</Button>}
              {!isPassword && <Button onClick={() => setIsPassword(true)} type='button' variant='outlined' size='small' color='warning' startIcon={<IconifyIcon icon={'lucide:key-round'} />}>{t("Parol qo'shish")}</Button>}
            </Box>
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
            {t("O'quvchi tahrirlash")}
          </Typography>
          <IconButton
            onClick={() => (setOpenEdit(false), handleCloseAddModal())}
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
          {studentData && <Form valueTypes='json' onSubmit={handleEditSubmit} id='edit-teacher-form' setError={setError} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("first_name")} name='first_name' error={error.first_name?.error} defaultValue={studentData?.first_name} />
              <FormHelperText error={error.first_name}>{error.first_name?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("phone")} name='phone' error={error.phone} defaultValue={studentData.phone} />
              <FormHelperText error={error.phone?.error}>{error.phone?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='date' label={t("birth_date")} name='birth_date' error={error.birth_date} defaultValue={studentData.birth_date} />
              <FormHelperText error={error.birth_date?.error}>{error.birth_date?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10 }}>
              <FormLabel onClick={() => setGender('male')}>
                <Radio checked={gender === "male"} defaultChecked={studentData.gender === "male"} />
                <span>{t("Erkak")}</span>
              </FormLabel>
              <FormLabel onClick={() => setGender('female')}>
                <Radio checked={gender === "female"} defaultChecked={studentData.gender === "female"} />
                <span>{t('Ayol')}</span>
              </FormLabel>
            </FormControl>

            {
              isPassword ? (
                <FormControl sx={{ width: '100%' }}>
                  <TextField size='small' label={t("password")} name='password' error={error.password} />
                  <FormHelperText error={error.password?.error}>{error.password?.message}</FormHelperText>
                </FormControl>
              ) : ''
            }

            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t('Saqlash')}</LoadingButton>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              {!isPassword && <Button onClick={() => setIsPassword(true)} type='button' variant='outlined' size='small' color='warning' startIcon={<IconifyIcon icon={'lucide:key-round'} />}>{t("Parol qo'shish")}</Button>}
            </Box>
          </Form>}
        </Box>
      </Drawer>
    </div >
  )
}
