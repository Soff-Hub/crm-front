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
import IconifyIcon from 'src/@core/components/icon'

import { ButtonGroup, Checkbox, FormHelperText, Radio, RadioGroup, Tooltip } from '@mui/material'
import Form from 'src/@core/components/form'
import { addPeriodToThousands } from 'src/pages/settings/office/courses'
import UserViewStudentsList from './UserViewStudentsList'
import useStudent, { StudentTypes } from 'src/hooks/useStudents'
import { getInitials } from 'src/@core/utils/get-initials'
import useGroups from 'src/hooks/useGroups'
import LoadingButton from '@mui/lab/LoadingButton'
import useBranches from 'src/hooks/useBranch'
import showResponseError from 'src/@core/utils/show-response-error'
import usePayment from 'src/hooks/usePayment'
import api from 'src/@core/utils/api'
import useSMS from 'src/hooks/useSMS'
import { today } from 'src/@core/components/card-statistics/kanban-item'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail, fetchStudentPayment } from 'src/store/apps/students'
import StudentPaymentForm from './StudentPaymentForm'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import StudentParentList from './StudentParentList'
import StudentWithDrawForm from './StudentWithdrawForm'
import toast from 'react-hot-toast'
import { fetchSmsList, fetchSmsListQuery } from 'src/store/apps/settings'

export type ModalTypes = 'group' | 'withdraw' | 'payment' | 'sms' | 'delete' | 'edit' | 'notes' | 'parent'

const UserViewLeft = ({ userData }: { userData: any }) => {
  
  // ** States
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [data, setData] = useState<StudentTypes | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const [groupDate, setGroupDate] = useState<any>(null)
  const [isDiscount, setIsDiscount] = useState<boolean>(false)

  // Hooks
  const { t } = useTranslation()
  const { mergeStudentToGroup, getGroupShort, groupShort } = useGroups()
  const { updateStudent, studentData } = useStudent()
  const { getBranches, branches } = useBranches()
  const {} = usePayment()
  const { smsTemps, getSMSTemps } = useSMS()
  const dispatch = useAppDispatch()
  const router = useRouter()

  // Handle Edit dialog
  const handleEditClickOpen = (value: ModalTypes) => {
    if (value === 'group') {
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

      console.log({ ...data, ...discountConfig })

      await mergeStudentToGroup({ ...data, ...discountConfig })
      setLoading(false)
      setOpenEdit(null)

      await dispatch(fetchStudentDetail(userData.id))
      await dispatch(fetchStudentPayment(userData.id))
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  const handleAddNote = async (value: any) => {
    setLoading(true)
    try {
      await api.post('student/description/', { user: userData?.id, ...value })
      setLoading(false)
      setOpenEdit(null)
      await dispatch(fetchStudentDetail(userData.id))
    } catch (err: any) {
      showResponseError(err?.response?.data, setError)
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
                <Typography fontSize={13} variant='body2'>
                  {t('phone')}:{' '}
                </Typography>
                <Typography fontSize={13}>{data.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography fontSize={13} variant='body2'>
                  {t('Balans')}:{' '}
                </Typography>
                <Typography fontSize={13}>{addPeriodToThousands(+data.balance) + " so'm"}</Typography>
              </Box>
            </CardContent>
            <CardContent sx={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
              <Button
                size='small'
                variant='outlined'
                startIcon={<IconifyIcon icon={'mdi:table-add'} />}
                onClick={() => handleEditClickOpen('group')}
              >
                {t("Guruhga qo'shish")}
              </Button>
              <Button
                color='error'
                size='small'
                startIcon={<IconifyIcon icon={'mdi:cash-minus'} />}
                variant='outlined'
                onClick={async () => handleEditClickOpen('withdraw')}
              >
                {t('Pul qaytarish')}
              </Button>
            </CardContent>
            <CardContent sx={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <Button
                color='warning'
                size='small'
                startIcon={<IconifyIcon icon={'mdi:cash-plus'} />}
                variant='outlined'
                onClick={async () => handleEditClickOpen('payment')}
              >
                {t("To'lov")}
              </Button>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
              {/* <Tooltip title={t("Ota-ona ma'lumotini kiritish")} placement='bottom'>
                <Button size='small' color="secondary" onClick={() => (handleEditClickOpen('parent'))}>
                  <IconifyIcon icon='ri:parent-line' />
                </Button>
              </Tooltip> */}
              <Tooltip title={t('Xabar (sms)')} placement='bottom'>
                <Button size='small' color='warning' onClick={() => (getSMSTemps(), handleEditClickOpen('sms'))}>
                  <IconifyIcon icon='material-symbols-light:sms-outline' />
                </Button>
              </Tooltip>
              <Tooltip title={t('Tahrirlash')} placement='bottom'>
                <Button size='small' onClick={() => handleEditClickOpen('edit')}>
                  <IconifyIcon icon='iconamoon:edit-thin' />
                </Button>
              </Tooltip>
            </Box>
          </Card>
        </Grid>
        <Grid item gap={2} xs={12}>
          {userData && userData?.comments?.length > 0 ? (
            <Card>
              <CardContent>
                <UserViewStudentsList setOpenEdit={setOpenEdit} comment={userData?.comments[0]} />
              </CardContent>
            </Card>
          ) : (
            ''
          )}
          <StudentParentList />
        </Grid>
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
        {/*   Payment  */}
        <StudentPaymentForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
        <StudentWithDrawForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
        {/*   Edit Student  */}
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
            {data && (
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
                    defaultValue={data.first_name}
                  />
                  <FormHelperText error={error.first_name}>{error.first_name}</FormHelperText>
                </FormControl>

                <FormControl sx={{ width: '100%' }}>
                  <TextField
                    size='small'
                    label={t('phone')}
                    name='phone'
                    error={error.phone}
                    defaultValue={data.phone}
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
                    defaultValue={data.birth_date}
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
        {/*   Delete  */}
        <Dialog
          open={openEdit === 'delete'}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            Eslatma qo'shish
          </DialogTitle>
          <DialogContent>Delete</DialogContent>
        </Dialog>
        {/*   New Note  */}
        <Dialog
          open={openEdit === 'notes'}
          onClose={handleEditClose}
          aria-labelledby='user-view-edit'
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
          aria-describedby='user-view-edit-description'
        >
          <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
            {t("Yangi eslatma qo'shish")}
          </DialogTitle>
          <DialogContent>
            <Form
              setError={setError}
              valueTypes='json'
              sx={{ marginTop: 10 }}
              onSubmit={handleAddNote}
              id='edit-employee-pay'
            >
              <FormControl fullWidth>
                <TextField
                  error={error?.description}
                  rows={4}
                  multiline
                  label={t('Izoh')}
                  name='description'
                  defaultValue={''}
                />
                <FormHelperText error={error.description}>{error.description?.message}</FormHelperText>
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
          </DialogContent>
        </Dialog>
        {/*   SMS  */}
        <SendSMSModal
          handleEditClose={handleEditClose}
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          userData={userData}
        />
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft

export const SendSMSModal = ({ handleEditClose, openEdit, setOpenEdit, userData, usersData }: any) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [isErrorText, setIsErrorText] = useState<null | string>(null)
  const [isActive, setIsActive] = useState(false)
  const {sms_list ,smschild_list} = useAppSelector(state => state.settings)
  const [parent_id,setParentId] = useState<number|null>(null)
  const formik: any = useFormik({
    initialValues: {
      message: ''
    },
    validationSchema: Yup.object({
      message: Yup.string().required(t('Xabar matnini kiriting') as string)
    }),
    onSubmit: async values => {
      await handleSendSms(values)
    }
  })

  const handleChangeActive = () => {
    setIsActive(!isActive)
  }

  const handleSendSms = async (value: any) => {
    setLoading(true)
    const data = {
      ...value,
      users: userData ? [userData.id] : usersData,
      is_partly: isActive
    }

    try {
      await api.post(`common/send-message-user/`, data)
      toast.success('Sms yuborildi')
      setParentId(null)
      setLoading(false)
      dispatch(setOpenEdit(null))
      formik.resetForm()
      setIsErrorText(null)
      setIsActive(false)
      await dispatch(userData?.id)
    } catch (err: any) {
      console.log(err)

      if (err.response.status) {
        setIsErrorText(err.response.data.message)
        setLoading(false)
      } else {
        console.log(err)
        setLoading(false)
      }
    }
  }
  useEffect(() => {
    dispatch(fetchSmsList())
  }, [])
  useEffect(() => {
    if (parent_id) {
      dispatch(fetchSmsListQuery(parent_id))
    }
  },[parent_id])

  return (
    <Dialog
      open={openEdit === 'sms'}
      onClose={() => (handleEditClose(), formik.resetForm(), setIsErrorText(null), setIsActive(false))}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t('Xabar (sms)')}
      </DialogTitle>
      <DialogContent>
        <form style={{ marginTop: 10 }} onSubmit={formik.handleSubmit}>
        <FormControl sx={{ width: '100%' ,marginBottom:5}}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Kategoriya')}
          </InputLabel>
          <Select
            size='small'
            label={t('Kategoriya')}
            name='parent'
            onChange={(e:any)=>setParentId(e.target.value)}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
          >
            {sms_list.map(item => (
              <MenuItem value={item.id}>{item.description}</MenuItem>
            ))}
          </Select>

        </FormControl>
           {parent_id && <FormControl sx={{ maxWidth: '100%' }} fullWidth>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Shablonlar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Shablonlar')}
              value={formik.values.message}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              onChange={e => formik?.setFieldValue('message', e.target.value)}
            >
              {smschild_list.map((el: any) => (
                <MenuItem value={el.description} sx={{ wordBreak: 'break-word' }}>
                  <span style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '10px' }}>{el.description}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>}
          <p style={{ fontSize: 12 }} className='mb-3 mt-2'>
            {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring"}
          </p>
          <FormControl fullWidth>
            <TextField
              size='small'
              name='message'
              multiline
              rows={4}
              label={t('SMS matni ')}
              onBlur={formik.handleBlur}
              value={formik.values.message}
              onChange={formik.handleChange}
              error={!!formik.errors?.message && formik.touched.message}
            />
            <FormHelperText error={!!formik.errors.message && formik.touched.message}>
              {formik.errors.message}
            </FormHelperText>
          </FormControl>
          <p style={{ color: 'red', padding: 3 }}>{isErrorText}</p>
          {isErrorText && (
            <div className='d-flex align-items-start'>
              <Checkbox checked={isActive} onChange={handleChangeActive} inputProps={{ 'aria-label': 'controlled' }} />
              <p>Sms limit yetganicha habar yuborilsin (10) ta</p>
            </div>
          )}
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              variant='outlined'
              type='button'
              color='secondary'
              onClick={() => (
                handleEditClose(), formik.resetForm(), setLoading(false), setIsErrorText(null),setParentId(null), setIsActive(false)
              )}
            >
              {t('Bekor qilish')}
            </Button>
            <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
              {t('Yuborish')}
            </LoadingButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
