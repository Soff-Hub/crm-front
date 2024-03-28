// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useGroups from 'src/hooks/useGroups'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/groups/view/UserViewLeft'
import UserViewRight from 'src/views/apps/groups/view/UserViewRight'

const UserView = ({ tab }: any) => {
  const router = useRouter()
  const url = `${tab}`


  // hooks
  const { getGroupById, groupData } = useGroups()

  useEffect(() => {
    getGroupById(router.query.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={groupData} reRender={() => getGroupById(router.query.id)} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={url} invoiceData={groupData} />
      </Grid>
    </Grid>
  )
}

export default UserView
