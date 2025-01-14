import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  Chip,
  Grid,
  Box,
  styled,
  colors,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  TextField,
  DialogActions
} from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { Edit, MessageSquare, Plus, RefreshCw, Wallet } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { getInitials } from 'src/@core/utils/get-initials'
import useBranches from 'src/hooks/useBranch'
import Form from 'src/@core/components/form'
import useGroups from 'src/hooks/useGroups'
import { useAppDispatch } from 'src/store'
import { fetchStudentDetail, fetchStudentGroups, fetchStudentPayment } from 'src/store/apps/students'
import showResponseError from 'src/@core/utils/show-response-error'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { today } from 'src/@core/components/card-statistics/kanban-item'
import { LoadingButton } from '@mui/lab'
import StudentPaymentForm from './StudentPaymentForm'
import StudentWithDrawForm from './StudentWithdrawForm'
import useSMS from 'src/hooks/useSMS'
import { SendSMSModal } from './UserViewLeft'
import { fetchSmsList } from 'src/store/apps/settings'
import useStudent from 'src/hooks/useStudents'

interface StudentCardProps {
  photo?: string
  name?: string
  id?: string | number
  userData?: any
  gpa?: number
  phone?: string
  balance?: string
  school?: string
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden'
}))

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(3)
}))

export type ModalTypes = 'group' | 'withdraw' | 'payment' | 'sms' | 'delete' | 'edit' | 'notes' | 'parent'

export default function StudentCard({
  userData,
  name,
  id,
  gpa,
  phone,
  balance,
  school
}: StudentCardProps): ReactElement {
  const { getBranches, branches } = useBranches()
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const { mergeStudentToGroup, getGroupShort, groupShort } = useGroups()
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const router = useRouter()
  const { updateStudent, studentData } = useStudent()

  const [groupDate, setGroupDate] = useState<any>(null)
  const { smsTemps, getSMSTemps } = useSMS()

  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  const handleMergeToGroup = async (value: any) => {
    setLoading(true)
    const data = {
      ...value,
      student: userData.id,
      groups: [+value.group]
    }

    // const discountConfig = {
    //   amount: value?.fixed_price,
    //   discount_count: 100,
    //   description: 'kurs oxirigacha',
    //   group: value?.group,
    //   student: userData?.id
    // }

    try {
      const discountConfig = {
        discount_amount: value.fixed_price,
        discount_count: 100,
        discount_description: 'kurs oxirigacha',
        groups: [value?.group],
        student: userData?.id,
        is_discount: isDiscount
      }

      await mergeStudentToGroup({ ...data, ...discountConfig })
      setLoading(false)
      setOpenEdit(null)
      await dispatch(fetchStudentGroups(userData.id))
      await dispatch(fetchStudentDetail(userData.id))
      await dispatch(fetchStudentPayment(userData.id))
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
      await dispatch(fetchStudentDetail(userData.id))
    } catch (err: any) {
      setLoading(false)
      setError(err?.response?.data)
    }
  }

  const handleEditClose = () => {
    setError({})
    setOpenEdit(null)
  }

  const handleEditClickOpen = (value: ModalTypes) => {
    if (value === 'group') {
      getBranches()
    }
    setOpenEdit(value)
  }

  return (
    <StyledCard>
      <CardHeaderStyled
        sx={{ marginBottom: 5 }}
        action={
          <Chip sx={{ backgroundColor: 'white', padding: 2 }} icon={<Wallet size={16} />} label={balance + " so'm"} />
        }
      />
      <CardContent>
        <Box display='flex' gap={2} mb={3}>
          {name && (
            <CustomAvatar
              skin='light'
              variant='rounded'
              color={'primary'}
              sx={{ width: 70, height: 70, fontWeight: 600, mb: 1, fontSize: '2rem' }}
            >
              {getInitials(name)}
            </CustomAvatar>
          )}
          <Box>
            <Typography variant='h6' component='h3' gutterBottom>
              {name}
            </Typography>
            {gpa && (
              <Chip
                color='error'
                label={`Baho: ${gpa?.toFixed(2)}`}
                variant='outlined'
                size='small'
                sx={{
                  color: gpa >= 4 ? 'green' : gpa >= 3 ? 'orange' : 'red',
                  borderColor: gpa >= 4 ? 'green' : gpa >= 3 ? 'orange' : 'red'
                }}
              />
            )}
            <Typography variant='body2' color='text.secondary' mt={1}>
              ID: {id}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant='body2' color='text.secondary'>
              Telefon raqam :
            </Typography>
            <Typography variant='body1'>{phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body2' color='text.secondary'>
              Maktab :
            </Typography>
            <Typography variant='body1'>{school}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          bgcolor: 'grey.50',
          borderColor: 'divider',
          padding: '10px'
        }}
      >
        <Box width='100%' gap={1}>
          <Box display='flex' width='100%' marginBottom={2} gap={2}>
            <Button
              variant='contained'
              onClick={() => handleEditClickOpen('group')}
              startIcon={<Plus size={12} />}
              fullWidth
            >
              Guruhga qo'shish
            </Button>
            <Button
              variant='outlined'
              onClick={async () => handleEditClickOpen('payment')}
              startIcon={<Wallet size={12} />}
              fullWidth
            >
              To'lov qilish
            </Button>
          </Box>
          <Button
            variant='outlined'
            onClick={async () => handleEditClickOpen('withdraw')}
            color='error'
            startIcon={<Wallet size={16} />}
            fullWidth
          >
            Pul qaytarish
          </Button>
        </Box>
        <Box display='flex' gap={2} justifyContent='center' width='100%'>
          <Button onClick={() => (dispatch(fetchSmsList()), handleEditClickOpen('sms'))} variant='outlined' fullWidth>
            <MessageSquare size={15} />
          </Button>
          <Button variant='outlined' onClick={() => handleEditClickOpen('edit')} fullWidth>
            <Edit size={15} />
          </Button>
        </Box>
      </Box>
      <Dialog
        open={openEdit === 'group'}
        onClose={handleEditClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
        BackdropProps={{
          onClick: e => e.stopPropagation()
        }}
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t('Guruhga biriktirish')}
        </DialogTitle>
        <DialogContent>
          <Form
            reqiuredFields={['group']}
            setError={setError}
            valueTypes='json'
            sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}
            onSubmit={handleMergeToGroup}
            id='edit-efwemployee-gr'
          >
            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t('branch')}
              </InputLabel>
              <Select
                size='small'
                label={t('branch')}
                sx={{ marginBottom: 0 }}
                id='user-view-language'
                labelId='user-view-language-label'
                onChange={(e: any) => getGroupShort(e.target.value)}
              >
                {branches.map(branch => (
                  <MenuItem key={branch.id} value={branch.id}>{`${branch.name}`}</MenuItem>
                ))}
              </Select>
              <FormHelperText error={error.branch?.error}>{error.branch?.message}</FormHelperText>
            </FormControl>

            {groupShort && (
              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t('Guruhni tanlang')}
                </InputLabel>
                <Select
                  size='small'
                  label={t('Guruhni tanlang')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  error={error.group?.error}
                  onChange={(e: any) => setGroupDate(e.target.value)}
                  name='group'
                  sx={{ marginBottom: '0px' }}
                >
                  {groupShort.map(branch => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                  <MenuItem sx={{ fontWeight: 600 }} onClick={() => router.push('/groups')}>
                    {t('Yangi yaratish')}
                    <IconifyIcon icon={'ion:add-sharp'} />
                  </MenuItem>
                </Select>
                <FormHelperText error={error.group}>{error.group?.message}</FormHelperText>
              </FormControl>
            )}

            {groupDate && (
              <FormControl sx={{ width: '100%' }}>
                {/* <InputLabel htmlFor='qwqwq' size='small'>{t('Qo\'shilish sanasi')}</InputLabel> */}
                <TextField
                  type='date'
                  size='small'
                  label={t("Qo'shilish sanasi")}
                  name='start_date'
                  // min={groupShort?.find(el => el.id === groupDate)?.start_date || ''}
                  defaultValue={today}
                  style={{ background: 'transparent', width: '100%' }}
                />
                <FormHelperText sx={{ marginBottom: '0px' }} error={error.start_date?.error}>
                  {error.start_date?.message}
                </FormHelperText>
              </FormControl>
            )}

            {isDiscount && (
              <div>
                <TextField
                  size='small'
                  label={t('Alohida narx')}
                  name='fixed_price'
                  type='number'
                  error={!!error.fixed_price}
                  // onChange={(e: any) => setDiscount(e.target.value)}
                  fullWidth
                />
                <FormHelperText className='mb-2' error={true}>
                  {error.fixed_price}
                </FormHelperText>
              </div>
            )}

            {groupDate && (
              <Button
                onClick={() => setIsDiscount(!isDiscount)}
                type='button'
                variant='outlined'
                size='small'
                color='warning'
              >
                {isDiscount ? "Alohida narxni o'chirish" : 'Alohida narx kiritish'}
              </Button>
            )}

            {groupShort && (
              <FormControl fullWidth>
                <TextField error={error?.body} rows={4} multiline label='Izoh' name='body' defaultValue={''} />
                <FormHelperText error={error.body}>{error.body?.message}</FormHelperText>
              </FormControl>
            )}

            <DialogActions sx={{ justifyContent: 'center' }}>
              <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                {t('Saqlash')}
              </LoadingButton>
              <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                {t('Bekor Qilish')}
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openEdit === 'edit'}
        onClose={handleEditClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [2, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.3rem !important' }}>
          {t("O'quvchi ma'lumotlarini tahrirlash")}
        </DialogTitle>
        <DialogContent>
          {userData && (
            <Form
              reqiuredFields={['group']}
              setError={() => undefined}
              valueTypes='json'
              sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '15px' }}
              onSubmit={handleEditSubmit}
              id='edit-fwe-fwefwfweepay'
            >
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  size='small'
                  label={t('first_name')}
                  name='first_name'
                  error={error.first_name}
                  defaultValue={userData?.first_name}
                />
                <FormHelperText error={error.first_name}>{error.first_name}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField
                  size='small'
                  label={t('phone')}
                  name='phone'
                  error={error.phone}
                  defaultValue={userData?.phone}
                />
                <FormHelperText error={error.phone}>{error.phone}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField
                  type='date'
                  size='small'
                  label={t('birth_date')}
                  name='birth_date'
                  error={error.birth_date}
                  defaultValue={userData?.birth_date}
                />
                <FormHelperText error={error.birth_date}>{error.birth_date}</FormHelperText>
              </FormControl>

              <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                  {t('Saqlash')}
                </LoadingButton>
                <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                  {t('Bekor qilish')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      <StudentPaymentForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <StudentWithDrawForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <SendSMSModal
        handleEditClose={handleEditClose}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        userData={userData}
      />
    </StyledCard>
  )
}
