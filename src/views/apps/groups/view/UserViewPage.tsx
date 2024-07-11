import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getAttendance, getDays, getGroupById, getSubData, resetStore, setGettingAttendance, setGettingGroupDetails } from 'src/store/apps/groupDetails'
import UserViewLeft from 'src/views/apps/groups/view/GroupViewLeft/UserViewLeft'
import UserViewRight from 'src/views/apps/groups/view/UserViewRight'

const UserView = () => {
  const router = useRouter()
  const url = `${router.query.tab}`
  const { queryParams } = useAppSelector(state => state.groupDetails)
  const { user } = useContext(AuthContext)
  const dispatch = useAppDispatch()

  useEffect(() => {
    (async function () {
      const queryString = new URLSearchParams(queryParams).toString()
      dispatch(setGettingAttendance(true))
      dispatch(setGettingGroupDetails(true))
      if (user && user?.role[0] !== 'teacher' && user.role.length === 1) {
        await Promise.all([
          dispatch(getSubData())
        ])
      }
      await Promise.all([
        dispatch(getDays({ date: `${router.query?.year || new Date().getFullYear()}-${getMontNumber(router.query.month)}`, group: router.query.id })),
        dispatch(getGroupById(router.query.id)),
        dispatch(getAttendance({ date: `${router.query?.year || new Date().getFullYear()}-${getMontNumber(router.query.month)}`, group: router.query.id, queryString: queryString }))
      ])
      dispatch(setGettingAttendance(false))
      dispatch(setGettingGroupDetails(false))
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
