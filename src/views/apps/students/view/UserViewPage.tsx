// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import api from 'src/@core/utils/api'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail, setGroupChecklist, setStudentId } from 'src/store/apps/students'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/students/view/UserViewLeft'
import UserViewRight from 'src/views/apps/students/view/UserViewRight'

const UserView = ({ tab, student }: any) => {
  const url = tab

  const { studentData, studentId } = useAppSelector(state => state.students)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const { user } = useContext(AuthContext)

  async function getGroups() {
    await api
      .get(`common/group-check-list/?student=${studentData?.id}`)
      .then(res => dispatch(setGroupChecklist(res.data)))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    if (studentData?.id) {
      getGroups()
    }
  }, [studentData?.id])

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      router.push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    dispatch(fetchStudentDetail(student || studentId))
  }, [studentId, student])

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
