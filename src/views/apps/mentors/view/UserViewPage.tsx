// ** MUI Imports
import Grid from '@mui/material/Grid'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { videoUrls } from 'src/@core/components/video-header/video-header'
import { AuthContext } from 'src/context/AuthContext'
import useTeachers from 'src/hooks/useTeachers'

const UserViewLeft = dynamic(() => import('src/views/apps/mentors/view/UserViewLeft'));
const UserViewRight = dynamic(() => import('src/views/apps/mentors/view/UserViewRight'));
const VideoHeader = dynamic(() => import('src/@core/components/video-header/video-header'));

const UserView = ({ tab }: any) => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const url = tab

  const { getTeacherById, teacherData } = useTeachers()

  useEffect(() => {
    if (!user?.role.includes('ceo') && !user?.role.includes('admin') && !user?.role.includes('watcher')&& !user?.role.includes('marketolog')) {
      router.push("/")
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
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
