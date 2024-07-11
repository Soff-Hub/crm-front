// ** MUI Imports
import { Box, Button } from '@mui/material'
import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchSources, setOpen } from 'src/store/apps/leads'
import LidsHeader from 'src/views/apps/lids/LidsHeader'
import LidsKanban from 'src/views/apps/lids/LidsKanban'
import CreateAnonimDialogDialog from 'src/views/apps/lids/anonimUser/CreateAnonimUserDialog'
import CreateDepartmentDialog from 'src/views/apps/lids/department/create-dialog'
import CreateDepartmentItemDialog from 'src/views/apps/lids/departmentItem/Dialog'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import TeacherProfile from 'src/views/teacher-profile'

const Lids = () => {

  // ** Hooks
  const { isMobile } = useResponsive()
  const { leadData, bigLoader } = useAppSelector((state) => state.leads)
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()


  useEffect(() => {
    dispatch(fetchSources())
  }, [])


  return user?.role.length === 1 && user?.role.includes('teacher') ? <TeacherProfile /> : (
    <Box sx={{ maxWidth: '100%', overflowX: 'auto', padding: '10px', pt: 0 }}>
      <LidsHeader />
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

      <CreateDepartmentDialog />

      <CreateDepartmentItemDialog />

      <CreateAnonimDialogDialog />
    </Box >
  )
}

Lids.acl = {
  action: 'manage',
  subject: 'lids'
}

export default Lids
