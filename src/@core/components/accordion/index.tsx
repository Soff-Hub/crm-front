// ** MUI Imports
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'

import {
  Box,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import IconifyIcon from '../icon'
import api from 'src/@core/utils/api'
import KanbanItem from '../card-statistics/kanban-item'
import Form from '../form'
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'
import showResponseError from 'src/@core/utils/show-response-error'
import useSMS from 'src/hooks/useSMS'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchDepartmentList, setOpenLid, setSectionId } from 'src/store/apps/leads'
import dynamic from 'next/dynamic'

const DepartmentSendSmsForm = dynamic(() => import('src/views/apps/lids/departmentItem/DepartmentSendSmsForm'), {
  ssr: false // Disable server-side rendering if required
})

// Dynamic import for EditDepartmentItemForm
const EditDepartmentItemForm = dynamic(() => import('src/views/apps/lids/departmentItem/EditDepartmentItemForm'), {
  ssr: false // Disable server-side rendering if required
})

interface AccordionProps {
  title?: string
  onView: () => void
  item: any
  parentId: any
  is_amocrm?: boolean
  student_count?: any
}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid${theme.palette.divider}`
  }
}))

const badge = {
  border: '1px solid #8D8E9C',
  minWidth: '25px',
  height: '25px',
  color: '#8D8E9C',
  padding: '5px',
  background: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 600,
  borderRadius: '20px',
  marginRight: '5px'
}

export default function AccordionCustom({ onView, parentId, item, is_amocrm, student_count }: AccordionProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [leadData, setLeadData] = useState<any[]>([])
  const [openDialog, setOpenDialog] = useState<'sms' | 'edit' | 'delete' | 'recover' | null>(null)
  const [error, setError] = useState<any>({})
  const [count, setCount] = useState<any>(item.student_count)
  const { t } = useTranslation()
  const { departmentsState } = useAppSelector(state => state.user)
  const { queryParams } = useAppSelector(state => state.leads)
  const [amoCrmData, setAmoCrmData] = useState<any | null>(null)
  console.log(item)

  const { smsTemps, getSMSTemps } = useSMS()
  const dispatch = useAppDispatch()

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleGetLeads = async (isLoad: boolean) => {
    if (isLoad) setOpen(!open)
    setLoading(true)
    try {
      const resp = await api.get(is_amocrm ? `/amocrm/leads/${item?.id}/` : `leads/department-user-list/${item.id}/`, {
        params: queryParams
      })
      setLeadData(resp.data)
      setCount(resp.data.length)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }


  const handleEditLead = async (id: any, values: any) => {
    // setOpen(false)
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
      const resp = await api.patch(`leads/anonim-user/update/${id}/`, newValues)
      await handleGetLeads(false)
      return Promise.resolve(resp)
    } catch (err: any) {
      if (err.response) {
        showResponseError(err.response.data, setError)
      }
      return Promise.reject(err)
    }
  }

  const deleteDepartmentItem = async () => {
    setLoading(true)
    try {
      await api.patch(`leads/department-update/${item.id}`, { is_active: false })
      setLoading(false)
      setOpenDialog(null)
      toast.success("Muvaffaqiyatli o'chirildi", {
        position: 'top-center'
      })
      await dispatch(fetchDepartmentList(queryParams))
    } catch {
      setLoading(false)
    }
  }

  const recoverDepartmentItem = async (values: any) => {
    setLoading(true)
    try {
      await api.patch(`leads/department-update/${item.id}`, { ...values, is_active: true })
      setLoading(false)
      setOpenDialog(null)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) onView()
  }, [open])

  useEffect(() => {
    if (open) {
      handleGetLeads(false)
    }
    setCount(item.student_count)
  }, [item.student_count])

  const newLids = () => {
    dispatch(setOpenLid(parentId))
    dispatch(setSectionId(item?.id))
    setAnchorEl(null)
  }

  return (
    <Card sx={{ width: '100%', boxShadow: 'rgba(148, 163, 184, 0.1) 0px 3px 12px' }} id={item.id} draggable>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Typography
          fontSize={16}
          sx={{ flexGrow: 1, padding: '10px', cursor: 'pointer' }}
          onClick={() => (!open ? handleGetLeads(true) : setOpen(!open))}
        >
          {item.name}
        </Typography>
        {is_amocrm ? <Box sx={badge}>{student_count}</Box> : <Box sx={badge}>{count}</Box>}

        <IconButton onClick={handleClick} size='small'>
          <IconifyIcon
            icon='humbleicons:dots-horizontal'
            style={{ cursor: 'pointer', color: '#8D8E9C' }}
            aria-haspopup='true'
            aria-controls='customized-menu'
          />
        </IconButton>
        <IconButton
          onClick={() => (!open ? handleGetLeads(true) : setOpen(!open))}
          sx={{ marginRight: 1 }}
          size='small'
        >
          <IconifyIcon
            style={{ cursor: 'pointer', color: '#8D8E9C', transform: open ? 'rotateZ(180deg)' : '', fontSize: '25px' }}
            icon={'iconamoon:arrow-down-2-light'}
          />
        </IconButton>
      </Box>
      <Box sx={{ maxHeight: '500px', overflow: 'auto', px: 2, gap: 2, pt: open ? 2 : 0, marginY: open ? 2 : 0 }}>
        {open ? (
          loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress disableShrink sx={{ mt: 1, mb: 2, mx: 'auto' }} size={25} />
            </Box>
          ) : leadData.length > 0 ? (
            leadData.map(lead => (
                <KanbanItem
                    is_amocrm={is_amocrm}
                reRender={handleGetLeads}
                is_view={lead.is_view}
                last_activity={lead.last_activity}
                id={lead.id}
                handleEditLead={handleEditLead}
                key={lead.id}
                status={'success'}
                title={lead.first_name}
                phone={lead.phone}
              />
            ))
          ) : (
            <Typography variant='body2' sx={{ fontStyle: 'italic', textAlign: 'center' }}>
              {t("Bo'sh")}
            </Typography>
          )
        ) : (
          ''
        )}
      </Box>
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
        {queryParams.is_active ? (
          <Box>
            {is_amocrm ?
            <MenuItem onClick={() => setOpenDialog('delete')} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:delete' fontSize={20} />
            {t("O'chirish")}
              </MenuItem> :
              <>
               <MenuItem
              onClick={async () => {
                getSMSTemps()
                setOpenDialog('sms')
                setAnchorEl(null)
                await handleGetLeads(false)
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconifyIcon icon='mdi:sms' fontSize={20} />
              {t('SMS yuborish')}
            </MenuItem>
            <MenuItem onClick={() => (setOpenDialog('edit'), setAnchorEl(null))} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:edit' fontSize={20} />
              {t('Tahrirlash')}
            </MenuItem>
            <MenuItem onClick={() => newLids()} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:leads' fontSize={20} />
              {t("Yangi lid qo'shish")}
            </MenuItem>
            <MenuItem onClick={() => setOpenDialog('delete')} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:delete' fontSize={20} />
              {t("O'chirish")}
            </MenuItem>
              </>
          }
           
          </Box>
        ) : (
          <>
            <MenuItem
              onClick={async () => {
                getSMSTemps()
                setOpenDialog('sms')
                setAnchorEl(null)
                await handleGetLeads(false)
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconifyIcon icon='mdi:sms' fontSize={20} />
              {t('SMS yuborish')}
            </MenuItem>
            <MenuItem onClick={() => (getSMSTemps(), setOpenDialog('recover'))} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:reload' fontSize={20} />
              {t('Tiklash')}
            </MenuItem>
          </>
        )}
      </Menu>

      {/* EDIT Item*/}
      <Dialog open={openDialog === 'edit'} onClose={() => setOpenDialog(null)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('Tahrirlash')}</Typography>
          <IconifyIcon onClick={() => setOpenDialog(null)} icon={'material-symbols:close'} />
        </DialogTitle>
        <DialogContent sx={{ minWidth: '300px' }}>
          <EditDepartmentItemForm
            id={item.id}
            setLoading={setLoading}
            setOpenDialog={setOpenDialog}
            loading={loading}
            defaultName={item.name}
          />
        </DialogContent>
      </Dialog>

      {/* SEND SMS */}
      <Dialog open={openDialog === 'sms'} onClose={() => setOpenDialog(null)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('SMS yuborish')}</Typography>
          <IconifyIcon onClick={() => setOpenDialog(null)} icon={'material-symbols:close'} />
        </DialogTitle>

        <DialogContent sx={{ minWidth: '300px' }}>
          <DepartmentSendSmsForm
            smsTemps={smsTemps}
            setLoading={setLoading}
            loading={loading}
            users={leadData?.map(el => Number(el.id))}
            setOpenDialog={setOpenDialog}
          />
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={openDialog === 'delete'} onClose={() => setOpenDialog(null)}>
        <DialogContent sx={{ minWidth: '300px' }}>
          <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
            {t("O'chirishni tasdiqlang")}
          </Typography>
          <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
            <LoadingButton variant='outlined' size='small' color='error' onClick={() => setOpenDialog(null)}>
              {t('Bekor qilish')}
            </LoadingButton>
            <LoadingButton loading={loading} size='small' variant='outlined' onClick={deleteDepartmentItem}>
              {t("O'chirish")}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialog === 'recover'} onClose={() => setOpenDialog(null)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('Tiklash')}</Typography>
          <IconifyIcon onClick={() => setOpenDialog(null)} icon={'material-symbols:close'} />
        </DialogTitle>
        <DialogContent sx={{ minWidth: '300px' }}>
          <Form
            setError={setError}
            valueTypes='json'
            onSubmit={recoverDepartmentItem}
            id='dasweq423'
            sx={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <FormControl fullWidth>
              <TextField label={t("Bo'lim nomi")} size='small' defaultValue={item.name} name='name' />
            </FormControl>

            <FormControl>
              <InputLabel size='small' id='demo-simple-select-outlined-label'>
                {t("Bo'lim")}
              </InputLabel>
              <Select
                size='small'
                label={t("Bo'lim")}
                defaultValue=''
                id='demo-simple-select-outlined'
                labelId='demo-simple-select-outlined-label'
                name='parent'
              >
                {departmentsState.map((el: any) => (
                  <MenuItem value={el.id} sx={{ wordBreak: 'break-word' }}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LoadingButton loading={loading} type='submit' variant='outlined'>
              {t('Saqlash')}
            </LoadingButton>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
