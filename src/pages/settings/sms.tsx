import { Box, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchSmsList, fetchSmsListQuery, setOpenCreateSms, setOpenCreateSmsCategory } from 'src/store/apps/settings'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import SmsTableRowOptions from 'src/views/apps/settings/ceo/SmsTableRowOptions'
import CreateSmsDialog from 'src/views/apps/settings/ceo/CreateSmsDialog'
import CreateSmsCategoryDialog from 'src/views/apps/settings/ceo/CreateSmsCategoryDialog'
import EditSmsDialog from 'src/views/apps/settings/ceo/EditSmsDialog'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { useTranslation } from 'react-i18next'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { GridExpandMoreIcon } from '@mui/x-data-grid'

export default function RoomsPage() {
  const { sms_list, smschild_list, is_pending, is_childpending } = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()
  const [parentId, setParentId] = useState<number | null>(null)
  const { t } = useTranslation()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [deleteItemId,setDeleteItemId] = useState<number|null>(null)
  const setOpenAddGroup = (value: boolean) => {
    dispatch(setOpenCreateSms(value))
  }

  
  const handleDelete = async () => {
    setDeleteLoading(true)
    await api
      .delete(`common/sms-form/delete/${deleteItemId}`)
      .then(res => {
        toast.success("Kategoriya o'chirildi")
        setSuspendDialogOpen(false)
        dispatch(fetchSmsList())
      })
      .catch(err => {
        console.log(err)
        toast.error(err.response.data.msg || 'Serverda hatolik bor')
      })
    setDeleteLoading(false)
  }

  

  useEffect(() => {
    if (parentId) {
      dispatch(fetchSmsListQuery(parentId))
    }
  }, [parentId])

  return (
    <div>
      <VideoHeader item={videoUrls.sms} />
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t('SMS shablonlar')}</Typography>
        <Box sx={{ display: 'flex', gap: 5 }}>
          <Button
            onClick={() => dispatch(setOpenCreateSmsCategory(true))}
            variant='contained'
            size='small'
            startIcon={<IconifyIcon icon='ic:baseline-plus' />}
          >
            {t("Yangi kategoriya qo'shish")}
          </Button>
          <Button
            onClick={() => setOpenAddGroup(true)}
            variant='contained'
            size='small'
            startIcon={<IconifyIcon icon='ic:baseline-plus' />}
          >
            {t("Yangi shablon qo'shish")}
          </Button>
        </Box>
      </Box>

      {is_pending ? (
        <SubLoader />
      ) : (
        sms_list.map(item => (
          <Accordion
           
            key={item.id}
            sx={{ marginY: 5 }}
            expanded={parentId === item.id}
            onChange={() => setParentId(parentId === item.id ? null : item.id)}
          >
            <AccordionSummary
              expandIcon={<GridExpandMoreIcon />}
              aria-controls='panel1-content'
              id={`panel-${item.id}-header`}
            >
              <Box  sx={{width:'100%', display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <Typography component='span'>{item.description}</Typography>
                <div onClick={(event)=>event.stopPropagation()}>
                <SmsTableRowOptions  id={item.id}/>
              </div>
               </Box>
              {/* <Button
                variant='contained'
                color='error'
                size='small'
                onClick={(event) => { setSuspendDialogOpen(true) ,setDeleteItemId(item.id),event.stopPropagation()}}
                sx={{ marginLeft: 'auto' }}
              >
                {t('Delete')}
              </Button> */}
            </AccordionSummary>
            {item.id === parentId && is_childpending ? (
              <SubLoader />
            ) : smschild_list.length === 0 ? (
              <Typography textAlign='center' sx={{ paddingBottom: 5 }}>
                Ma'lumot yo'q
              </Typography>
            ) : (
              smschild_list.map(child => (
                <AccordionDetails key={child.id}>
                  <Box sx={{ border: 'solid 1px', borderRadius:2,paddingY:2,paddingX:4, display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
                  <Typography>{child.description}</Typography>
                  <SmsTableRowOptions parent_id={item.id} id={child.id}/>
                  </Box>
                </AccordionDetails>
              ))
            )}
          </Accordion>
        ))
      )}

      <CreateSmsDialog />
      <CreateSmsCategoryDialog />
      <EditSmsDialog />
      <UserSuspendDialog
        loading={deleteLoading}
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
        handleOk={handleDelete}
      />
    </div>
  )
}
