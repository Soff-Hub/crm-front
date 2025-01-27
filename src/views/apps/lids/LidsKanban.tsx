import {
  Box,
  Button,
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
import IconifyIcon from 'src/@core/components/icon'
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'
import {
  editAmoCrmData,
  editDepartment,
  fetchAmoCrmPipelines,
  fetchDepartmentList,
  setOpenActionModal,
  setOpenItem,
  setOpenLid
} from 'src/store/apps/leads'
import dynamic from 'next/dynamic'
import api from 'src/@core/utils/api'
import { useState } from 'react'
import Form from 'src/@core/components/form'
import { fetchSmsList } from 'src/store/apps/settings'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const AccordionCustom = dynamic(() => import('src/@core/components/accordion'))
const EditDepartmentDialog = dynamic(() => import('./department/edit-dialog'))

interface Props {
  title: string
  status: 'pending' | 'new' | 'success'
  items: any[]
  id: any
  is_amocrm?: boolean
}

export default function HomeKanban({ title, items, id, is_amocrm }: Props) {
  //** Hooks
  const { loading, openActionModal: open, queryParams, actionId } = useSelector((state: RootState) => state.leads)
  const dispatch = useAppDispatch()
  const { query } = useRouter()
  const [openDialog, setOpenDialog] = useState<'sms' | 'edit' | 'delete' | 'recover' | null>(null)
  const { t } = useTranslation()
  const [data, setData] = useState(items)
  const [error, setError] = useState<any>({})
  const [recoverLoading, setRecoverLoading] = useState(false)
  //** Main Funcitons
  const [leadData, setLeadData] = useState<any[]>([])


  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = data.findIndex(e => e.id === source.droppableId)
      const destinationColIndex = data.findIndex(e => e.id === destination.droppableId)

      const sourceCol = data[sourceColIndex]
      const destinationCol = data[destinationColIndex]

      const sourceTask = [...sourceCol.tasks]
      const destinationTask = [...destinationCol.tasks]

      const [removed] = sourceTask.splice(source.index, 1)
      destinationTask.splice(destination.index, 0, removed)

      data[sourceColIndex].tasks = sourceTask
      data[destinationColIndex].tasks = destinationTask

      setData(data)
    }
  }

  const recoverAmoDataItem = async () => {
    setRecoverLoading(true)
    try {
      await api
        .post(`amocrm/delete/`, { data_id: id, is_delete: false, condition: 'pipeline' })
        .then(res => {
          setOpenDialog(null)
          toast.success('Muvaffaqiyatli tiklandi', {
            position: 'top-center'
          })
          dispatch(fetchAmoCrmPipelines({ ...queryParams, status: 'active' }))
        })
        .catch(err => {
          setRecoverLoading(false)
          toast.error(err.response.data.is_delete)
          console.log(err)
        })
    } catch {
      setRecoverLoading(false)
    }
  }

  const deleteDepartmentItem = async () => {
    await dispatch(editDepartment({ is_active: false, id }))
    setOpen(null)
    toast.success("Muvaffaqiyatli o'chirildi")
    await dispatch(fetchDepartmentList())
  }

  const deleteAmoCrmData = async () => {
    await dispatch(editAmoCrmData({ data_id: id, is_delete: true, condition: 'pipeline' }))
    setOpen(null)
    toast.success("Muvaffaqiyatli o'chirildi", {
      position: 'top-center'
    })
    await dispatch(fetchAmoCrmPipelines(queryParams))
  }

  const setOpen = (value: 'delete' | 'edit' | null) => {
    if (!value) {
      dispatch(setOpenActionModal({ open: null, id: null }))
      return
    }
    dispatch(setOpenActionModal({ open: value, id }))
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', maxWidth: 350, minWidth: '300px' }}>
      <Box display={'flex'} alignItems={'center'} justifyContent='space-between' marginBottom={5}>
        {is_amocrm && (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 5 }}>
              <img width={40} height={40} src='/images/pages/amo-logo.png' alt='Amo CRM' />
              <Typography style={{ width: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }} fontSize={22}>
                {title}
              </Typography>
            </div>
            {!queryParams.is_active && (
              <MenuItem onClick={() => setOpenDialog('recover')} sx={{ borderRadius: 10 }}>
                <IconifyIcon icon='mdi:reload' fontSize={20} />
              </MenuItem>
            )}
          </div>
        )}
        {!is_amocrm && (
          <Typography style={{ width: '50%', overflow: 'hidden', textOverflow: 'ellipsis' }} fontSize={22}>
            {title}
          </Typography>
        )}
        {queryParams.is_active ? (
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {is_amocrm ? (
              title?.toLowerCase() !== 'leads' && (
                <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                  <IconifyIcon
                    icon={'icon-park-solid:delete-four'}
                    color='red'
                    onClick={() => setOpen('delete')}
                    style={{ padding: 1 }}
                  />
                </IconButton>
              )
            ) : (
              <>
                <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                  <IconifyIcon
                    icon={'fluent:person-add-24-filled'}
                    color='#84cc16'
                    onClick={() => dispatch(setOpenLid(id))}
                  />
                </IconButton>
                <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                  <IconifyIcon
                    icon={'heroicons-solid:view-grid-add'}
                    color='#14b8a6'
                    onClick={() => dispatch(setOpenItem(id))}
                  />
                </IconButton>
                {title?.toLowerCase() !== 'leads' && (
                  <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                    <IconifyIcon
                      icon={'fluent:text-bullet-list-square-edit-20-filled'}
                      color='orange'
                      onClick={() => setOpen('edit')}
                    />
                  </IconButton>
                )}
                {title?.toLowerCase() !== 'leads' && (
                  <IconButton sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                    <IconifyIcon
                      icon={'icon-park-solid:delete-four'}
                      color='red'
                      onClick={() => setOpen('delete')}
                      style={{ padding: 1 }}
                    />
                  </IconButton>
                )}
              </>
            )}
          </Box>
        ) : (
          ''
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 5, alignItems: 'flex-start', width: '100%', flexDirection: 'column', pt: 0 }}>
        {items.length < 1 && (
          <Typography
            variant='body2'
            sx={{ fontStyle: 'italic', textAlign: 'center', width: '100%', fontSize: '19px' }}
          >
            {t("Bo'sh")}
          </Typography>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="w-100  space-y-3">
          {items.map(lead => (
            <Droppable key={lead?.id} droppableId={`${lead?.id}`}>
              {provided => (
                <div  {...provided.droppableProps} ref={provided.innerRef} className='w-100' style={{marginBottom:10}}>

                  <div  className="kanban__section__title">
                  <AccordionCustom
                    student_count={lead.student_count}
                    is_amocrm={is_amocrm}
                    parentId={id}
                    item={lead}
                    key={lead.id}
                    onView={() => null}
                  />

                  </div>
                  
                </div>
              )}
            </Droppable>
          ))}

          </div>
        </DragDropContext>
      </Box>

      <Dialog open={open === 'delete' && actionId === id}>
        <DialogContent sx={{ width: '320px', padding: '20px 0' }}>
          <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
            {t("Bo'limni rostdan ham o'chirmoqchimisiz?")}
          </Typography>
        </DialogContent>
        <Box sx={{ padding: '0 0 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button color='primary' variant='outlined' onClick={() => setOpen(null)}>
            {t('Bekor qilish')}
          </Button>
          <LoadingButton
            color='error'
            loading={loading}
            variant='contained'
            onClick={is_amocrm ? deleteAmoCrmData : deleteDepartmentItem}
          >
            {t("O'chirish")}
          </LoadingButton>
        </Box>
      </Dialog>
      <Dialog open={openDialog === 'recover'} onClose={() => setOpenDialog(null)}>
        <DialogContent sx={{ minWidth: '300px' }}>
          <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
            {t('Tiklashni tasdiqlang')}
          </Typography>
          <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
            <LoadingButton variant='outlined' size='small' color='error' onClick={() => setOpenDialog(null)}>
              {t('Bekor qilish')}
            </LoadingButton>
            <LoadingButton loading={recoverLoading} size='small' variant='outlined' onClick={recoverAmoDataItem}>
              {t('Tiklash')}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
      <EditDepartmentDialog id={id} name={title} />
    </Box>
  )
}
