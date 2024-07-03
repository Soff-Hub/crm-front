// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getGroupById } from 'src/store/apps/groupDetails'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/groups/view/UserViewLeft'
import UserViewRight from 'src/views/apps/groups/view/UserViewRight'

const UserView = ({ tab, id }: any) => {
  // hooks
  const { groupData } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getGroupById(id))
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={groupData} reRender={() => getGroupById(id)} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} invoiceData={groupData} />
      </Grid>
    </Grid>
  )
}

export default UserView
