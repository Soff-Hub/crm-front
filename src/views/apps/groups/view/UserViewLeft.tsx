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

import { FormHelperText, Tooltip } from '@mui/material';
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

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  ceo: 'error',
  admin: 'info',
  teacher: 'warning',
  director: 'success',
}

type ActionTypes = 'delete' | 'send-sms' | 'add-student' | 'notes'


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

  // Hooks
  const { t } = useTranslation()
  const { updateTeacher } = useTeachers()
  const { query } = useRouter()
  const { user } = useContext(AuthContext)
  const { mergeStudentToGroup } = useGroups()

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
      const resp = await api.get('common/group/students/' + query.id)
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


  useEffect(() => {
    setData(userData)
  }, [userData])

  useEffect(() => {
    getStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    searchStudent()
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
                  /></Link>
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
                  user?.role !== 'teacher' ? (
                    <Box sx={{ display: 'flex', mb: 2.7 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Mentor:</Typography>
                      <Link href={user?.role !== 'teacher' ? `/mentors/view/security/?id=${data.teacher_data.id}` : '/lids'} style={{ textDecoration: 'none' }}>
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
              user?.role !== 'teacher' ? (
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="O'chirish" placement='top'>
                    <Button variant='outlined' color='error' onClick={() => handleEditClickOpen('delete')}>
                      <IconifyIcon icon='mdi-light:delete' />
                    </Button>
                  </Tooltip>
                  <Tooltip title="SMS yuborish" placement='top'>
                    <Button variant='outlined' color="warning" onClick={() => handleEditClickOpen('send-sms')}>
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
                  ['new', 'active', 'archive'].map(el => <div style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}><Status color={el == 'active' ? 'success' : el == 'new' ? 'warning' : 'error'} /> {el == 'active' ? 'aktiv' : el == 'new' ? 'sinov' : 'arxiv'}</div>)
                }
              </div>
              <UserViewStudentsList data={students} />
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
              <FormControl fullWidth>
                <TextField
                  error={error?.message}
                  rows={4}
                  multiline
                  label="SMS..."
                  name='message'
                  defaultValue={''}
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
      </Grid >
    )
  } else {
    return null
  }
}

export default UserViewLeft
