// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import { AuthContext } from 'src/context/AuthContext'
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
  const router = useRouter()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user?.role.includes('student')) {
      router.push("/")
    }
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
