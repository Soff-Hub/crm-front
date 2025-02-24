import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Typography } from '@mui/material'
import { ILessonResponse } from 'src/types/apps/dashboardTypes'
import { useAppSelector } from 'src/store'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Theme } from '@mui/material/styles'
import SubLoader from '../loaders/SubLoader'
import DashboardTable from './DashboardTable'
import EmptyContent from 'src/@core/components/empty-content'

export default function Calendar() {
  const { dashboardLessons, isUpdatingDashboard, workTime, formParams } = useAppSelector(state => state.groups)
  const { companyInfo } = useAppSelector(state => state.user)

  const { t } = useTranslation()
  const { push } = useRouter()
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        height: '100%',
        padding: '10px',
        gridColumn: '1/4'
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {}),
          maxWidth: '100%'
        }}
      >
        <Box
          sx={{
            padding: '0 15px 15px 15px',
            maxWidth: '100%',
            overflowX: 'auto'
          }}
        >
          <Typography variant='h5'>
            {formParams.day_of_week == `tuesday,thursday,saturday`
              ? t('Juft kunlar')
              : formParams.day_of_week == `monday,wednesday,friday`
              ? t('Toq kunlar')
              : formParams.day_of_week == `tuesday,thursday,saturday,monday,wednesday,friday`
              ? t('Har kun')
              : t('Boshqa')}
          </Typography>
          <table border={0} style={{ width: '100%' }}>
            {isUpdatingDashboard ? (
              <tr>
                <td colSpan={workTime?.length + 1}>
                  <SubLoader />
                </td>
              </tr>
            ) : (
              <tbody>
                <tr>
                  <td style={{ minWidth: '100px', fontSize: '12px' }}>
                    {t('Xonalar')} {' / '}
                    {t('Soat')}
                  </td>
                  <td>
                    <Box sx={{ display: 'flex' }}>
                      {workTime?.map((el: string) => (
                        <Box
                          key={el}
                          sx={{
                            width: '50px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}
                        >
                          {el}
                        </Box>
                      ))}
                    </Box>
                  </td>
                </tr>
                {dashboardLessons.length > 0 ? (
                  dashboardLessons?.map((lesson: ILessonResponse) => (
                    <tr style={{ borderBottom: '1px solid #c3cccc65' }} key={lesson.room_id}>
                      <td style={{ minWidth: '100px', fontSize: '12px' }}>{lesson.room_name}</td>
                      <td>
                        <DashboardTable lesson={lesson} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={workTime.length + 1}>
                      <EmptyContent />
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </Box>
      </Box>
    </CalendarWrapper>
  )
}
