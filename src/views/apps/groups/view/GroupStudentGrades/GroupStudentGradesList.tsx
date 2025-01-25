import { Box, Button, Chip, ClickAwayListener, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { useEffect, useState } from 'react'
import api from 'src/@core/utils/api'
import getMontName, { getMontNumber } from 'src/@core/utils/gwt-month-name'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  getDays,
  getStudentsGrades,
  setGettingAttendance,
  setGettingGrades,
  updateGradeParams
} from 'src/store/apps/groupDetails'
import { toast } from 'react-hot-toast'
import { useSettings } from 'src/@core/hooks/useSettings'
import SubLoader from 'src/views/apps/loaders/SubLoader'
import dayjs from 'dayjs'

interface Result {
  date: string
  year: string
}

const today = new Date().getDate()

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 180,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))

const Item = ({
  currentDate,
  defaultValue,
  groupId,
  userId,
  date,
  opened_id,
  setOpenedId
}: {
  currentDate: any
  defaultValue: any
  groupId?: any
  userId?: any
  date?: any
  opened_id: any
  setOpenedId: any
}) => {
  const [value, setValue] = useState<number>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const {  query,  } = useRouter()
  const handleGradeClick = async (grade: number) => {
    // if (grade < 1 || grade >= 100) {
    //   toast.error('1 dan 100 gacha bo‘lgan sonlarni tanlashingiz mumkin')
    //   return
    // }

    setOpenedId(null)

    if (value !== grade) {
      setValue(grade)
      const data = {
        group_student: userId,
        date: date,
        score: grade || 0
      }

      try {
        await api.post(`common/group-student/rating/create/`, data)
        // await dispatch(getStudentsGrades({ id: query?.id, queryString: '' }))

      } catch (e: any) {
        toast.error(e.response?.data.msg || 'Bahoni saqlab bo‘lmadi, qayta urinib ko‘ring')
        setValue(defaultValue)
      }
    }

    setOpen(false)
  }

  useEffect(() => {
    if (`${userId}-${date}` === opened_id) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [opened_id])

  console.log(value)

  return (
    <Box sx={{ position: 'relative' }}>
      {value != null ? (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              variant='outlined'
              value={value}
              onChange={(e:any) => handleGradeClick(e.target.value)}
              onClick={() => setOpen(true)}
              size='small'
              // inputProps={{ readOnly: true }}
              sx={{
                width: '50px',
                display: 'flex',
                justifyContent:'center',
                textAlign: 'center',
                cursor: 'pointer',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  borderColor: '#ccc'
                }
              }}
            />
            {/* {open && (
              <Tooltip
                open
                title={
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {[1, 2, 3, 4, 5].map(grade => (
                      <Typography
                        key={grade}
                        variant='body2'
                        onClick={() => handleGradeClick(grade)}
                        sx={{
                          textAlign: 'center',
                          color: 'white',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: 'gray'
                          }
                        }}
                      >
                        {grade}
                      </Typography>
                    ))}
                  </Box>
                }
                arrow
                placement='bottom'
              >
                <span />
              </Tooltip>
            )} */}
          </Box>
        </ClickAwayListener>
      ) : (
        <Tooltip title="Yopiq baho (o'zgartirib bo'lmaydi)" arrow>
          <span>
            <IconifyIcon icon={'material-symbols:lock-outline'} fontSize={18} color='#9e9e9e' />
          </span>
        </Tooltip>
      )}
    </Box>
  )
}
const GroupStudentGrades = () => {
  const { gradeQueryParams, isGettingGrades, grades, isGettingDays, days, groupData, month_list } = useAppSelector(
    state => state.groupDetails
  )
  const dispatch = useAppDispatch()

  const start_date: any = groupData?.start_date ? Number(groupData?.start_date.split('-')[1]) : ''

  const { pathname, query, push } = useRouter()
  const { settings } = useSettings()
  const [opened_id, setOpenedId] = useState<any>(null)
  const [openTooltip, setOpenTooltip] = useState<null | string>(null)
  const [topic, setTopic] = useState<any>('')
  const { t } = useTranslation()

  const months: string[] = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']

  const generateDates = (startMonth: any, numMonths: number): Result[] => {
    const results: Result[] = []
    let currentMonthIndex = months.findIndex(month => month === startMonth)
    let currentYear = Number(groupData?.start_date?.split('-')[0])

    for (let i = 0; i < numMonths; i++) {
      const month = months[currentMonthIndex]
      results.push({ date: month, year: currentYear.toString() })

      currentMonthIndex++
      if (currentMonthIndex === months.length) {
        currentMonthIndex = 0
        currentYear++
      }
    }

    return results
  }

  const handleClick = async (date: any) => {
    const value: {
      month: string
      year: string
    } = {
      month: date.date.split('-')[1],
      year: date.date.split('-')[0]
    }
    const currentDate = new Date()
    const currentDay = currentDate.getDate()
    const queryString = new URLSearchParams(gradeQueryParams).toString()
    await dispatch(getDays({ date: `${value.year}-${value.month}`, group: query?.id }))
    await dispatch(getStudentsGrades({ id: query?.id, queryString: `date=${value.year}-${value.month}-1` }))

    push({
      pathname,
      query: { ...query, month: getMontName(Number(value.month)), year: value.year, id: query?.id }
    })
  }

  const handleTopicSubmit = async (hour: any) => {
    try {
      const response = await api.post('common/topic/create/', { topic, group: query?.id, date: hour.date })
      if (response.status == 201) {
        setOpenTooltip(null)
        if (query.month) {
          await dispatch(
            getDays({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
              group: query?.id
            })
          )
        } else {
          toast.error(`Saqlangan ma'lumotni bolmadi`, {
            duration: 2000
          })
        }
      } else {
        toast.error('Saqlab bolmadi', {
          duration: 2000
        })
      }
    } catch (err) {
      console.log(err)
      toast.error('Saqlab bolmadi', {
        duration: 2000
      })
    }
  }

  useEffect(() => {
    const currentDate = dayjs().format('YYYY-MM-DD')
    dispatch(getStudentsGrades({ id: query.id, queryString: `date=${currentDate}` }))
  }, [])

  return isGettingGrades ? (
    <SubLoader />
  ) : (
    <Box className='demo-space-y'>
      <ul
        className='hide-scrollbar'
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: '15px',
          marginBottom: 12,
          overflow: 'auto'
        }}
      >
        {month_list.map(item => (
          <li
            key={item.date}
            onClick={() => handleClick(item)}
            style={{
              borderBottom:
                query?.month === getMontName(Number(item.date.split('-')[1]))
                  ? '2px solid #c3cccc'
                  : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            {item.month}
          </li>
        ))}
      </ul>
      <Box sx={{ display: 'flex', width: '100%', paddingBottom: 3, maxWidth: '100%', overflowX: 'auto' }}>
        <Box>
          <table>
            <thead>
              <tr style={{ borderBottom: '1px solid #c3cccc' }}>
                <td
                  style={{
                    position: 'sticky',
                    left: 0,
                    background: settings.mode == 'dark' ? '#282A42' : '#ffffff', // Dark mode background
                    color: settings.mode == 'dark' ? '#f0f0f0' : '#000000', // Dark mode text color
                    zIndex: 1,
                    padding: '8px 20px',
                    textAlign: 'start',
                    fontSize: '14px',
                    borderRight: `1px solid ${settings.mode == 'dark' ? '#444' : '#c3cccc'}` // Dark mode border color
                  }}
                >
                  <Typography>{t("O'quvchilar")}</Typography>
                </td>
                {grades &&
                  days?.map((hour: any) => (
                    <th
                      key={hour.date}
                      style={{ textAlign: 'center', width: '60px', padding: '8px 0', cursor: 'pointer' }}
                    >
                      <Typography>{`${hour.date.split('-')[2]}`}</Typography>
                    </th>
                  ))}
              </tr>
            </thead>
            {grades?.result.length > 0 ? (
              <tbody>
                {grades &&
                  grades.result.map((student: any) => (
                    <tr key={student.id} style={{}}>
                      <td
                        style={{
                          position: 'sticky',
                          left: 0,
                          background: settings.mode == 'dark' ? '#282A42' : '#ffffff', // Dark mode background
                          zIndex: 1,
                          padding: '8px 20px',
                          textAlign: 'start',
                          fontSize: '14px',
                          borderRight: `1px solid ${settings.mode == 'dark' ? '#444' : '#c3cccc'}` // Dark mode border color
                        }}
                      >
                        <Box display='flex' alignItems='center' justifyContent={'space-between'} gap={3}>
                          <Typography>{student.first_name}</Typography>
                          <Chip
                            color='error'
                            size='small'
                            sx={{
                              color: Number(student?.gpa) >= 4 ? 'green' : Number(student?.gpa) >= 3 ? 'orange' : 'red',
                              borderColor: Number(student?.gpa) >= 4 ? 'green' : Number(student?.gpa) >= 3 ? 'orange' : 'red'
                            }}
                            variant='outlined'
                            label={student?.gpa}
                          />
                        </Box>
                      </td>
                      {days?.map((hour: any) => {
                        const currentDate = student.ratings?.find((el: any) => el.date === hour.date)
                        const matchedRating = student?.ratings?.find(
                          (el: any) => el.date === hour.date && !hour.weekend?.date
                        )

                        return student?.ratings?.some((el: any) => el.date === hour.date) &&
                          student?.ratings?.find((el: any) => el.date === hour.date && !hour.weekend?.date) ? (
                          <td
                            key={student.ratings.find((el: any) => el.date === hour.date).date}
                            style={{ padding: '8px 10px', textAlign: 'center', cursor: 'pointer' }}
                          >
                            {matchedRating.score != null ? (
                              <Item
                                currentDate={currentDate}
                                opened_id={opened_id}
                                setOpenedId={setOpenedId}
                                defaultValue={matchedRating?.score}
                                groupId={query?.id}
                                userId={student.id}
                                date={hour.date}
                              />
                            ) : (
                              <Item
                                currentDate={currentDate}
                                opened_id={opened_id}
                                setOpenedId={setOpenedId}
                                defaultValue={"-"}
                                groupId={query?.id}
                                userId={student.id}
                                date={hour.date}
                              />
                            )}
                          </td>
                        ) : hour.weekend?.date ? (
                          <td
                            key={hour.date}
                            style={{
                              padding: '10px 8px',
                              textAlign: 'center',
                              cursor: 'default',
                              backgroundColor: '#ffe4e6', // Light red
                              color: '#c53030', // Dark red
                              borderRadius: '4px',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                              fontSize: '14px',
                              fontWeight: '500',
                              position: 'relative' // For tooltip positioning
                            }}
                          >
                            <Tooltip title={hour.weekend?.description || ''} arrow placement='top'>
                              <span
                                style={{
                                  display: 'inline-block',
                                  maxWidth: '100px', // Limit the text width
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap', // Prevent line breaks
                                  cursor: 'pointer'
                                }}
                              >
                                {hour.weekend?.description}
                              </span>
                            </Tooltip>
                          </td>
                        ) : (
                          <td key={hour.date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'not-allowed' }}>
                            <span>
                              <Item
                                currentDate={currentDate}
                                opened_id={opened_id}
                                setOpenedId={setOpenedId}
                                defaultValue={null}
                              />
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tr>
                <td colSpan={14}>
                  <EmptyContent />
                </td>
              </tr>
            )}
          </table>
          {!isGettingGrades && (
            <Box sx={{ width: '100%', display: 'flex', pt: '10px' }}>
              <Button
                startIcon={
                  <IconifyIcon
                    style={{ fontSize: '12px' }}
                    icon={`icon-park-outline:to-${gradeQueryParams.status === 'archive' ? 'top' : 'bottom'}`}
                  />
                }
                sx={{ fontSize: '10px', marginLeft: 'auto' }}
                size='small'
                color={gradeQueryParams.status === 'archive' ? 'primary' : 'error'}
                variant='text'
                onClick={() => {
                  if (gradeQueryParams?.status === 'archive') {
                    dispatch(updateGradeParams({ status: 'active,new' }))
                  } else dispatch(updateGradeParams({ status: 'archive' }))
                }}
              >
                {gradeQueryParams.status === 'archive' ? t('Arxivni yopish') : t("Arxivdagi o'quvchilarni ko'rish")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default GroupStudentGrades
