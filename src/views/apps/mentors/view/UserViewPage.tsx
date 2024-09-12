// ** MUI Imports
import Grid from '@mui/material/Grid'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { videoUrls } from 'src/@core/components/video-header/video-header'
import useTeachers from 'src/hooks/useTeachers'

const UserViewLeft = dynamic(() => import('src/views/apps/mentors/view/UserViewLeft'));
const UserViewRight = dynamic(() => import('src/views/apps/mentors/view/UserViewRight'));
const VideoHeader = dynamic(() => import('src/@core/components/video-header/video-header'));

const UserView = ({ tab }: any) => {
  const router = useRouter()
  const url = tab

  // hooks
  const { getTeacherById, teacherData } = useTeachers()

  useEffect(() => {
    getTeacherById(router.query.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.teachers} />
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft userData={teacherData} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight tab={url} invoiceData={teacherData} />
        </Grid>
      </Grid>
    </div>
  )
}

export default UserView
