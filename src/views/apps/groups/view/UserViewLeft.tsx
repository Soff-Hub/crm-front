// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
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
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon';

import { FormHelperText, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import Form from 'src/@core/components/form';
import useTeachers from 'src/hooks/useTeachers';
import showResponseError from 'src/@core/utils/show-response-error';
import { addPeriodToThousands } from 'src/pages/settings/office/courses';
import { GroupType } from 'src/@fake-db/types';
import Link from 'next/link';
import UserViewStudentsList from './UserViewStudentsList';
import api from 'src/@core/utils/api';
import { useRouter } from 'next/router';
import useDebounce from 'src/hooks/useDebounce';
import { AuthContext } from 'src/context/AuthContext';
import { TranslateWeekName } from 'src/pages/groups';
import getLessonDays from 'src/@core/utils/getLessonDays';
import toast from 'react-hot-toast';
import Status from 'src/@core/components/status';
import useGroups from 'src/hooks/useGroups';
import useSMS from 'src/hooks/useSMS';
import useCourses from 'src/hooks/useCourses';
import useRooms from 'src/hooks/useRooms';
import { today } from 'src/@core/components/card-statistics/kanban-item';

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  ceo: 'error',
  admin: 'info',
  teacher: 'warning',
  director: 'success',
}

type ActionTypes = 'delete' | 'send-sms' | 'add-student' | 'notes' | 'edit'


const UserViewLeft = ({ userData, reRender }: { userData?: any, reRender: any }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<ActionTypes | null>(null)
  const [data, setData] = useState<GroupType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const [file, setFile] = useState<any>(null)
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState<string>('')
  const [searchData, setSearchData] = useState<any[]>([])
  const [selectedStudents, setSelectedStudents] = useState<any>(null)
  const searchDebounce = useDebounce(search, 500)
  const [weekdays, setWeekDays] = useState<any>(null)
  const [customWeekdays, setCustomWeekDays] = useState<string[]>([])
  const [archiveUrl, setArchiveUrl] = useState<'active,new' | 'archive'>('active,new')

  // Hooks
  const { t } = useTranslation()
  const { updateTeacher, teachers, getTeachers } = useTeachers()
  const { query } = useRouter()
  const { user } = useContext(AuthContext)
  const { mergeStudentToGroup, updateGroup } = useGroups()
  const [sms, setSMS] = useState<any>("")
  const { smsTemps, getSMSTemps } = useSMS()
  const { courses, getCourses } = useCourses()
  const { rooms, getRooms } = useRooms()

  // Handle Edit dialog
  const handleEditClickOpen = (type: ActionTypes) => setOpenEdit(type)
  const handleEditClose = () => {
    setError({})
    setOpenEdit(null)
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

  const handleAddNote = async (value: any) => {
    console.log(value);
  }

  const getStudents = async () => {
    try {
      const resp = await api.get(`common/group/students/${query.id}?status=${archiveUrl}`)
      setStudents(resp.data)
    } catch (err) {
      console.log(err)
    }
  }

  const searchStudent = async () => {
    setSearchData([])
    const resp = await api.get('auth/student/list/?search=' + searchDebounce)
    setSearchData(resp.data.results)
  }

  const smsDepartmentItem = async (values: any) => {
    setLoading(true)
    console.log({
      users: students.map((el: any) => Number(el.student.id)),
      message: values.message
    });

    try {
      await api.post(`common/send-message-user/`, {
        users: students.map((el: any) => Number(el.student.id)),
        message: values.message
      })
      toast.success('SMS muvaffaqiyatli jo\'natildi!', {
        position: 'top-center'
      })
      handleEditClose()
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  const handleMergeToGroup = async (values: any) => {
    setLoading(true)
    const data = {
      ...values,
      student: selectedStudents,
      group: [userData?.id]
    }

    try {
      await mergeStudentToGroup(data)
      setLoading(false)
      setOpenEdit(null)
      getStudents()

      return await reRender()
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
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
      await updateGroup(data?.id, obj)
      await api.post('common/lesson-days-update/', {
        group: data?.id,
        ...days
      })
      reRender()
      setOpenEdit(null)
      setLoading(false)
      setWeekDays(null)
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  }


  useEffect(() => {
    setData(userData)
  }, [userData])

  useEffect(() => {
    getStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveUrl])

  useEffect(() => {
    if (searchDebounce !== '') {
      searchStudent()
    } else {
      setSearchData([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce])


  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ my: 1, display: 'flex', gap: '50px' }}>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <CustomAvatar skin='light' variant='rounded' color='warning'>
                    <IconifyIcon icon='solar:medal-ribbon-star-broken' />
                  </CustomAvatar>
                  <div>
                    <Typography>{data.name}</Typography>
                    <Typography variant='body2'>{data.course_data.name}</Typography>
                  </div>
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <CustomAvatar skin='light' variant='rounded'>
                    <IconifyIcon icon='la:users' />
                  </CustomAvatar>
                  <div>
                    <Typography>O'quvchilar soni</Typography>
                    <Typography variant='body2'>{data.student_count} ta</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography>Yo'nalishi:</Typography>
                {
                  !(user?.role.length === 1 && user?.role.includes('teacher') )? (
                    <Link href={`/settings/office/courses/`}>
                      <CustomChip
                        skin='light'
                        size='small'
                        label={data.course_data.name}
                        color={roleColors['director']}
                        sx={{
                          height: 20,
                          fontWeight: 600,
                          borderRadius: '5px',
                          fontSize: '0.875rem',
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { mt: -0.25 },
                          cursor: 'pointer'
                        }}
                      />
                    </Link>
                  ) : (
                    <CustomChip
                      skin='light'
                      size='small'
                      label={data.course_data.name}
                      color={roleColors['director']}
                      sx={{
                        height: 20,
                        fontWeight: 600,
                        borderRadius: '5px',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { mt: -0.25 },
                        cursor: 'pointer'
                      }}
                    />
                  )
                }

              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography>Dars:</Typography>
                <Typography>{data.room_data.name}da -{data.start_at}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography>{getLessonDays(data.day_of_week)}</Typography>
              </Box>
              <Box sx={{ pt: 2, pb: 1 }}>
                {
                  !(user?.role.length === 1 && user?.role.includes('teacher')) ? (
                    <Box sx={{ display: 'flex', mb: 2.7 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>O'qituvchi:</Typography>
                      <Link href={`/mentors/view/security/?id=${data.teacher_data.id}`}>
                        <Typography variant='body2'>
                          {data.teacher_data.first_name}
                        </Typography>
                      </Link>
                    </Box>
                  ) : ''
                }
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Ochilgan sana:</Typography>
                  <Typography variant='body2'>{data.start_date?.split('-').reverse().join(',')}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography>Filial:</Typography>
                <CustomChip
                  skin='light'
                  size='small'
                  label={data.branch_data.name}
                  color={roleColors['director']}
                  sx={{
                    height: 20,
                    fontWeight: 600,
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { mt: -0.25 }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography>Kurs narxi:</Typography>
                <CustomChip
                  skin='light'
                  size='small'
                  label={addPeriodToThousands(+data.monthly_amount) + " so'm"}
                  color={'secondary'}
                  sx={{
                    height: 20,
                    fontWeight: 600,
                    borderRadius: '5px',
                    fontSize: '0.875rem',
                    textTransform: 'capitalize',
                    '& .MuiChip-label': { mt: -0.25 }
                  }}
                />
              </Box>
            </CardContent>

            {
              !(user?.role.length === 1 && user?.role.includes('teacher')) ? (
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="O'chirish" placement='top'>
                    <Button variant='outlined' color='error' onClick={() => handleEditClickOpen('delete')}>
                      <IconifyIcon icon='mdi-light:delete' />
                    </Button>
                  </Tooltip>
                  <Tooltip title={t('Tahrirlash')} placement='top'>
                    <Button variant='outlined' color='success' onClick={() => {
                      getTeachers()
                      getCourses()
                      getRooms()
                      handleEditClickOpen('edit')
                    }}>
                      <IconifyIcon icon='circum:edit' />
                    </Button>
                  </Tooltip>
                  <Tooltip title="SMS yuborish" placement='top'>
                    <Button variant='outlined' color="warning" onClick={() => (getSMSTemps(), handleEditClickOpen('send-sms'))}>
                      <IconifyIcon icon='material-symbols-light:sms-outline' />
                    </Button>
                  </Tooltip>
                  <Tooltip title="O'quvchi qo'shish" placement='top'>
                    <Button variant='outlined' onClick={() => handleEditClickOpen('add-student')}>
                      <IconifyIcon icon='mdi:user-add-outline' />
                    </Button>
                  </Tooltip>
                </CardActions>
              ) : ''}
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                {
                  ['new', 'active', 'archive'].map(el => <div key={el} style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><Status color={el == 'active' ? 'success' : el == 'new' ? 'warning' : 'error'} /> {el == 'active' ? 'aktiv' : el == 'new' ? 'sinov' : 'arxiv'}</div>)
                }
              </div>
              <UserViewStudentsList data={students} reRender={getStudents} />
              <Box sx={{ width: '100%', display: 'flex', pt: '10px' }}>
                <Button
                  startIcon={<IconifyIcon style={{ fontSize: '12px' }} icon={`icon-park-outline:to-${archiveUrl === 'archive' ? 'top' : 'bottom'}`} />}
                  sx={{ fontSize: '10px', marginLeft: 'auto' }}
                  size='small'
                  color={archiveUrl === 'archive' ? 'primary' : 'error'}
                  variant='text'
                  onClick={() => {
                    if (archiveUrl === 'archive') {
                      setArchiveUrl('active,new')
                    } else setArchiveUrl('archive')
                  }}
                >
                  {
                    archiveUrl === 'archive' ? "Arxivni yopish" : "Arxivdagi o'quvchilarni ko'rish"
                  }
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        {/* SEND SMS */}
        <Dialog
          open={openEdit === 'send-sms'}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Barcha o'quvchilarga SMS yuboring
          </DialogTitle>
          <DialogContent>
            <Form setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={smsDepartmentItem} id='edit-employee-pay-ddas'>
              <FormControl sx={{ maxWidth: '100%', marginBottom: 3 }} fullWidth>
                <InputLabel size='small' id='demo-simple-select-outlined-label'>Shablonlar</InputLabel>
                <Select
                  size='small'
                  label="Shablonlar"
                  defaultValue=''
                  id='demo-simple-select-outlined'
                  labelId='demo-simple-select-outlined-label'
                  onChange={(e) => setSMS(e.target.value)}
                >
                  {
                    smsTemps.map((el: any) => (
                      <MenuItem value={el.description} sx={{ wordBreak: 'break-word' }}>
                        <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>
                          {el.description}
                        </span>
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  error={error?.message}
                  rows={4}
                  multiline
                  // label="SMS..."
                  name='message'
                  defaultValue={''}
                  value={sms}
                  onChange={(e) => setSMS(e.target.value)}
                />
                <FormHelperText error={error.message}>{error.message?.message}</FormHelperText>
              </FormControl>

              <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                  {t("Saqlash")}
                </LoadingButton>
                <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                  {t("Bekor Qilish")}
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        </Dialog>

        {/* ADD NOTE */}
        <Dialog
          open={openEdit === 'notes'}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Yangi eslatma yarating
          </DialogTitle>
          <DialogContent>
            <Form setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleAddNote} id='edit-employee-pay-ddas'>
              <FormControl fullWidth>
                <TextField
                  error={error?.description}
                  rows={4}
                  multiline
                  label="Eslatma..."
                  name='description'
                  defaultValue={''}
                />
                <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
              </FormControl>

              <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                  {t("Saqlash")}
                </LoadingButton>
                <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                  {t("Bekor Qilish")}
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        </Dialog>



        {/* ADD STUDENT */}
        <Dialog
          open={openEdit === 'add-student'}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 2] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Guruhga o'quvchi qo'shish
          </DialogTitle>
          <DialogContent>
            <Form setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleMergeToGroup} id='fwefsdfasfsd'>
              <FormControl fullWidth>
                <TextField size='small' label={t('first_name')} onChange={(e) => setSearch(e.target.value)} />
              </FormControl>
              <Typography
                variant='body2'
                mt={2}
                fontStyle={'italic'}
              >
                {searchData.length > 0 ? "Qidiruv natijalari..." : searchDebounce !== "" && searchData.length === 0 ? 'Natijalar topilmadi' : ''}
              </Typography>
              {
                searchData.map(user => (
                  <Box onClick={() => (setSearchData((c) => ([...c.filter(el => el.id !== selectedStudents)])), setSelectedStudents(user.id))} sx={{ display: 'flex', flexDirection: 'column', gap: '5px', py: '5px', px: '5px', backgroundColor: selectedStudents === user.id ? '#ccc' : 'transparent' }}>
                    <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' }}>
                      <Typography fontSize={14}>{`[ ${user.first_name} ]`}</Typography>
                      <Typography fontSize={14}>{user.phone}</Typography>
                      {selectedStudents === user.id && <IconifyIcon icon={'mdi:check'} fontSize={14} style={{ marginLeft: 'auto' }} />}
                    </Box>
                  </Box>
                ))
              }

              {selectedStudents && <FormControl sx={{ width: '100%', margin: '10px 0' }}>
                <TextField
                  type="date" size='small' label={t('Qo\'shilish sanasi')} name='start_date'
                  defaultValue={today}
                  style={{ background: 'transparent', width: '100%' }} />
                <FormHelperText sx={{ marginBottom: '10px' }} error={error.start_date?.error}>{error.start_date?.message}</FormHelperText>
              </FormControl>}


              {selectedStudents && <FormControl fullWidth>
                <TextField
                  error={error?.body}
                  rows={4}
                  multiline
                  label="Izoh"
                  name='body'
                  defaultValue={''}
                />
                <FormHelperText error={error.body}>{error.body?.message}</FormHelperText>
              </FormControl>}


              <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                  {t("Saqlash")}
                </LoadingButton>
                <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                  {t("Bekor Qilish")}
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        </Dialog>


        {/* DELETE */}
        <Dialog
          open={openEdit === 'delete'}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Guruh o'chirib tashlash
          </DialogTitle>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button variant='outlined' color='error' onClick={handleEditClose}>
              {t("Ha o'chirish")}
            </Button>
            <LoadingButton loading={loading} color='secondary' onClick={handleEditClose} variant='outlined' sx={{ mr: 1 }}>
              {t("Bekor Qilish")}
            </LoadingButton>
          </DialogActions>
        </Dialog>


        {/* ADD STUDENT */}
        <Dialog
          open={openEdit === 'edit'}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 2] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Guruhni tahrirlash
          </DialogTitle>
          <DialogContent>
            {teachers.length > 0 && rooms.length > 0 && courses.length > 0 && <Form valueTypes='json' onSubmit={(values: any) => handleEditSubmit(values)} id='dasdadasdasdqw' setError={setError} sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', padding: '20px 10px', gap: '10px' }}>
              <FormControl sx={{ width: '100%' }}>
                <TextField size='small' label={t("Guruh nomi")} name='name' error={error.name?.error} defaultValue={data.name} />
                <FormHelperText error={error.name}>{error.name?.message}</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>Kursni tanlash</InputLabel>
                <Select
                  size='small'
                  error={error.course?.error}
                  label={t('Kursni tanlash')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='course'
                  defaultValue={courses.find(el => el.id === data.course_data.id)?.id || ''}
                >
                  {
                    courses.map(course => <MenuItem key={course.id} value={+course.id}>{course.name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.course?.error}>{error.course?.message}</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>O'qituvchi</InputLabel>
                <Select
                  size='small'
                  error={error.teacher?.error}
                  label={t("O'qituvchi")}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='teacher'
                  defaultValue={teachers.find(el => el.id === data.teacher_data.id)?.id || ''}
                >
                  {
                    teachers.map(teacher => <MenuItem key={teacher.id} value={+teacher.id}>{teacher.first_name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.teacher?.error}>{error.teacher?.message}</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>Xona</InputLabel>
                <Select
                  size='small'
                  error={error.room?.error}
                  label={t('Xona')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='room'
                  defaultValue={rooms.find(el => el.id === data.room_data.id)?.id || ''}
                >
                  {
                    rooms.map(branch => <MenuItem key={branch.id} value={+branch.id}>{branch.name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.room?.error}>{error.room?.message}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField size='small' label={t("Oylik to'lovi")} name='monthly_amount' error={error.monthly_amount} defaultValue={data.monthly_amount} />
                <FormHelperText error={error.monthly_amount?.error}>{error.monthly_amount?.message}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField size='small' type='date' label={t("Boshlanish sanasi")} name='start_date' error={error.start_date} defaultValue={data.start_date} />
                <FormHelperText error={error.start_date?.error}>{error.start_date?.message}</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>Hafta kunlari</InputLabel>
                <Select
                  size='small'
                  label="Kunlar boyicha"
                  id='demo-simple-select-outlined'
                  name='day_of_week'
                  labelId='demo-simple-select-outlined-label'
                  onChange={(e) => setWeekDays(e.target.value)}
                  defaultValue={
                    data.day_of_week.join(',') === 'tuesday,thursday,saturday' ?
                      'tuesday,thursday,saturday' :
                      data.day_of_week.join(',') === 'monday,wednesday,friday' ?
                        'monday,wednesday,friday' :
                        data.day_of_week.join(',') === 'tuesday,thursday,saturday,monday,wednesday,friday' ?
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
                  data.day_of_week.join(',') !== 'tuesday,thursday,saturday' &&
                  data.day_of_week.join(',') !== 'monday,wednesday,friday' &&
                  data.day_of_week.join(',') !== 'tuesday,thursday,saturday,monday,wednesday,friday'
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
                          <span>{TranslateWeekName[el]}</span>
                          <input type='checkbox' onChange={() => (setCustomWeekDays((current: any) => current.includes(el) ? [...current.filter((item: any) => item !== el)] : [...current, el]))} defaultChecked={customWeekdays.includes(el)} />
                        </label>
                      ))
                    }
                  </Box>
                ) : ''
              }

              <FormControl sx={{ width: '100%' }}>
                <TextField size='small' type='time' label={t("Boshlanish vaqi")} name='start_at' error={error.start_at} defaultValue={data.start_at} />
                <FormHelperText error={error.start_at?.error}>{error.start_at?.message}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField size='small' type='time' label={t("Tugash vaqi")} name='end_at' error={error.end_at} defaultValue={data.end_at} />
                <FormHelperText error={error.end_at?.error}>{error.end_at?.message}</FormHelperText>
              </FormControl>


              <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>Saqlash</LoadingButton>
            </Form>}
          </DialogContent>
        </Dialog>
      </Grid >
    )
  } else {
    return null
  }
}

export default UserViewLeft
