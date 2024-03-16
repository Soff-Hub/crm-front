// ** MUI Imports
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Form from 'src/@core/components/form'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import showResponseError from 'src/@core/utils/show-response-error'
import { AuthContext } from 'src/context/AuthContext'
import { addUserData } from 'src/store/apps/user'
import LidsKanban from 'src/views/apps/lids/LidsKanban'
import TeacherProfile from 'src/views/teacher-profile'

const Lids = () => {
  const { isMobile } = useResponsive()
  const [open, setOpen] = useState<'add-department' | null>(null)
  const [openItem, setOpenItem] = useState<any>(null)
  const [openLid, setOpenLid] = useState<any>(null)
  const [leadData, setLeadData] = useState<any>([])
  const [sourceData, setSourceData] = useState<any>([])
  const [addSource, setAddSource] = useState<boolean>(false)
  const [loading, seLoading] = useState<boolean>(false)
  const { user } = useContext(AuthContext)

  // const [createble, setCreatable] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleClose = () => setOpen(null)


  const getLeads = async () => {
    try {
      const resp = await api.get('leads/department/list')
      setLeadData(resp.data.results)
      dispatch(addUserData(resp.data.results))
    } catch {
      toast.error("Network Error", { position: 'bottom-center' })
    }
  }


  const getSources = async () => {
    const resp = await api.get('leads/source')
    if (resp?.data) {
      setSourceData(resp.data.results);
    }
  }

  const createDepartment = async (values: any) => {
    seLoading(true)
    const newValues = { ...values, parent: null }
    try {
      await api.post('leads/department/create/', newValues)
      seLoading(false)
      handleClose()
      getLeads()
    }
    catch (err) {
      seLoading(false)
      console.log(err)
    }
  }

  const createDepartmentItem = async (values: any) => {
    seLoading(true)
    const newValues = { ...values, parent: openItem }
    try {
      await api.post('leads/department/create/', newValues)
      seLoading(false)
      setOpenItem(null)
      getLeads()
    }
    catch (err: any) {
      seLoading(false)
      showResponseError(err.response.data, setError)
      console.log(err)
    }
  }

  const createDepartmentStudent = async (values: any) => {
    seLoading(true)
    const newValues = { ...values }
    if (values.phone) {
      const newPhone: string = values.phone.split(' ').join('')
      if (newPhone.length === 9) {
        Object.assign(newValues, { phone: `+998${newPhone}` })
      } else {
        Object.assign(newValues, { phone: `${newPhone}` })
      }
    }
    try {
      await api.post('leads/department-user-create/', newValues)
      setOpenLid(null)
      seLoading(false)
      setAddSource(false)
      return await getLeads()
    }
    catch (err: any) {
      if (err?.response) {
        showResponseError(err.response.data, setError)
        seLoading(false)
        console.log(err)
      }
      seLoading(false)
      console.log(err)
    }
  }

  const closeCreateLid = () => {
    setOpenLid(null)
    setAddSource(false)
  }

  useEffect(() => {
    getLeads()
    getSources()
  }, [])

  return user?.role === 'teacher' ? <TeacherProfile /> : (
    <Box sx={{ maxWidth: '100%', overflowX: 'scroll' }}>
      <Box
        padding={'20px 0'}
        display={'flex'}
        gap={5}
        sx={{ minHeight: 600, alignItems: 'flex-start' }}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        {
          leadData.length > 0 ? (
            <>
              {
                leadData.map((lead: any) => (
                  <LidsKanban id={lead.id} setOpenLid={setOpenLid} reRender={getLeads} setOpenItem={setOpenItem} key={lead.id} items={lead.children} title={lead.name} status='success' />
                ))
              }
              {!isMobile && <Button onClick={() => setOpen('add-department')} sx={{ minWidth: '300px' }} size='small' variant='contained' startIcon={<IconifyIcon icon={'material-symbols:add'} />}>Bo'lim yaratish</Button>}
            </>
          ) : (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          )
        }

      </Box>

      <Dialog onClose={handleClose} open={open === "add-department"}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t("Yangi bo'lim qo'shish")}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={handleClose}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <Form onSubmit={createDepartment} valueTypes='json' id='ddassdscd' sx={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <TextField fullWidth size='small' label="Bo'lim nomi" name='name' />
            <TextField fullWidth size='small' label="Bo'lim tartibi" type='number' name='order' />
            <Button type='submit' variant='outlined'>{t("Yaratish")}</Button>
          </Form>
        </DialogContent>
      </Dialog >

      <Dialog onClose={() => setOpenItem(null)} open={openItem !== null}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t("Yangi Item biriktirish")}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => setOpenItem(null)}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <Form setError={setError} onSubmit={createDepartmentItem} valueTypes='json' id='cosczdasfwdijfo' sx={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FormControl fullWidth>
              <TextField fullWidth error={error.name?.error} size='small' label="Item nomi" name='name' />
              <FormHelperText error={error.name?.error}>{error.name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField fullWidth size='small' label="Item tartibi" type='number' name='order' />
              <FormHelperText error={error.order?.error}>{error.order?.message}</FormHelperText>
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yaratish")}</LoadingButton>
          </Form>
        </DialogContent>
      </Dialog >

      <Dialog onClose={closeCreateLid} open={openLid !== null}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t("Yangi Lid")}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => (setAddSource(false), setOpenLid(null))}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <Form setError={setError} reqiuredFields={['department', 'source_name', 'phone', 'first_name']} onSubmit={createDepartmentStudent} valueTypes='json' id='dqdwgsfdgdfa' sx={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t('Bo\'lim')}</InputLabel>
              <Select
                size='small'
                error={error.department?.error}
                label={t('Bo\'lim')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='department'
                sx={{ mb: 1 }}
              >
                {
                  leadData.some((el: any) => el.id === openLid) ? leadData.find((el: any) => el.id === openLid).children.map((lead: any) => <MenuItem key={lead.id} value={Number(lead.id)}>{lead.name}</MenuItem>) : <></>
                }
              </Select>
              <FormHelperText error={error.department?.error}>{error.department?.message}</FormHelperText>
            </FormControl>

            {!addSource ? (
              <FormControl fullWidth>
                <InputLabel size='small' id='fsdgsdgsgsdfsd-label'>{t('Manba')}</InputLabel>
                <Select
                  size='small'
                  error={error.source_name?.error}
                  label={t('Manba')}
                  id='fsdgsdgsgsdfsd'
                  labelId='fsdgsdgsgsdfsd-label'
                  name='source_name'
                  onChange={(e: any) => setAddSource(e?.target?.value === 0)}
                  sx={{ mb: 1 }}
                >
                  {
                    sourceData.map((lead: any) => <MenuItem key={lead.id} value={lead.name}>{lead.name}</MenuItem>)
                  }
                  <MenuItem value={0} sx={{ fontWeight: '600' }}><IconifyIcon icon={'ic:baseline-add'} /> Yangi qo'shish</MenuItem>
                </Select>
                <FormHelperText error={error.source_name?.error}>{error.source_name?.message}</FormHelperText>
              </FormControl>
            ) : ''}

            {addSource ? (
              <FormControl fullWidth>
                <TextField fullWidth error={error.source_name?.error} size='small' label={t('Manba')} name='source_name' />
                <FormHelperText error={error.source_name?.error}>{error.source?.message}</FormHelperText>
              </FormControl>
            ) : ''}


            <FormControl fullWidth>
              <TextField fullWidth error={error.first_name?.error} size='small' label={t('first_name')} name='first_name' />
              <FormHelperText error={error.first_name?.error}>{error.first_name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField autoComplete='off' fullWidth size='small' label={t('phone')} name='phone' defaultValue={"+998"} error={error.phone?.error} />
              <FormHelperText error={error.phone?.error}>{error.phone?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField fullWidth multiline rows={4} size='small' label={t('Izoh')} name='body' error={error.body?.error} />
              <FormHelperText error={error.body?.error}>{error.body?.message}</FormHelperText>
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yaratish")}</LoadingButton>
          </Form>
        </DialogContent>
      </Dialog >
    </Box >
  )
}

Lids.acl = {
  action: 'manage',
  subject: 'lids'
}

export default Lids
