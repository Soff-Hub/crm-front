// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useStudent from 'src/hooks/useStudents'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail } from 'src/store/apps/students'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/students/view/UserViewLeft'
import UserViewRight from 'src/views/apps/students/view/UserViewRight'

const UserView = ({ tab, student }: any) => {
  const router = useRouter()
  const url = tab

  // hooks
  const { getStudentById } = useStudent()
  const { studentData } = useAppSelector(state => state.students)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchStudentDetail(student))
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={studentData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight groupData={studentData} tab={url} invoiceData={[]} />
      </Grid>
    </Grid>
  )
}

export default UserView
