// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'


// ** Utils Import
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon';

import { FormHelperText, Tooltip } from '@mui/material';
import Form from 'src/@core/components/form';
import { addPeriodToThousands } from 'src/pages/settings/office/courses';
import UserViewStudentsList from './UserViewStudentsList';
import useStudent, { StudentTypes } from 'src/hooks/useStudents';
import { getInitials } from 'src/@core/utils/get-initials';
import useGroups from 'src/hooks/useGroups';
import LoadingButton from '@mui/lab/LoadingButton'
import useBranches from 'src/hooks/useBranch'
import showResponseError from 'src/@core/utils/show-response-error'
import usePayment from 'src/hooks/usePayment'
import api from 'src/@core/utils/api'
import useSMS from 'src/hooks/useSMS'
import { useRouter } from 'next/router'


type ModalTypes = 'group' | 'payment' | 'sms' | 'delete' | 'edit' | 'notes'


const UserViewLeft = ({ userData, rerender }: { userData: StudentTypes | null, rerender: any }) => {
  // ** States
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [data, setData] = useState<StudentTypes | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const [groupDate, setGroupDate] = useState<any>(null)


  // Hooks
  const { t } = useTranslation()
  const { mergeStudentToGroup, getGroupShort, groupShort } = useGroups()
  const { updateStudent, studentData } = useStudent()
  const { getBranches, branches } = useBranches()
  const { getPaymentMethod, paymentMethods, createPayment } = usePayment()
  const [sms, setSMS] = useState<any>("")
  const { smsTemps, getSMSTemps } = useSMS()
  const { query } = useRouter()

  // Handle Edit dialog
  const handleEditClickOpen = (value: ModalTypes) => {
    if (value === "group") {
      getBranches()
    }
    setOpenEdit(value)
  }

  const handleEditClose = () => {
    setError({})
    setOpenEdit(null)
  }

  const handleMergeToGroup = async (value: any) => {
    setLoading(true)
    const data = {
      ...value,
      student: userData?.id,
      group: [+value.group]
    }

    try {
      await mergeStudentToGroup(data)
      setLoading(false)
      setOpenEdit(null)

      return await rerender()
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  const handleAddNote = async (value: any) => {
    setLoading(true)
    try {
      await api.post('auth/student/description/', { user: userData?.id, ...value })
      setLoading(false)
      setOpenEdit(null)

      return await rerender()
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  const handleEditSubmit = async (value: any) => {
    setLoading(true)

    try {
      await updateStudent(userData?.id, value)
      setLoading(false)
      setOpenEdit(null)

      return await rerender()
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }

  const handleSendSms = async (value: any) => {
    setLoading(true)
    const data = {
      ...value,
      users: [userData?.id],
    }

    try {
      await api.post(`common/send-message-user/`, data)
      setLoading(false)
      setOpenEdit(null)

      return await rerender()
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  const handlePayment = async (value: any) => {
    setLoading(true)
    const data = {
      ...value,
      student: query?.student,
    }

    try {
      await createPayment(data)
      setLoading(false)
      setOpenEdit(null)

      return await rerender()
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }


  useEffect(() => {
    setData(userData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, studentData])



  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={'primary'}
                  sx={{ width: 70, height: 70, fontWeight: 600, mb: 1, fontSize: '2rem' }}
                >
                  {getInitials(data.first_name)}
                </CustomAvatar>
                <Box>
                  <Typography variant='h6'>{data.first_name}</Typography>
                  <Typography fontSize={12}>{`( ID:${data.id} )`}</Typography>
                </Box>
              </Box>
            </CardContent>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography fontSize={13} variant='body2'>Telefon raqami: </Typography>
                <Typography fontSize={13}>{data.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography fontSize={13} variant='body2'>O'quvchi balansi: </Typography>
                <Typography fontSize={13}>{addPeriodToThousands(+data.balance) + " so'm"}</Typography>
              </Box>
            </CardContent>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button size='small' variant='outlined' startIcon={<IconifyIcon icon={'icon-park-twotone:add-web'} />} onClick={() => handleEditClickOpen('group')}>Guruhga qo'shish</Button>
              <Button color='warning' size='small' startIcon={<IconifyIcon icon={'mdi:cash-plus'} />} variant='outlined' onClick={async () => (await getPaymentMethod(), handleEditClickOpen('payment'))}>To'lov</Button>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
              <Tooltip title="SMS yuborish" placement='bottom'>
                <Button size='small' color="warning" onClick={() => (getSMSTemps(), handleEditClickOpen('sms'))}>
                  <IconifyIcon icon='material-symbols-light:sms-outline' />
                </Button>
              </Tooltip>
              <Tooltip title="Tahrirlash" placement='bottom'>
                <Button size='small' color='success' onClick={() => handleEditClickOpen('edit')}>
                  <IconifyIcon icon='iconamoon:edit-thin' />
                </Button>
              </Tooltip>
              <Tooltip title="O'chirish" placement='bottom'>
                <Button size='small' color='error' onClick={() => handleEditClickOpen('delete')}>
                  <IconifyIcon icon='mdi-light:delete' />
                </Button>
              </Tooltip>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          {userData && userData?.comments?.length > 0 ? (
            <Card>
              <CardContent>
                <UserViewStudentsList setOpenEdit={setOpenEdit} comment={userData?.comments[0]} />
              </CardContent>
            </Card>
          ) : ''
          }

        </Grid>

        {/*   Merge to Group Modal  */}
        <Dialog
          open={openEdit === "group"}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Guruhga biriktirish
          </DialogTitle>
          <DialogContent>
            <Form reqiuredFields={['group']} setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleMergeToGroup} id='edit-efwemployee-gr'>
              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>{t('Filialni tanlang')}</InputLabel>
                <Select
                  size='small'
                  label={t('Filialni tanlang')}
                  sx={{ marginBottom: 3 }}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  onChange={(e: any) => getGroupShort(e.target.value)}
                >
                  {
                    branches.map(branch => <MenuItem key={branch.id} value={branch.id}>{`${branch.name}`}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.branch?.error}>{error.branch?.message}</FormHelperText>
              </FormControl>

              {groupShort && <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>{t('Guruhni tanlang')}</InputLabel>
                <Select
                  size='small'
                  label={t('Guruhni tanlang')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  onChange={(e: any) => setGroupDate(e.target.value)}
                  name='group'
                  sx={{ marginBottom: '10px' }}
                >
                  {
                    groupShort.map(branch => <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.branch?.error}>{error.branch?.message}</FormHelperText>
              </FormControl>}

              {groupDate && <FormControl sx={{ width: '100%' }}>
                {/* <InputLabel htmlFor='qwqwq' size='small'>{t('Qo\'shilish sanasi')}</InputLabel> */}
                <TextField
                  type="date" size='small' label={t('Qo\'shilish sanasi')} name='start_date'
                  // min={groupShort?.find(el => el.id === groupDate)?.start_date || ''} 
                  style={{ background: 'transparent', width: '100%' }} />
                <FormHelperText sx={{ marginBottom: '10px' }} error={error.start_date?.error}>{error.start_date?.message}</FormHelperText>
              </FormControl>}


              {groupShort && <FormControl fullWidth>
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

        {/*   Payment  */}
        <Dialog
          open={openEdit === "payment"}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            To'lov qilish
          </DialogTitle>
          <DialogContent>
            <Form setError={setError} valueTypes='json' sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={handlePayment} id='edifsdt-employee-pay'>
              <FormControl fullWidth error={error.payment_type?.error}>
                <InputLabel size='small' id='user-view-language-label'>{t("To'lov usulini tanlang")}</InputLabel>
                <Select
                  size='small'
                  label={t("To'lov usulini tanlang")}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='payment_type'
                >
                  {
                    paymentMethods.map((branch: any) => <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.payment_type?.error}>{error.payment_type?.message}</FormHelperText>
              </FormControl>

              <FormControl fullWidth error={error.group?.error}>
                <InputLabel size='small' id='user-view-language-label'>{t("Qaysi guruh uchun?")}</InputLabel>
                <Select
                  size='small'
                  label={t("Qaysi guruh uchun?")}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='group'
                >
                  {
                    userData?.groups.map((branch: any) => <MenuItem key={branch.id} value={branch.group_data.id}>{branch.group_data.name}</MenuItem>)
                  }
                </Select>
                <FormHelperText error={error.group?.error}>{error.group?.message}</FormHelperText>
              </FormControl>


              <FormControl fullWidth>
                <TextField
                  error={error?.amount}
                  rows={4}
                  label="Miqdori (so'm)"
                  size='small'
                  name='amount'
                  defaultValue={''}
                  type='number'
                />
                <FormHelperText error={error.amount}>{error.amount?.message}</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  error={error?.description}
                  rows={4}
                  multiline
                  label="Izoh"
                  name='description'
                  defaultValue={''}
                />
                <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <input type="date" style={{ borderRadius: '8px', padding: '10px', outline: 'none', border: '1px solid gray', marginTop: '10px' }} name='payment_date' />
                <FormHelperText error={error.start_date?.error}>{error.start_date?.message}</FormHelperText>
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

        {/*   Edit Student  */}
        <Dialog
          open={openEdit === "edit"}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [2, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.3rem !important' }}>
            O'quvchi ma'lumotlarini tahrirlash
          </DialogTitle>
          <DialogContent>
            {data &&
              <Form
                reqiuredFields={['group']}
                setError={setError}
                valueTypes='json'
                sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '15px' }}
                onSubmit={handleEditSubmit}
                id='edit-fwe-fwefwfweepay'
              >

                <FormControl sx={{ width: '100%' }}>
                  <TextField size='small' label={t("first_name")} name='first_name' error={error.first_name?.error} defaultValue={data.first_name} />
                  <FormHelperText error={error.first_name}>{error.first_name?.message}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                  <TextField size='small' label={t("phone")} name='phone' error={error.phone?.error} defaultValue={data.phone} />
                  <FormHelperText error={error.phone}>{error.phone?.message}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                  <TextField size='small' label={t("Balansi")} name='balance' error={error.balance?.error} defaultValue={data.balance} />
                  <FormHelperText error={error.balance}>{error.balance?.message}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                  <TextField type='date' size='small' label={t("Tg'ilgan sana")} name='birth_date' error={error.birth_date?.error} defaultValue={data.birth_date} />
                  <FormHelperText error={error.birth_date}>{error.birth_date?.message}</FormHelperText>
                </FormControl>

                <DialogActions sx={{ justifyContent: 'center' }}>
                  <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                    {t("Saqlash")}
                  </LoadingButton>
                  <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                    {t("Bekor Qilish")}
                  </Button>
                </DialogActions>
              </Form>}
          </DialogContent>
        </Dialog>

        {/*   Delete  */}
        <Dialog
          open={openEdit === "delete"}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Eslatma qo'shish
          </DialogTitle>
          <DialogContent>
            Delete
          </DialogContent>
        </Dialog>

        {/*   New Note  */}
        <Dialog
          open={openEdit === "notes"}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Yangi eslatma qo'shish
          </DialogTitle>
          <DialogContent>
            <Form setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleAddNote} id='edit-employee-pay'>
              <FormControl fullWidth>
                <TextField
                  error={error?.description}
                  rows={4}
                  multiline
                  label="Izoh"
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

        {/*   SMS  */}
        <Dialog
          open={openEdit === "sms"}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Xabar yuborish (sms)
          </DialogTitle>
          <DialogContent>
            <Form setError={setError} valueTypes='json' sx={{ marginTop: 10 }} onSubmit={handleSendSms} id='dsdsdsds'>
              <FormControl sx={{ maxWidth: '100%', mb: 3 }} fullWidth>
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
                  label="Xabar"
                  name='message'
                  defaultValue={''}
                  value={sms}
                  onChange={(e) => setSMS(e.target.value)}
                />
                <FormHelperText error={error.message}>{error.message?.message}</FormHelperText>
              </FormControl>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                  {t("Bekor Qilish")}
                </Button>
                <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                  {t("Yuborish")}
                </LoadingButton>
              </DialogActions>
            </Form>
          </DialogContent>
        </Dialog>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft
