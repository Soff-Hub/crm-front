'use client'
// ** MUI Imports
import { Box, Skeleton } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { videoUrls } from 'src/@core/components/video-header/video-header'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchAmoCrmPipelines, fetchSources } from 'src/store/apps/leads'
import { fetchSmsList } from 'src/store/apps/settings'

const VideoHeader = dynamic(() => import('src/@core/components/video-header/video-header'))
const LidsHeader = dynamic(() => import('src/views/apps/lids/LidsHeader'))
const LidsKanban = dynamic(() => import('src/views/apps/lids/LidsKanban'))
const SubLoader = dynamic(() => import('src/views/apps/loaders/SubLoader'))
const TeacherProfile = dynamic(() => import('src/views/teacher-profile'))
const CreateAnonimDialogDialog = dynamic(() => import('src/views/apps/lids/anonimUser/CreateAnonimUserDialog'))
const CreateDepartmentDialog = dynamic(() => import('src/views/apps/lids/department/create-dialog'))
const CreateDepartmentItemDialog = dynamic(() => import('src/views/apps/lids/departmentItem/Dialog'))

const Lids = () => {
  // ** Hooks
  const { isMobile } = useResponsive()
  const { leadData, bigLoader, pipelines, queryParams } = useAppSelector(state => state.leads)
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [data, setData] = useState(leadData)
  const router = useRouter()

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      router.push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    dispatch(fetchSmsList())
    dispatch(fetchSources())
  }, [])

  return user?.role.length === 1 && user?.role.includes('teacher') ? (
    <TeacherProfile />
  ) : (
    <Box sx={{ maxWidth: '100%', padding: '10px', pt: 0 }}>
      <VideoHeader item={videoUrls.leads} />
      <LidsHeader />
      {!bigLoader ? (
        <Box
          padding={'10px 0'}
          display={'flex'}
          gap={5}
          sx={{ minHeight: 600, alignItems: isMobile ? 'center' : 'flex-start', overflowX: 'auto' }}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          {pipelines?.map((lead: any) => (
            <LidsKanban
              is_amocrm={lead.is_amocrm}
              id={lead.id}
              key={lead.id}
              items={lead.children}
              title={lead.name}
              status='success'
            />
          ))}
          {leadData.map((lead: any) => (
            <LidsKanban
              is_amocrm={lead.is_amocrm}
              id={lead.id}
              key={lead.id}
              items={lead.children}
              title={lead.name}
              status='success'
            />
          ))}
        </Box>
      ) : (
        <Box>
          <Box display='flex' gap={5} marginTop={10}>
            <Skeleton variant='rounded' width={300} height={50} />
            <Skeleton variant='rounded' width={300} height={50} />
            <Skeleton variant='rounded' width={300} height={50} />
            <Skeleton variant='rounded' width={300} height={50} />
            <Skeleton variant='rounded' width={300} height={50} />
          </Box>
          <Box display='flex' gap={5} marginTop={5}>
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
          </Box>
          <Box display='flex' gap={5} marginTop={5}>
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
            <Skeleton variant='rounded' width={300} height={70} />
          </Box>
        </Box>
      )}

      <CreateDepartmentDialog />

      <CreateDepartmentItemDialog />

      <CreateAnonimDialogDialog />
    </Box>
  )
}

Lids.acl = {
  action: 'manage',
  subject: 'lids'
}

export default Lids
