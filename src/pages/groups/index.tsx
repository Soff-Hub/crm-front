import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  InputLabel,
  Pagination,
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
import showResponseError from 'src/@core/utils/show-response-error';
import LoadingButton from '@mui/lab/LoadingButton';
import { GroupsFilter } from 'src/views/apps/groups/GroupsFilter';
import useResponsive from 'src/@core/hooks/useResponsive';
import useGroups from 'src/hooks/useGroups';
import { useRouter } from 'next/router';
import useCourses from 'src/hooks/useCourses';
import useRooms from 'src/hooks/useRooms';
import api from 'src/@core/utils/api';
import getMontName from 'src/@core/utils/gwt-month-name';
import getLessonDays from 'src/@core/utils/getLessonDays';
import { today } from 'src/@core/components/card-statistics/kanban-item';
import RowOptions from 'src/views/apps/groups/RowOptions';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchGroups, handleOpenEdit } from 'src/store/apps/groups';

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

export const TranslateWeekName: any = {
  monday: "Dushanba",
  tuesday: "Seshanba",
  wednesday: "Chorshanba",
  thursday: "Payshanba",
  friday: "Juma",
  saturday: "Shanba",
  sunday: "Yakshanba"
}


export default function GroupsPage() {
  const { isOpenEdit, groups, isLoading, groupCount } = useAppSelector(state => state.groups)
  const dispatch = useAppDispatch()

  const [openAddGroup, setOpenAddGroup] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const [weekdays, setWeekDays] = useState<any>(null)
  const [customWeekdays, setCustomWeekDays] = useState<string[]>([])

  const { getTeachers, teachers, loading, setLoading } = useTeachers()
  const { getGroups, createGroup, setGroupData, groupData, updateGroup } = useGroups()
  const { courses, getCourses } = useCourses()
  const { rooms, getRooms } = useRooms()
  const router = useRouter()
  const { push } = router
  const [error, setError] = useState<any>({})

  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t("ID"),
      dataIndex: 'index'
    },
    {
      xs: 1,
      title: t("Guruh nomi"),
      dataIndex: 'name'
    },
    {
      xs: 1,
      title: t("Kurs"),
      dataIndex: 'course_name'
    },
    {
      xs: 1.4,
      title: t("O'qituvchi"),
      dataIndex: 'teacher_name'
    },
    {
      xs: 1,
      title: t("Dars Kunlari"),
      dataIndex: 'week_days',
      render: (week_days: any) => getLessonDays(week_days)
    },
    {
      xs: 1,
      title: t("Dars vaqti"),
      dataIndex: 'start_at',
      render: (time) => time.split(':').splice(0, 2).join(':')
    },
    {
      xs: 1,
      title: t("O'quvchilar soni"),
      dataIndex: 'student_count'
    },
    {
      xs: 1,
      title: t("Ochilgan sana"),
      dataIndex: 'start_date'
    },
    {
      xs: 1.4,
      dataIndex: 'id',
      title: t("Harakatlar"),
      render: actions => <RowOptions id={actions} />
    }
  ]

  const reqiuredFields: string[] = ['first_name', 'birth_date', 'phone']

  const handleAddTeacher = async (values: any) => {
    setLoading(true)
    const obj = { ...values }
    if (!weekdays || weekdays === 0) {
      Object.assign(obj, { day_of_week: customWeekdays })
    } else {
      Object.assign(obj, { day_of_week: weekdays.split(',') })
    }
    try {
      await createGroup(obj)
      await dispatch(fetchGroups({ query: router.query, status: router.query.status }))
      setLoading(false)
      setOpenAddGroup(false)
    } catch (error: any) {
      setLoading(false)
      showResponseError(error.response.data, setError)
    }
  }

  const handleOpen = () => {
    getCourses()
    getTeachers()
    getRooms()
    setOpenAddGroup(true)
  }

  const handleEditSubmit = async (values: any) => {
    setLoading(true)
    const obj = { ...values }
    const days = {}


    if ((weekdays === null || weekdays === 0) && customWeekdays.length > 0) {
      Object.assign(days, { day_of_week: customWeekdays })
    } else {
      Object.assign(days, { day_of_week: values.day_of_week.split(',') })
    }

    try {
      await updateGroup(groupData?.id, obj)
      console.log(days);
      await api.post('common/lesson-days-update/', {
        group: groupData?.id,
        ...days
      })
      dispatch(handleOpenEdit(false))
      getGroups()
      setLoading(false)
      setGroupData(null)
      setWeekDays(null)
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  }

  const handlePagination = (page: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page }
    })
  }

  const rowClick = (id: any) => {
    push(`/groups/view/security?id=${id}&month=${getMontName(null)}`)
  }

  useEffect(() => {
    dispatch(fetchGroups({ query: router.query, status: router.query.status }))
  }, [router.query])


  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t("Guruhlar")}</Typography>
        <Button
          onClick={handleOpen}
          variant='contained'
          size='small'
          startIcon={<IconifyIcon icon='ic:baseline-plus' />}
        >
          {t("Yangi qo'shish")}
        </Button>
      </Box>
      {isMobile && (
        <Button size='small' sx={{ marginLeft: 'auto' }} variant='outlined' onClick={() => setOpen(true)}>
          {t('Filterlash')}
        </Button>
      )}
      {!isMobile && <GroupsFilter isMobile={isMobile} />}
      <DataTable columns={columns} loading={isLoading} data={groups || []} rowClick={rowClick} color />
      {groups !== null && groups?.length > 0 && <Pagination defaultPage={router?.query?.page ? Number(router?.query?.page) : 1} count={groupCount} variant="outlined" shape="rounded" onChange={(e: any, page) => handlePagination(e.target.value + page)} />}

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
            {t("Guruh qo'shish")}
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
          <Form valueTypes='json' onSubmit={(values: any) => handleAddTeacher(values)} reqiuredFields={reqiuredFields} id='create-teacher-form' setError={setError} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("Guruh nomi")} name='name' error={error.name?.error} />
              <FormHelperText error={error.name}>{error.name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("Kurslar")}</InputLabel>
              <Select
                size='small'
                error={error.course?.error}
                label={t("Kurslar")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='course'
                defaultValue={''}
              >
                {
                  courses.map(course => <MenuItem key={course.id} value={+course.id}>{course.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.course?.error}>{error.course?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("O'qituvchi")}</InputLabel>
              <Select
                size='small'
                error={error.teacher?.error}
                label={t("O'qituvchi")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='teacher'
                defaultValue={''}
              >
                {
                  teachers.map(teacher => <MenuItem key={teacher.id} value={+teacher.id}>{teacher.first_name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.teacher?.error}>{error.teacher?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("Xonalar")}</InputLabel>
              <Select
                size='small'
                error={error.room?.error}
                label={t('Xonalar')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='room'
                defaultValue={''}
              >
                {
                  rooms.map(branch => <MenuItem key={branch.id} value={+branch.id}>{branch.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.room?.error}>{error.room?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("Oylik to'lovi")} name='monthly_amount' error={error.monthly_amount} />
              <FormHelperText error={error.monthly_amount?.error}>{error.monthly_amount?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='date' label={t("Boshlanish sanasi")} defaultValue={today} name='start_date' error={error.start_date} />
              <FormHelperText error={error.start_date?.error}>{error.start_date?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("Hafta kunlari")}</InputLabel>
              <Select
                size='small'
                label="Kunlar boyicha"
                id='demo-simple-select-outlined'
                name='day_of_week'
                labelId='demo-simple-select-outlined-label'
                onChange={(e) => setWeekDays(e.target.value)}
              >
                <MenuItem selected value={`tuesday,thursday,saturday`}>Juft kunlari</MenuItem>
                <MenuItem value={`monday,wednesday,friday`}>Toq kunlari</MenuItem>
                <MenuItem value={`tuesday,thursday,saturday,monday,wednesday,friday`}>Har kuni</MenuItem>
                <MenuItem value={0}>Boshqa</MenuItem>
              </Select>
              <FormHelperText error={error.room?.error}>{error.room?.message}</FormHelperText>
            </FormControl>

            {
              weekdays === 0 ?
                (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {
                      ['tuesday', 'thursday', 'saturday', 'monday', 'wednesday', 'friday', 'sunday'].map(el => (
                        <label
                          key={el}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row-reverse',
                            border: '1px solid #c3cccc',
                            padding: '0 5px',
                            borderRadius: '7px',
                            gap: '4px',
                            cursor: 'pointer'
                          }}>
                          <span>{t(el)}</span>
                          <input type='checkbox' onChange={() => setCustomWeekDays(customWeekdays.includes(el) ? [...customWeekdays.filter(item => item !== el)] : [...customWeekdays, el])} />
                        </label>
                      ))
                    }
                  </Box>
                ) : ''
            }

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='time' label={t("Boshlanish vaqti")} name='start_at' error={error.start_at} />
              <FormHelperText error={error.start_at?.error}>{error.start_at?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='time' label={t("Tugash vaqti")} name='end_at' error={error.end_at} />
              <FormHelperText error={error.end_at?.error}>{error.end_at?.message}</FormHelperText>
            </FormControl>


            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
          </Form>
        </Box>
      </Drawer>

      <Drawer open={isOpenEdit} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t("Guruh malumotlarini tahrirlash")}
          </Typography>
          <IconButton
            onClick={() => (dispatch(handleOpenEdit(false)), setGroupData(null))}
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
          {groupData && <Form valueTypes='json' onSubmit={(values: any) => handleEditSubmit(values)} reqiuredFields={reqiuredFields} id='edit-teacher-form' setError={setError} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("Guruh nomi")} name='name' error={error.name?.error} defaultValue={groupData.name} />
              <FormHelperText error={error.name}>{error.name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("Kurslar")}</InputLabel>
              <Select
                size='small'
                error={error.course?.error}
                label={t('Kurslar')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='course'
                defaultValue={courses.find(el => el.id === groupData.course_data.id)?.id || ''}
              >
                {
                  courses.map(course => <MenuItem key={course.id} value={+course.id}>{course.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.course?.error}>{error.course?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("O'qituvchi")}</InputLabel>
              <Select
                size='small'
                error={error.teacher?.error}
                label={t("O'qituvchi")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='teacher'
                defaultValue={teachers.find(el => el.id === groupData.teacher_data.id)?.id || ''}
              >
                {
                  teachers.map(teacher => <MenuItem key={teacher.id} value={+teacher.id}>{teacher.first_name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.teacher?.error}>{error.teacher?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("Xonalar")}</InputLabel>
              <Select
                size='small'
                error={error.room?.error}
                label={t('Xonalar')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='room'
                defaultValue={rooms.find(el => el.id === groupData.room_data.id)?.id || ''}
              >
                {
                  rooms.map(branch => <MenuItem key={branch.id} value={+branch.id}>{branch.name}</MenuItem>)
                }
              </Select>
              <FormHelperText error={error.room?.error}>{error.room?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' label={t("Oylik to'lovi")} name='monthly_amount' error={error.monthly_amount} defaultValue={groupData.monthly_amount} />
              <FormHelperText error={error.monthly_amount?.error}>{error.monthly_amount?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='date' label={t("Boshlanish sanasi")} name='start_date' error={error.start_date} defaultValue={groupData.start_date} />
              <FormHelperText error={error.start_date?.error}>{error.start_date?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t("Hafta kunlari")}</InputLabel>
              <Select
                size='small'
                label="Kunlar boyicha"
                id='demo-simple-select-outlined'
                name='day_of_week'
                labelId='demo-simple-select-outlined-label'
                onChange={(e) => setWeekDays(e.target.value)}
                defaultValue={
                  groupData.day_of_week.join(',') === 'tuesday,thursday,saturday' ?
                    'tuesday,thursday,saturday' :
                    groupData.day_of_week.join(',') === 'monday,wednesday,friday' ?
                      'monday,wednesday,friday' :
                      groupData.day_of_week.join(',') === 'tuesday,thursday,saturday,monday,wednesday,friday' ?
                        'tuesday,thursday,saturday,monday,wednesday,friday' : 0
                }
              >
                <MenuItem value={`tuesday,thursday,saturday`}>Juft kunlari</MenuItem>
                <MenuItem value={`monday,wednesday,friday`}>Toq kunlari</MenuItem>
                <MenuItem value={`tuesday,thursday,saturday,monday,wednesday,friday`}>Har kuni</MenuItem>
                <MenuItem value={0}>Boshqa</MenuItem>
              </Select>
              <FormHelperText error={error.room?.error}>{error.room?.message}</FormHelperText>
            </FormControl>

            {
              ((
                groupData.day_of_week.join(',') !== 'tuesday,thursday,saturday' &&
                groupData.day_of_week.join(',') !== 'monday,wednesday,friday' &&
                groupData.day_of_week.join(',') !== 'tuesday,thursday,saturday,monday,wednesday,friday'
              ) && weekdays === null) || weekdays === 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {
                    ['tuesday', 'thursday', 'saturday', 'monday', 'wednesday', 'friday', 'sunday'].map(el => (
                      <label
                        key={el}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'row-reverse',
                          border: '1px solid #c3cccc',
                          padding: '0 5px',
                          borderRadius: '7px',
                          gap: '4px',
                          cursor: 'pointer'
                        }}>
                        <span>{t(el)}</span>
                        <input type='checkbox' onChange={() => (setCustomWeekDays((current: any) => current.includes(el) ? [...current.filter((item: any) => item !== el)] : [...current, el]))} defaultChecked={customWeekdays.includes(el)} />
                      </label>
                    ))
                  }
                </Box>
              ) : ''
            }

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='time' label={t("Boshlanish vaqti")} name='start_at' error={error.start_at} defaultValue={groupData.start_at} />
              <FormHelperText error={error.start_at?.error}>{error.start_at?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <TextField size='small' type='time' label={t("Tugash vaqti")} name='end_at' error={error.end_at} defaultValue={groupData.end_at} />
              <FormHelperText error={error.end_at?.error}>{error.end_at?.message}</FormHelperText>
            </FormControl>


            <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>{t("Saqlash")}</LoadingButton>
          </Form>}
        </Box>
      </Drawer>

      <Dialog fullScreen onClose={() => setOpen(false)} aria-labelledby='full-screen-dialog-title' open={open}>
        <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            {t('Modal title')}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => setOpen(false)}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <GroupsFilter isMobile={isMobile} />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => setOpen(false)}>{t('Davom etish')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
