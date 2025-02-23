import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Excel from 'src/@core/components/excelButton/Excel'
import ExcelGrades from 'src/@core/components/excelButton/ExcelGrades'
import ExcelStudents from 'src/@core/components/excelButton/ExcelStudents'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import api from 'src/@core/utils/api'
import { getMontNumber } from 'src/@core/utils/gwt-month-name'
import ceoConfigs from 'src/configs/ceo'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  getAttendance,
  getDays,
  getGroupById,
  getSubData,
  resetStore,
  setGettingAttendance,
  setGettingGroupDetails
} from 'src/store/apps/groupDetails'
import { setRoomsData, setTeacherData } from 'src/store/apps/groups'
import UserViewLeft from 'src/views/apps/groups/view/GroupViewLeft/UserViewLeft'
import UserViewRight from 'src/views/apps/groups/view/UserViewRight'

const UserView = () => {
  const router = useRouter()
  const url = `${router.query.tab}`
  const { queryParams } = useAppSelector(state => state.groupDetails)
  const { user } = useContext(AuthContext)
  const dispatch = useAppDispatch()

  const getTeachers = async () => {
    await api
      .get(`${ceoConfigs.employee_checklist}?role=teacher`)
      .then(data => {
        dispatch(setTeacherData(data.data))
      })
      .catch(error => {
        console.log(error)
      })
  }
  const getRooms = async () => {
    await api
      .get('common/room-check-list/')
      .then(data => dispatch(setRoomsData(data.data)))
      .catch(error => {
        console.log(error)
      })
  }
  useEffect(() => {
    getTeachers()
    getRooms()
  }, [])

  useEffect(() => {
    if (user?.role.includes('student') && !user?.role.includes('watcher')) {
      router.push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    ;(async function () {
      const queryString = new URLSearchParams(queryParams).toString()
      dispatch(setGettingAttendance(true))
      dispatch(setGettingGroupDetails(true))
      if (user && user?.role[0] !== 'teacher' && user.role.length === 1) {
        await Promise.all([dispatch(getSubData())])
      }
      await Promise.all([
        dispatch(
          getDays({
            date: `${router.query?.year || new Date().getFullYear()}-${getMontNumber(router.query.month)}`,
            group: router.query.id
          })
        ),
        dispatch(getGroupById(router.query.id)),
        dispatch(
          getAttendance({
            date: `${router.query?.year || new Date().getFullYear()}-${getMontNumber(router.query.month)}`,
            group: router.query.id,
            queryString: queryString
          })
        )
      ])
      dispatch(setGettingAttendance(false))
      dispatch(setGettingGroupDetails(false))
    })()
    return () => {
      dispatch(resetStore())
    }
  }, [])

  return (
    <div>
      <Box display={'flex'} justifyContent={'end'} gap={5}>
        <Box sx={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <ExcelGrades url={`/common/ratings/export/${router.query.id}`} />
        </Box>

        <VideoHeader item={videoUrls.group} />
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <UserViewLeft />
        </Grid>

        <Grid item xs={12} md={7}>
          <UserViewRight tab={url} />
        </Grid>
      </Grid>
    </div>
  )
}

export default UserView
