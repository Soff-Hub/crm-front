import { useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import Status from 'src/@core/components/status'
import { useAppDispatch, useAppSelector } from 'src/store'
import GroupDetails from './GroupDetails'
import { getStudents, studentsUpdateParams } from 'src/store/apps/groupDetails'
import SendSMS from './SendSMS'
import AddNote from './AddNote'
import AddStudents from './AddStudents'
import Delete from './Delete'
import UserViewStudentsList from '../ViewStudents/UserViewStudentsList'
import useResponsive from 'src/@core/hooks/useResponsive'
import OnlineLessonModal from './OnlineLessonModal'
import { status } from 'nprogress'

const UserViewLeft = () => {
  const { studentsQueryParams, isGettingStudents } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { query } = useRouter()
  const { isTablet, isDesktop, isMobile } = useResponsive()

  const queryString = useMemo(() => {
    return new URLSearchParams(studentsQueryParams).toString()
  }, [studentsQueryParams])

  useEffect(() => {
    dispatch(getStudents({ id: query.id, queryString }))
  }, [queryString])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <GroupDetails />
      </Grid>

      <Grid item xs={12}>
        <CardContent sx={{ p: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
            {['new', 'active', 'archive', 'frozen'].map(el => (
              <div key={el} style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                <Status
                  color={el == 'active' ? 'success' : el == 'new' ? 'warning' : el == 'frozen' ? 'secondary' : 'error'}
                />{' '}
                {el == 'active' ? t('aktiv') : el == 'new' ? t('sinov') : el == 'frozen' ? t('frozen') : t('arxiv')}
              </div>
            ))}
          </div>

          <UserViewStudentsList />
          {!isGettingStudents && (
            <Box sx={{ width: '100%', display: 'flex', pt: '10px' }}>
              <Button
                startIcon={
                  <IconifyIcon
                    style={{ fontSize: '12px' }}
                    icon={`icon-park-outline:to-${studentsQueryParams.status === 'archive' ? 'top' : 'bottom'}`}
                  />
                }
                sx={{ fontSize: '10px', marginLeft: 'auto' }}
                size='small'
                color={studentsQueryParams.status === 'archive' ? 'primary' : 'error'}
                variant='text'
                onClick={() => {
                  if (studentsQueryParams.status === 'archive') {
                    dispatch(studentsUpdateParams({ status: 'active,new' }))
                  } else dispatch(studentsUpdateParams({ status: 'archive' }))
                }}
              >
                {studentsQueryParams.status === 'archive' ? t('Arxivni yopish') : t("Arxivdagi o'quvchilarni ko'rish")}
              </Button>
            </Box>
          )}
        </CardContent>
      </Grid>
      <SendSMS />
      <OnlineLessonModal />
      <AddNote />
      <AddStudents />
      <Delete />
    </Grid>
  )
}

export default UserViewLeft
