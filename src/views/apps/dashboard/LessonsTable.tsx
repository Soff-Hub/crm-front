import Box from '@mui/material/Box'
import { useAppSelector } from 'src/store'
import generateTimeSlots from 'src/@core/utils/generate-time-slots'
import { hourFormatter } from 'src/@core/utils/hourFormatter'
import getMonthName from 'src/@core/utils/gwt-month-name'
import SubLoader from '../loaders/SubLoader'
import { useRouter } from 'next/router'
import { Typography } from '@mui/material'
import EmptyContent from 'src/@core/components/empty-content'
import { useTranslation } from 'react-i18next'

const LessonsTable = () => {
  const { events = [], workTime = [], isLessonLoading } = useAppSelector(state => state.dashboard)
  const { push } = useRouter()
  const { t } = useTranslation()

  return (
    <Box sx={{ padding: '0 15px 15px 15px', maxWidth: '100%', overflowX: 'auto' }}>
      <table border={0} style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ minWidth: '100px', fontSize: '12px' }}>{t('Xonalar / Soat')}</td>
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

          {isLessonLoading ? (
            <tr>
              <td colSpan={workTime.length + 1}>
                <SubLoader />
              </td>
            </tr>
          ) : events.length > 0 ? (
            events.map(lesson => (
              <tr style={{ borderBottom: '1px solid #c3cccc65' }} key={lesson.room_id}>
                <td style={{ minWidth: '100px', fontSize: '12px' }}>{lesson.room_name}</td>
                <td>
                  <Box sx={{ display: 'flex', position: 'relative', marginLeft: '25px' }}>
                    {workTime?.map((el: string) => (
                      <Box
                        key={el}
                        sx={{
                          width: '50px',
                          height: '45px',
                          borderLeft: '1px solid #c3cccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      ></Box>
                    ))}

                    {lesson.lessons.map(item => {
                      const timeSlots = generateTimeSlots(item.start_at, item.end_at)
                      const firstSlot = timeSlots[0]
                      const leftIndex = workTime?.findIndex(el => el === firstSlot)
                      const left = leftIndex !== -1 ? leftIndex * 50 : 0

                      return (
                        <Box
                          onClick={() => push(`/groups/view/security?id=${item.id}&month=${getMonthName(null)}`)}
                          key={item.id}
                          sx={{
                            width: `${(timeSlots.length - 1) * 50}px`,
                            height: '45px',
                            position: 'absolute',
                            padding: '5px',
                            left: `${left}px`
                          }}
                        >
                          <Box
                            sx={{
                              boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                              borderRadius: '8px',
                              backgroundColor: item.color,
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              overflow: 'hidden'
                            }}
                          >
                            <Typography sx={{ color: 'black', fontSize: '10px' }}>
                              {hourFormatter(item.start_at)} - {hourFormatter(item.end_at)} / {item.name}
                            </Typography>
                            <Typography sx={{ color: 'black', fontSize: '10px' }}>{item.teacher_name}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
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
      </table>
    </Box>
  )
}

export default LessonsTable
