import { Box, Button, ClickAwayListener, IconButton, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import IconifyIcon from "src/@core/components/icon";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useEffect, useState } from "react";
import api from "src/@core/utils/api";
import getMontName, { getMontNumber } from "src/@core/utils/gwt-month-name";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import EmptyContent from "src/@core/components/empty-content";
import SubLoader from "../../loaders/SubLoader";
import { useAppDispatch, useAppSelector } from "src/store";
import { getAttendance, getDays, setGettingAttendance, updateParams } from "src/store/apps/groupDetails";
import { toast } from "react-hot-toast";


interface Result {
  date: string;
  year: string;
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
    border: '1px solid #dadde9',
  },
}));


const Item = ({ defaultValue, reasonText, groupId, userId, date, opened_id, setOpenedId }: { defaultValue: "true" | "false" | "null" | "with_reason" | 0, groupId?: any, userId?: any, reasonText?: null | string, date?: any, opened_id: any, setOpenedId: any }) => {
  const [value, setValue] = useState<"true" | "false" | "null" | "with_reason" | 0>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)
  const [reason, setReasonValue] = useState("")
  const [reasonTooltip, setReasonTooltip] = useState(false)
  const { t } = useTranslation()

  const handleClick = async (status: "true" | "false" | "null" | "with_reason" | 0, reason?: string) => {
    setOpenedId(null)
    setReasonTooltip(false)
    if (value !== status) {
      setValue(status)
      const data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: String(status),
        reason: reason || null
      }
      try {
        const response = await api.post('common/student-attendance/', data)
      } catch (e: any) {
        toast.error(e.response.data.msg[0])
        setValue(defaultValue)
      }
    }
  }

  useEffect(() => {
    if (`${userId}-${date}` === opened_id) setOpen(true)
    else setOpen(false)
    // return () => setOpenedId(null)
  }, [opened_id])

  if (value === "true" || value === "false" || value === "null" || value === "with_reason") {
    return (
      <Box sx={{ position: 'relative' }} >
        {
          <ClickAwayListener onClickAway={() => (setOpenedId(null), setOpen(false))}>
            <Tooltip onClick={(e) => (e.stopPropagation(), setOpenedId(`${userId}-${date}`))} disableFocusListener disableHoverListener disableTouchListener arrow open={open}
              title={<Box onClick={(e) => e.stopPropagation()} style={{ display: 'flex', zIndex: 99, alignItems: 'center', justifyContent: 'space-evenly', gap: '4px', minWidth: '100px', height: '30px', }}>
                <HtmlTooltip
                  PopperProps={{
                    disablePortal: false,
                  }}
                  onClose={() => setReasonTooltip(false)}
                  open={reasonTooltip}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  arrow
                  title={
                    <form
                      style={{
                        width: '100%',
                        padding: '3px',
                      }}
                      onSubmit={async (e) => {
                        await handleClick("with_reason", reason)
                      }}
                    >
                      <TextField rows={3} multiline autoComplete="off" onChange={(e) => setReasonValue(e.target.value)} size="small" placeholder={t("Izoh")} />
                      <Button fullWidth sx={{ mt: 1 }} onClick={async () => await handleClick("with_reason", reason)} size="small" >{t("Saqlash")}</Button>
                    </form>
                  }
                >
                  <Tooltip arrow title={t("Ushbu holatta o'quvchi sababli deb belgilanadi va shu kun uchun bu o'quvchidan to'lov yechilmaydi")}>
                    <IconButton onClick={() => setReasonTooltip(true)}>
                      <IconifyIcon icon={'fluent-emoji-high-contrast:white-exclamation-mark'} fontSize={18} color="#fcd34d" cursor={'pointer'} />
                    </IconButton>
                  </Tooltip>
                </HtmlTooltip>
                <Tooltip arrow title={t("O'quvchi darsga sababsiz kelmadi")}>
                  <IconButton onClick={() => handleClick("false")}>
                    <IconifyIcon icon={'mdi:cancel-bold'} fontSize={18} color="#e31309" cursor={'pointer'} />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title={t("O'quvchi darsga keldi")}>
                  <IconButton onClick={() => handleClick("true")} >
                    <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color="#4be309" cursor={'pointer'} />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow title={t("Bo'sh qoldirish")}>
                  <IconButton onClick={() => handleClick("null")} >
                    <IconifyIcon icon={'material-symbols-light:square-outline'} onClick={() => handleClick("null")} fontSize={18} color="#4be309" cursor={'pointer'} />
                  </IconButton>
                </Tooltip>
              </Box>}>
              <span style={{ zIndex: 0 }}>
                {
                  value === "true" ? (
                    <IconButton>
                      <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color="#4be309" />
                    </IconButton>
                  ) : value === "false" ? (
                    <IconButton>
                      <IconifyIcon icon={'mdi:cancel-bold'} fontSize={18} color="#e31309" />
                    </IconButton>
                  ) : value == "null" ? (
                    <IconButton>
                      <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color="#9e9e9e" />
                    </IconButton>
                  ) : value === "with_reason" ? (
                    <Tooltip arrow title={`Sababli: ${reasonText}`}>
                      <IconButton>
                        <IconifyIcon icon={'fluent-emoji-high-contrast:white-exclamation-mark'} fontSize={18} color="#fcd34d" />
                      </IconButton>
                    </Tooltip>
                  ) : ''
                }
              </span>
            </Tooltip>
          </ClickAwayListener>
        }
      </Box >
    )
  } else {
    return (
      <span>
        <IconifyIcon icon={'material-symbols:lock-outline'} fontSize={18} color="#9e9e9e" />
      </span>
    )
  }
}

const UserViewSecurity = () => {
  const { queryParams, attendance, isGettingDays, isGettingAttendance, days, groupData, month_list } = useAppSelector(state => state.groupDetails)
  const dispatch = useAppDispatch()

  const start_date: any = groupData?.start_date ? Number(groupData?.start_date.split('-')[1]) : ''

  const { pathname, query, push } = useRouter()

  const [opened_id, setOpenedId] = useState<any>(null)
  const [openTooltip, setOpenTooltip] = useState<null | string>(null)
  const [topic, setTopic] = useState<any>('')
  const { t } = useTranslation()

  const months: string[] = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']

  const generateDates = (startMonth: any, numMonths: number): Result[] => {
    const results: Result[] = [];
    let currentMonthIndex = months.findIndex(month => month === startMonth);
    let currentYear = Number(groupData?.start_date?.split('-')[0])

    for (let i = 0; i < numMonths; i++) {
      const month = months[currentMonthIndex];
      results.push({ date: month, year: currentYear.toString() });

      currentMonthIndex++;
      if (currentMonthIndex === months.length) {
        currentMonthIndex = 0;
        currentYear++;
      }
    }

    return results;
  };


  const handleClick = async (date: any) => {
    const value: {
      month: string,
      year: string
    } = {
      month: date.date.split('-')[1],
      year: date.date.split('-')[0]
    }

    dispatch(setGettingAttendance(true))
    const queryString = new URLSearchParams(queryParams).toString()
    await dispatch(getAttendance({ date: `${value.year}-${value.month}`, group: query?.id, queryString: queryString }))
    await dispatch(getDays({ date: `${value.year}-${value.month}`, group: query?.id }))
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
        setOpenTooltip(null)
        if (query.month) {
          await dispatch(getDays({ date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`, group: query?.id }))
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
      console.log(err);
      toast.error('Saqlab bolmadi', {
        duration: 2000
      })
    }
  }

  useEffect(() => {
    (async function () {
      const queryString = new URLSearchParams(queryParams).toString()
      dispatch(setGettingAttendance(true))
      if (query?.month && query?.id) {
        await dispatch(getAttendance({ date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`, group: query?.id, queryString: queryString }))
        await dispatch(getDays({ date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query?.month)}`, group: query?.id }))
      }
      dispatch(setGettingAttendance(false))
    })()
  }, [queryParams.status])

  return (
    isGettingAttendance ? <SubLoader /> :
      <Box className='demo-space-y'>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '15px', marginBottom: 12 }}>
          {
            month_list.map(item => <li key={item.date} onClick={() => handleClick(item)} style={{ borderBottom: query?.month === getMontName(Number(item.date.split('-')[1])) ? '2px solid #c3cccc' : '2px solid transparent', cursor: 'pointer' }}>{item.month}</li>)
          }
        </ul>
        <Box sx={{ display: 'flex', width: '100%', paddingBottom: 3, maxWidth: '100%', overflowX: 'auto' }}>
          <Box>
            <table>
              <thead>
                <tr style={{ borderBottom: '1px solid #c3cccc' }}>
                  <td style={{ padding: '8px 0', textAlign: 'start', minWidth: '150px' }}><Typography>{t('Mavzular')}</Typography></td>
                  {
                    attendance && days?.map((hour: any) => <td key={hour.date} style={{ textAlign: 'center', width: '60px', padding: '8px 0', cursor: 'pointer', backgroundColor: hour.exam ? '#96f3a5' : hour.lesson ? '#a7c0fb' : 'transparent' }}>
                      <div>
                        {
                          hour.exam ? (
                            <HtmlTooltip
                              PopperProps={{
                                disablePortal: true,
                              }}
                              onClose={() => setOpenTooltip(null)}
                              open={openTooltip === hour.date}
                              disableFocusListener
                              disableHoverListener
                              disableTouchListener
                              arrow
                              title={
                                <div>
                                  <p style={{ margin: '0', marginBottom: '4px', }}>{hour.exam.title}</p>
                                  <p style={{ margin: '0', marginBottom: '4px' }}>Ball: {hour.exam.min_score} / {hour.exam.max_score}</p>
                                </div>
                              }
                            >
                              <Box sx={{ padding: "5px", width: "60px", overflow: "hidden", textOverflow: "ellipsis", textWrap: "nowrap" }} onClick={() => setOpenTooltip((c) => c === hour.date ? null : hour.date)} >
                                {hour.exam?.title}
                              </Box>
                            </HtmlTooltip>
                          ) : hour.lesson ? (
                            <HtmlTooltip
                              PopperProps={{
                                disablePortal: true,
                              }}
                              onClose={() => setOpenTooltip(null)}
                              open={openTooltip === hour.date}
                              disableFocusListener
                              disableHoverListener
                              disableTouchListener
                              arrow
                              title={
                                <div>
                                  <p style={{ margin: '0', marginBottom: '4px' }}>{hour.lesson.topic}</p>
                                </div>
                              }
                            >
                              <Box sx={{ padding: "5px", width: "60px", overflow: "hidden", textOverflow: "ellipsis", textWrap: "nowrap" }} onClick={() => setOpenTooltip((c) => c === hour.date ? null : hour.date)} >
                                {hour.lesson.topic}
                              </Box>
                            </HtmlTooltip>
                          ) : (
                            <HtmlTooltip
                              PopperProps={{
                                disablePortal: true,
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
                                  onSubmit={async (e) => {
                                    e.preventDefault()
                                    handleTopicSubmit(hour)
                                  }}
                                >
                                  <TextField autoComplete="off" onChange={(e) => setTopic(e.target.value)} size="small" placeholder="Mavzu.." />
                                  <Button type="submit">{t("Saqlash")}</Button>
                                </form>
                              }
                            >
                              <span style={{ padding: "15px", minWidth: "60px", overflow: "hidden", textOverflow: "ellipsis", textWrap: "nowrap" }} onClick={() => setOpenTooltip((c) => c === hour.date ? null : hour.date)} >
                                <IconifyIcon icon={'iconamoon:file-add-light'} />
                              </span>
                            </HtmlTooltip>
                          )
                        }
                      </div>
                    </td>)
                  }
                </tr>
                <tr style={{ borderBottom: '1px solid #c3cccc' }}>
                  <td style={{ padding: '8px 0', textAlign: 'start', borderRight: '1px solid #c3cccc', maxWidth: '100px', minWidth: "60px" }}><Typography>{t("O'quvchilar")}</Typography></td>
                  {
                    attendance && days?.map((hour: any) => <th key={hour.date} style={{ textAlign: 'center', width: '60px', padding: '8px 0', cursor: 'pointer' }}><Typography>{`${hour.date.split('-')[2]}`}</Typography></th>)
                  }
                </tr>
              </thead>
              {attendance?.students.length > 0 ?
                <tbody>
                  {attendance && attendance.students.map((student: any) => (
                    <tr key={student.id} style={{}}>
                      <td style={{ padding: '8px 0', textAlign: 'start', fontSize: '14px', borderRight: '1px solid #c3cccc' }}>{student.first_name}</td>
                      {
                        days?.map((hour: any) => (
                          student.attendance.some((el: any) => el.date === hour.date) && student.attendance.find((el: any) => el.date === hour.date) ? (
                            <td key={student.attendance.find((el: any) => el.date === hour.date).date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'pointer' }}>
                              {
                                student.attendance.find((el: any) => el.date === hour.date).is_available === "true" ? (
                                  <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={"true"} groupId={query?.id} userId={student.id} date={hour.date} />
                                ) :
                                  student.attendance.find((el: any) => el.date === hour.date).is_available === "false" ? (
                                    <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={"false"} groupId={query?.id} userId={student.id} date={hour.date} />
                                  ) :
                                    student.attendance.find((el: any) => el.date === hour.date).is_available === "with_reason" ? (
                                      <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={"with_reason"} reasonText={student.attendance.find((el: any) => el.date === hour.date).reason} groupId={query?.id} userId={student.id} date={hour.date} />
                                    ) :
                                      student.attendance.find((el: any) => el.date === hour.date).is_available === "null" ? (
                                        <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={"null"} groupId={query?.id} userId={student.id} date={hour.date} />
                                      ) : <></>
                              }
                            </td>
                          ) : <td key={hour.date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'not-allowed' }}>
                            <span>
                              <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={0} />
                            </span>
                          </td>
                        )
                        )
                      }
                    </tr>
                  ))}
                </tbody> : <tr>
                  <td colSpan={14}>
                    <EmptyContent />
                  </td>
                </tr>
              }
            </table>
            {!isGettingAttendance && <Box sx={{ width: '100%', display: 'flex', pt: '10px' }}>
              <Button
                startIcon={<IconifyIcon style={{ fontSize: '12px' }} icon={`icon-park-outline:to-${queryParams.status === 'archive' ? 'top' : 'bottom'}`} />}
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
                {
                  queryParams.status === 'archive' ? t("Arxivni yopish") : t("Arxivdagi o'quvchilarni ko'rish")
                }

              </Button>
            </Box>}
          </Box>
        </Box>
      </Box >
  )
}

export default UserViewSecurity
