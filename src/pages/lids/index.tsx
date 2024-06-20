// ** MUI Imports
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Form from 'src/@core/components/form'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { createDepartment, createDepartmentItem, createDepartmentStudent, fetchDepartmentList, fetchSources, setAddSource, setLoading, setOpen, setOpenItem, setOpenLid, updateLeadParams } from 'src/store/apps/leads'
import { CreatesDepartmentState } from 'src/types/apps/leadsTypes'
import LidsKanban from 'src/views/apps/lids/LidsKanban'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import TeacherProfile from 'src/views/teacher-profile'

const Lids = () => {

  // ** Hooks
  const { isMobile } = useResponsive()
  const { leadData, loading, open, openItem, openLid, addSource, sourceData, queryParams, bigLoader } = useAppSelector((state) => state.leads)
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { push, pathname, query } = useRouter()

  // ** States
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<any>({})


  // ** Main  Functions
  const handleClose = () => dispatch(setOpen(null))

  const createDepartmentItemSubmit = async (values: any) => {
    const newValues = { ...values, parent: openItem }
    await dispatch(createDepartmentItem(newValues))
    await dispatch(fetchDepartmentList())
  }

  const createDepartmentStudentSubmit = async (values: any) => {
    const newValues = { ...values }
    if (values.phone) {
      const newPhone: string = values.phone.split(' ').join('')
      if (newPhone.length === 9) {
        Object.assign(newValues, { phone: `+998${newPhone}` })
      } else {
        Object.assign(newValues, { phone: `${newPhone}` })
      }
    }
    await dispatch(createDepartmentStudent(newValues))
    await dispatch(fetchDepartmentList())
  }

  const searchSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.()
    dispatch(updateLeadParams({ search }))
    dispatch(fetchDepartmentList({ ...queryParams, search }))
  }

  const viewArchive = (is_active: boolean) => {
    dispatch(updateLeadParams({ is_active }))
    dispatch(fetchDepartmentList({ ...queryParams, is_active }))
  }


  const closeCreateLid = () => {
    dispatch(setOpenLid(null))
    dispatch(setAddSource(false))
  }

  useEffect(() => {
    dispatch(fetchSources())
    dispatch(fetchDepartmentList())
  }, [])


  return user?.role.length === 1 && user?.role.includes('teacher') ? <TeacherProfile /> : (
    <Box sx={{ maxWidth: '100%', overflowX: 'auto', padding: '10px', pt: 0 }}>
      <Box sx={{ width: '100%', p: '10px 0' }}>
        <form style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onSubmit={searchSubmit}>
          <TextField
            defaultValue={query?.search || ''}
            autoComplete='off'
            autoFocus
            size='small'
            sx={{ maxWidth: '300px', width: '100%' }} color='primary' placeholder={`${t("Qidirish")}...`} onChange={(e) => {
              setSearch(e.target.value)
            }} />
          <Button variant='outlined' onClick={() => searchSubmit()}>{t("Qidirish")}</Button>
          <label>
            <Switch checked={!queryParams.is_active} onChange={(e, v) => viewArchive(!v)} />
            {t("Arxiv")}
          </label>
          <Button variant='outlined' onClick={() => push('/lids/stats')}>{t("Hisobot")}</Button>
        </form>
      </Box>
      {!bigLoader ? <Box
        padding={'10px 0'}
        display={'flex'}
        gap={5}
        sx={{ minHeight: 600, alignItems: isMobile ? 'center' : 'flex-start' }}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        {
          leadData.map((lead: any) => (
            <LidsKanban id={lead.id} key={lead.id} items={lead.children} title={lead.name} status='success' />
          ))
        }
        {!isMobile && <Button onClick={() => dispatch(setOpen('add-department'))} sx={{ minWidth: '300px' }} size='small' variant='contained' startIcon={<IconifyIcon icon={'material-symbols:add'} />}>{t("Bo'lim yaratish")}</Button>}

      </Box> : <SubLoader />}

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
          <Form onSubmit={(values: CreatesDepartmentState) => dispatch(createDepartment(values))} valueTypes='json' id='ddassdscd' sx={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <TextField fullWidth size='small' label={t("Bo'lim nomi")} name='name' />
            {/* <TextField fullWidth size='small' label={t("Bo'lim tartibi")} type='number' name='order' /> */}
            <LoadingButton loading={loading} type='submit' variant='outlined'>{t("Yaratish")}</LoadingButton>
          </Form>
        </DialogContent>
      </Dialog >

      <Dialog onClose={() => dispatch(setOpenItem(null))} open={openItem !== null}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t("Yangi bo'lim biriktirish")}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => dispatch(setOpenItem(null))}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <Form setError={setError} onSubmit={createDepartmentItemSubmit} valueTypes='json' id='cosczdasfwdijfo' sx={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FormControl fullWidth>
              <TextField fullWidth error={error.name?.error} size='small' label={t("Bo'lim nomi")} name='name' />
              <FormHelperText error={error.name?.error}>{error.name?.message}</FormHelperText>
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
            onClick={() => {
              dispatch(setAddSource(false))
              dispatch(setOpenLid(null))
            }}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <Form setError={setError} reqiuredFields={['department', 'source_name', 'phone', 'first_name']} onSubmit={createDepartmentStudentSubmit} valueTypes='json' id='dqdwgsfdgdfa' sx={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                  leadData.some((el: any) => el.id === openLid) ? leadData?.find((el: any) => el.id === openLid)?.children?.map((lead: any) => <MenuItem key={lead.id} value={Number(lead.id)}>{lead.name}</MenuItem>) : <></>
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
                  onChange={(e: any) => dispatch(setAddSource(e?.target?.value === 0))}
                  sx={{ mb: 1 }}
                >
                  {
                    sourceData.map((lead: any) => <MenuItem key={lead.id} value={lead.name}>{lead.name}</MenuItem>)
                  }
                  <MenuItem value={0} sx={{ fontWeight: '600' }}><IconifyIcon icon={'ic:baseline-add'} /> {t("Yangi qo'shish")}</MenuItem>
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
