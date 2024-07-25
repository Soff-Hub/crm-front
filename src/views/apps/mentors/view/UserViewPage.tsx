// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import useTeachers from 'src/hooks/useTeachers'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/mentors/view/UserViewLeft'
import UserViewRight from 'src/views/apps/mentors/view/UserViewRight'

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
