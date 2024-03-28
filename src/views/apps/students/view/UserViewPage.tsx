// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useStudent from 'src/hooks/useStudents'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/students/view/UserViewLeft'
import UserViewRight from 'src/views/apps/students/view/UserViewRight'

const UserView = ({ tab }: any) => {
  const router = useRouter()
  const url = tab


  // hooks
  const { getStudentById, studentData } = useStudent()

  useEffect(() => {
    getStudentById(router.query.student)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function rerender() {
    getStudentById(router.query.student)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={studentData} rerender={rerender} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight groupData={studentData} rerender={rerender} tab={url} invoiceData={[]} />
      </Grid>
    </Grid>
  )
}

export default UserView
