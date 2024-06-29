// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getGroupById } from 'src/store/apps/groupDetails'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/groups/view/UserViewLeft'
import UserViewRight from 'src/views/apps/groups/view/UserViewRight'

const UserView = () => {
  const router = useRouter()
  const url = `${router.query.tab}`

  // hooks
  const { groupData } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getGroupById(router.query.id))
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
