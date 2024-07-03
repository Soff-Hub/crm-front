import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getAttendance, getDays, getGroupById, getSubData, resetStore, setGettingAttendance } from 'src/store/apps/groupDetails'
import UserViewLeft from 'src/views/apps/groups/view/GroupViewLeft/UserViewLeft'
import UserViewRight from 'src/views/apps/groups/view/UserViewRight'

const UserView = () => {
  const router = useRouter()
  const url = `${router.query.tab}`
  const { groupData, queryParams } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  console.log(groupData);

  useEffect(() => {
    (async function () {
      const queryString = new URLSearchParams(queryParams).toString()
      dispatch(setGettingAttendance(true))
      await Promise.all([
        dispatch(getGroupById(router.query.id)),
        dispatch(getSubData()),
        dispatch(getAttendance({ date: `${router.query?.year || new Date().getFullYear()}-${getMontNumber(router.query.month)}`, group: router.query.id, queryString: queryString })),
        dispatch(getDays({ date: `${router.query?.year || new Date().getFullYear()}-${getMontNumber(router.query.month)}`, group: router.query.id }))
      ])
      dispatch(setGettingAttendance(false))
    })()
    return () => {
      dispatch(resetStore())
    }
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={url} />
      </Grid>
    </Grid>
  )
}

export default UserView
