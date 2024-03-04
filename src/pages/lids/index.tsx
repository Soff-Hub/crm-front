// ** MUI Imports
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Form from 'src/@core/components/form'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import showResponseError from 'src/@core/utils/show-response-error'
import { AuthContext } from 'src/context/AuthContext'
import LidsKanban from 'src/views/apps/lids/LidsKanban'
import TeacherProfile from 'src/views/teacher-profile'

const Lids = () => {
  const { isMobile } = useResponsive()
  const [open, setOpen] = useState<'add-department' | null>(null)
  const [openItem, setOpenItem] = useState<any>(null)
  const [openLid, setOpenLid] = useState<any>(null)
  const [leadData, setLeadData] = useState<any>([])
  const [loading, seLoading] = useState<boolean>(false)
  const { user } = useContext(AuthContext)

  // const [createble, setCreatable] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const { t } = useTranslation()

  const handleClose = () => setOpen(null)


  const getLeads = async () => {
    const resp = await api.get('leads/department/list')
    if (resp?.data) {
      setLeadData(resp.data.results)
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

  // const createDepartmentStudent = async (values: any) => {
  //   seLoading(true)
  //   try {
  //     await api.post('leads/department/create/', values)
  //     seLoading(false)
  //     setOpenItem(null)
  //     getLeads()
  //   }
  //   catch (err: any) {
  //     seLoading(false)
  //     showResponseError(err.response.data, setError)
  //     console.log(err)
  //   }
  // }

  useEffect(() => {
    getLeads()
  }, [])

  return user?.role === 'teacher' ? <TeacherProfile /> : (
    <Box sx={{ maxWidth: '100%', overflowX: 'scroll' }}>
      <Box>
      </Box>
      <Box
        padding={'20px 0'}
        display={'flex'}
        gap={5}
        sx={{ minHeight: 600, alignItems: 'flex-start' }}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        {
          leadData.map((lead: any) => (
            <LidsKanban id={lead.id} setOpenLid={setOpenLid} setOpenItem={setOpenItem} key={lead.id} items={lead.children} title={lead.name} status='success' />
          ))
        }
        {!isMobile && <Button onClick={() => setOpen('add-department')} sx={{ minWidth: '300px' }} size='small' variant='contained' startIcon={<IconifyIcon icon={'material-symbols:add'} />}>Yaratish</Button>}
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

      <Dialog onClose={() => setOpenLid(null)} open={openLid !== null}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t("Yangi Lid")}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => setOpenLid(null)}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <Form setError={setError} onSubmit={createDepartmentItem} valueTypes='json' id='codasdsdassdijfo' sx={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>{t('Bo\'lim')}</InputLabel>
              <Select
                size='small'
                error={error.source?.error}
                label={t('Bo\'lim')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='source'
                defaultValue=''
                sx={{ mb: 1 }}
              >
                {
                  leadData.some((el: any) => el.id === openLid) ? leadData.find((el: any) => el.id === openLid).children.map((lead: any) => <MenuItem key={lead.id} value={Number(lead.id)}>{lead.name}</MenuItem>) : ''
                }
              </Select>
              <FormHelperText error={error.source?.error}>{error.source?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField fullWidth error={error.first_name?.error} size='small' label={t('first_name')} name='first_name' />
              <FormHelperText error={error.first_name?.error}>{error.first_name?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <TextField fullWidth size='small' label={t('phone')} name='phone' error={error.phone?.error} />
              <FormHelperText error={error.phone?.error}>{error.phone?.message}</FormHelperText>
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
