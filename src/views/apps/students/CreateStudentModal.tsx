import React, { useEffect } from 'react'

// ** Components
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { Box, IconButton, Typography, styled } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import CreateStudentForm from './CreateStudentForm'

// ** Assets
import { useTranslation } from 'react-i18next'

// ** Packs
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOpenEdit } from 'src/store/apps/students'

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    // width: '100%',
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

export default function CreateStudentModal() {
  // ** Hooks
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { openEdit } = useAppSelector(state => state.students)

 
    
    
  function onClose() {
    dispatch(setOpenEdit(null))
  }

  useEffect(() => {
    return () => {
      dispatch(setOpenEdit(null))
    }
  }, [])

  return (
    <div>
      <Drawer open={openEdit === 'create'} anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {t("O'quvchi qo'shish")}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <IconifyIcon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
        <Box width={'100%'}>{openEdit === 'create' && <CreateStudentForm />}</Box>
      </Drawer>
    </div>
  )
}
