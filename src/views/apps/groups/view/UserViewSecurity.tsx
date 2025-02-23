import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import IconifyIcon from 'src/@core/components/icon'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { useEffect, useMemo, useState } from 'react'
import api from 'src/@core/utils/api'
import getMontName, { getMontNumber } from 'src/@core/utils/gwt-month-name'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import EmptyContent from 'src/@core/components/empty-content'
import SubLoader from '../../loaders/SubLoader'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getAttendance, getDays, setGettingAttendance, updateParams } from 'src/store/apps/groupDetails'
import { toast } from 'react-hot-toast'
import { useSettings } from 'src/@core/hooks/useSettings'
import { DatePicker } from 'rsuite'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { setLoading } from 'src/store/apps/leads'
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'

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
  defaultValue: true | false | null | 0
  groupId?: any
  userId?: any
  date?: any
  opened_id: any
  setOpenedId: any
}) => {
  const [value, setValue] = useState<true | false | null | 0>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)
  const [description, setDescription] = useState<true | false | null | 0>(0)
  const [openTooltip, setOpenTooltip] = useState(false)
  const [descriptionText, setDescriptionText] = useState('')

  const handleSubmit = async (values: { description: string }) => {
    let data = {}
    if (values.description == '') {
      data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: description
      }
    } else {
      data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: description,
        description: values.description
      }
    }
    try {
      const response = await api.patch(`common/attendance/update/${currentDate?.id}/`, data)
      console.log(response)
      if (response.data.description) {
        setDescriptionText(response.data.description)
      }
      onClose()
    } catch (e: any) {
      console.log(e)

      toast.error(e.response?.data.msg?.[0] || "Saqlab bo'lmadi qayta urinib ko'ring")
      setValue(defaultValue)
    }
  }

  function onClose() {
    setDescription(0)
  }

  const handleClick = async (status: any) => {
    setOpenedId(null)
    if (value !== status) {
      setValue(status)
      setDescription(status)
      const data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: status
      }
      try {
        const response = await api.patch(`common/attendance/update/${currentDate?.id}/`, data)
      } catch (e: any) {
        toast.error(e.response?.data.msg?.[0] || "Saqlab bo'lmadi qayta urinib ko'ring")
        setValue(defaultValue)
      }
    }
  }

  useEffect(() => {
    if (`${userId}-${date}` === opened_id) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [opened_id])

  if (value === true || value === false || value === null) {
    return (
      <Box sx={{ position: 'relative' }}>
        {open && (
          <Box
            onBlur={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              gap: '4px',
              position: 'absolute',
              width: '80px',
              height: '30px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <IconifyIcon
              icon={'mdi:cancel-bold'}
              onClick={() => handleClick(false)}
              fontSize={18}
              color='#e31309'
              cursor={'pointer'}
            />
            <IconifyIcon
              icon={'game-icons:check-mark'}
              onClick={() => handleClick(true)}
              fontSize={18}
              color='#4be309'
              cursor={'pointer'}
            />
            <IconifyIcon
              icon={'material-symbols-light:square-outline'}
              onClick={() => handleClick(null)}
              fontSize={18}
              color='#4be309'
              cursor={'pointer'}
            />
          </Box>
        )}
        {!open && (
          <span>
            {value === true ? (
              <span onClick={() => setOpenedId(`${userId}-${date}`)}>
                <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color='#4be309' />
              </span>
            ) : value === false ? (
              <span onClick={() => setOpenTooltip(true)} onDoubleClick={() => setOpenedId(`${userId}-${date}`)}>
                {descriptionText || currentDate.description ? (
                  <Tooltip
                    open={openTooltip}
                    onClose={() => setOpenTooltip(false)}
                    title={descriptionText || currentDate.description}
                  >
                    <Typography fontSize={13}>
                      {' '}
                      <IconifyIcon icon='mdi:cancel-bold' fontSize={18} color='#e31309' />
                    </Typography>
                  </Tooltip>
                ) : (
                  <IconifyIcon icon='mdi:cancel-bold' fontSize={18} color='#e31309' />
                )}
              </span>
            ) : value === null ? (
              <span onClick={() => setOpenedId(`${userId}-${date}`)}>
                <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color='#9e9e9e' />
              </span>
            ) : (
              ''
            )}
          </span>
        )}

        <Dialog maxWidth={'sm'} fullWidth open={description === false} onClose={onClose}>
          <DialogTitle>Izoh yozish</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={{ description: '' }}
              validationSchema={Yup.object({
                description: Yup.string().nullable()
              })}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, values }) => (
                <Form>
                  <FormControl sx={{ marginTop: 2, width: '100%' }}>
                    <Field
                      as={TextField}
                      label='Izoh'
                      placeholder='Izoh kiriting'
                      name='description'
                      fullWidth
                      variant='outlined'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      error={!!values.description && !values.description.trim()}
                      helperText={<ErrorMessage name='description' />}
                    />
                  </FormControl>
                  <DialogActions>
                    <Button fullWidth type='submit' variant='contained' color='primary'>
                      Saqlash
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </Box>
    )
  } else {
    return (
      <span>
        <IconifyIcon icon={'material-symbols:lock-outline'} fontSize={18} color='#9e9e9e' />
      </span>
    )
  }
}

const UserViewSecurity = () => {
  const { queryParams, attendance, isGettingDays, isGettingAttendance, days, groupData, month_list } = useAppSelector(
    state => state.groupDetails
  )
  const dispatch = useAppDispatch()

  const start_date: any = groupData?.start_date ? Number(groupData?.start_date.split('-')[1]) : ''
  const [chandeDateLoader, setChangeDateLoader] = useState(false)
  const [chandeTopicLoader, setChangeTopicLoader] = useState(false)

  const [selectedOldDate, setSelectedOldDate] = useState(null)
  const [selectedNewDate, setSelectedNewDate] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const { pathname, query, push } = useRouter()
  const { settings } = useSettings()
  const [opened_id, setOpenedId] = useState<any>(null)
  const [openTooltip, setOpenTooltip] = useState<null | string>(null)
  const [topic, setTopic] = useState<any>('')
  const [updateTopic, setUpdateTopic] = useState(false)
  const [topicId, setTopicId] = useState<number | null>(null)
  const { t } = useTranslation()

  const handleDateChange = async () => {
    setChangeDateLoader(true)
    await api
      .post(`common/group/lesson/transfer/`, {
        group: query.id,
        old_date: selectedOldDate,
        new_date: dayjs(selectedNewDate).format('YYYY-MM-DD')
      })
      .then(res => {
        toast.success("Dars kuni o'zgartirildi")
        setSelectedNewDate(null)
        setSelectedOldDate(null)
        setOpenDialog(false)
        const queryString = new URLSearchParams(queryParams).toString()
        dispatch(
          getAttendance({
            date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
            group: query?.id,
            queryString: queryString
          })
        )
        dispatch(
          getDays({
            date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
            group: query?.id
          })
        )
      })
      .catch(err => {
        console.log(err)
        toast.error(t(err.response.data.new_date) || 'Xatolik', { style: { zIndex: 99999 } })
      })
    setChangeDateLoader(false)
    // setOpenDialog(false)
  }

  const formik = useFormik({
    initialValues: {
      newTopic: topic || ''
    },
    validationSchema: Yup.object({
      newTopic: Yup.string().required('Dars nomi majburiy.')
    }),
    onSubmit: () => {
      handleTopicChange()
      setUpdateTopic(false)
    }
  })

  useEffect(() => {
    formik.setFieldValue('newTopic', topic)
  }, [topic])

  const handleTopicChange = async () => {
    setChangeTopicLoader(true)
    await api
      .patch(`common/topic/update/${topicId}`, {
        topic: formik.values.newTopic
      })
      .then(res => {
        toast.success("Dars nomi o'zgartirildi")
        formik.resetForm()
        setUpdateTopic(false)
        const queryString = new URLSearchParams(queryParams).toString()
        dispatch(
          getAttendance({
            date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
            group: query?.id,
            queryString: queryString
          })
        )
        dispatch(
          getDays({
            date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`,
            group: query?.id
          })
        )
      })
      .catch(err => {
        console.log(err)
        toast.error('Xatolik')
      })
    setChangeTopicLoader(false)
    // setOpenDialog(false)
  }

  const handleDayClick = (day: any) => {
    console.log(day)

    setSelectedOldDate(day)
    setOpenDialog(true)
  }

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

    dispatch(setGettingAttendance(true))
    const queryString = new URLSearchParams(queryParams).toString()
    await dispatch(getDays({ date: `${value.year}-${value.month}`, group: query?.id }))
    await dispatch(getAttendance({ date: `${value.year}-${value.month}`, group: query?.id, queryString: queryString }))
    dispatch(setGettingAttendance(false))

    push({
      pathname,
      query: { ...query, month: getMontName(Number(value.month)), year: value.year, id: query?.id }
    })
  }

  const handleTopicSubmit = async (hour: any) => {
    try {
      const response = await api.post('common/topic/create/', { topic, group: query?.id, date: hour.date })
      if (response.status == 201) {
        setTopic(null)
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

const queryString = useMemo(() => {
  return new URLSearchParams(queryParams).toString();
}, [queryParams]);

const attendanceDate = useMemo(() => {
  const year = query?.year || new Date().getFullYear();
  const monthNumber = getMontNumber(query?.month);
  return `${year}-${monthNumber}`;
}, [query?.year, query?.month]);

useEffect(() => {
  const fetchAttendance = async () => {
    dispatch(setGettingAttendance(true));
    if (query?.month && query?.id) {
      await dispatch(getAttendance({ date: attendanceDate, group: query?.id, queryString }));
      await dispatch(getDays({ date: attendanceDate, group: query?.id }));
    }
    dispatch(setGettingAttendance(false));
  };

  fetchAttendance();
}, [queryParams.status, attendanceDate, queryString]);


  return isGettingAttendance ? (
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
                  <Typography>{t('Mavzular')}</Typography>
                </td>
                {attendance &&
                  days?.map((hour: any) => (
                    <td
                      key={hour.date}
                      style={{
                        textAlign: 'center',
                        width: '60px',
                        padding: '8px 0',
                        cursor: 'pointer',
                        backgroundColor: hour.exam ? '#96f3a5' : hour.lesson ? '#a7c0fb' : 'transparent'
                      }}
                    >
                      <div>
                        {hour.exam ? (
                          <HtmlTooltip
                            PopperProps={{
                              disablePortal: true
                            }}
                            onClose={() => setOpenTooltip(null)}
                            open={openTooltip === hour.date}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            arrow
                            title={
                              <div>
                                <p style={{ margin: '0', marginBottom: '4px' }}>{hour.exam.title}</p>
                                <p style={{ margin: '0', marginBottom: '4px' }}>
                                  Ball: {hour.exam.min_score} / {hour.exam.max_score}
                                </p>
                              </div>
                            }
                          >
                            <Box
                              sx={{
                                padding: '5px',
                                width: '60px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textWrap: 'nowrap'
                              }}
                              onClick={() => setOpenTooltip(c => (c === hour.date ? null : hour.date))}
                            >
                              {hour.exam?.title}
                            </Box>
                          </HtmlTooltip>
                        ) : hour.lesson ? (
                          <HtmlTooltip
                            PopperProps={{
                              disablePortal: true
                            }}
                            onClose={() => setOpenTooltip(null)}
                            open={openTooltip === hour.date}
                            arrow
                            title={
                              <div>
                                <p style={{ margin: '0', marginBottom: '4px' }}>{hour.lesson.topic}</p>
                              </div>
                            }
                          >
                            <Box
                              sx={{
                                padding: '5px',
                                width: '60px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',

                                cursor: 'pointer'
                              }}
                              onMouseEnter={() => setOpenTooltip(hour.date)}
                              onMouseLeave={() => setOpenTooltip(null)}
                            >
                              <span
                                onClick={() => {
                                  setUpdateTopic(true), setTopicId(hour.lesson.id), setTopic(hour.lesson.topic)
                                }}
                              >
                                {hour.lesson.topic}
                              </span>
                            </Box>
                          </HtmlTooltip>
                        ) : (
                          <HtmlTooltip
                            PopperProps={{
                              disablePortal: true
                            }}
                            onClose={() => setOpenTooltip(null)}
                            open={openTooltip === hour.date}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            arrow
                            title={
                              <form
                                style={{
                                  display: 'flex',
                                  alignItems: 'stretch',
                                  width: '100%',
                                  padding: '5px',
                                  flexDirection: 'column',
                                  gap: '3px'
                                }}
                                onSubmit={async e => {
                                  e.preventDefault()
                                  handleTopicSubmit(hour)
                                }}
                              >
                                <TextField
                                  autoComplete='off'
                                  onChange={e => setTopic(e.target.value)}
                                  size='small'
                                  placeholder='Mavzu..'
                                />
                                <Button type='submit'>{t('Saqlash')}</Button>
                              </form>
                            }
                          >
                            <span
                              style={{
                                padding: '15px',
                                minWidth: '60px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textWrap: 'nowrap'
                              }}
                              onClick={() => setOpenTooltip(c => (c === hour.date ? null : hour.date))}
                            >
                              <IconifyIcon icon={'iconamoon:file-add-light'} />
                            </span>
                          </HtmlTooltip>
                        )}
                      </div>
                    </td>
                  ))}
              </tr>
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
                {attendance &&
                  days?.map((hour: any) => (
                    <th
                      key={hour.date}
                      style={{ textAlign: 'center', width: '60px', padding: '8px 0', cursor: 'pointer' }}
                      onClick={() => handleDayClick(hour.date)} // Open dialog on click
                    >
                      <Typography>{`${hour.date.split('-')[2]}`}</Typography>
                    </th>
                  ))}
              </tr>
            </thead>
            {attendance?.students?.length > 0 ? (
              <tbody>
                {attendance &&
                  attendance.students.map((student: any) => (
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
                        {student.first_name}
                      </td>
                      {days?.map((hour: any) => {
                        const currentDate = student.attendance.find((el: any) => el.date === hour.date)
                        return student.attendance.some((el: any) => el.date === hour.date) &&
                          student.attendance.find((el: any) => el.date === hour.date && !hour.weekend?.date) ? (
                          <td
                            key={student.attendance.find((el: any) => el.date === hour.date).date}
                            style={{ padding: '8px 0', textAlign: 'center', cursor: 'pointer' }}
                          >
                            {student.attendance.find((el: any) => el.date === hour.date).is_available === true ? (
                              <Item
                                currentDate={currentDate}
                                opened_id={opened_id}
                                setOpenedId={setOpenedId}
                                defaultValue={true}
                                groupId={query?.id}
                                userId={student.id}
                                date={hour.date}
                              />
                            ) : student.attendance.find((el: any) => el.date === hour.date).is_available === false ? (
                              <Item
                                currentDate={currentDate}
                                opened_id={opened_id}
                                setOpenedId={setOpenedId}
                                defaultValue={false}
                                groupId={query?.id}
                                userId={student.id}
                                date={hour.date}
                              />
                            ) : student.attendance.find((el: any) => el.date === hour.date).is_available === null ? (
                              <Item
                                currentDate={currentDate}
                                opened_id={opened_id}
                                setOpenedId={setOpenedId}
                                defaultValue={null}
                                groupId={query?.id}
                                userId={student.id}
                                date={hour.date}
                              />
                            ) : (
                              <></>
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
                                defaultValue={0}
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
          {!isGettingAttendance && (
            <Box sx={{ width: '100%', display: 'flex', pt: '10px' }}>
              <Button
                startIcon={
                  <IconifyIcon
                    style={{ fontSize: '12px' }}
                    icon={`icon-park-outline:to-${queryParams.status === 'archive' ? 'top' : 'bottom'}`}
                  />
                }
                sx={{ fontSize: '10px', marginLeft: 'auto' }}
                size='small'
                color={queryParams.status === 'archive' ? 'primary' : 'error'}
                variant='text'
                onClick={() => {
                  if (queryParams?.status === 'archive') {
                    dispatch(updateParams({ status: 'active,new' }))
                  } else dispatch(updateParams({ status: 'archive' }))
                }}
              >
                {queryParams.status === 'archive' ? t('Arxivni yopish') : t("Arxivdagi o'quvchilarni ko'rish")}
              </Button>
            </Box>
          )}
        </Box>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            <Typography>Kunni tanlang</Typography>
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                }}
                value={
                  selectedNewDate
                    ? dayjs(selectedNewDate).toDate()
                    : selectedOldDate
                    ? dayjs(selectedOldDate).toDate()
                    : null
                }
                onChange={(day: any) => setSelectedNewDate(day)}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                setOpenDialog(false), setSelectedOldDate(null), setSelectedNewDate(null)
              }}
            >
              Bekor qilish
            </Button>
            <Button disabled={chandeDateLoader} variant='outlined' onClick={handleDateChange}>
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={updateTopic} onClose={() => setUpdateTopic(false)}>
          <DialogTitle>
            <Typography>Dars o'zgartirish</Typography>
          </DialogTitle>
          <DialogContent>
            <FormControl>
              <TextField
                name='newTopic'
                onChange={formik.handleChange}
                size='small'
                value={formik.values.newTopic}
                fullWidth
                onBlur={formik.handleBlur}
                error={!!formik.errors.newTopic && !!formik.touched.newTopic}
                title='dars nomi'
              />
              <FormHelperText error={!!formik.errors.newTopic && !!formik.touched.newTopic}>
                {!!formik.errors.newTopic && !!formik.touched.newTopic && Boolean(formik.errors.newTopic)}
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              size='small'
              variant='outlined'
              color='error'
              onClick={() => {
                formik.resetForm(), setUpdateTopic(false), setTopic(null)
              }}
            >
              Bekor qilish
            </Button>
            <Button size='small' disabled={chandeTopicLoader} variant='outlined' onClick={handleTopicChange}>
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default UserViewSecurity
