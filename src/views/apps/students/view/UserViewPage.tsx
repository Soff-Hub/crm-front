// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail } from 'src/store/apps/students'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/students/view/UserViewLeft'
import UserViewRight from 'src/views/apps/students/view/UserViewRight'

const UserView = ({ tab, student }: any) => {
  const url = tab

  // hooks
  const { studentData } = useAppSelector(state => state.students)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchStudentDetail(student))
  }, [])

  return (
    <div>
      <VideoHeader item={videoUrls.students} />
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft userData={studentData} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight groupData={studentData} tab={url} invoiceData={[]} />
        </Grid>
      </Grid>
    </div>
  )
}

export default UserView
