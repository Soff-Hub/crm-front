import { Box, CircularProgress, Typography } from "@mui/material"
import { useRouter } from "next/router"
import IconifyIcon from "src/@core/components/icon"
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useContext, useEffect, useState } from "react";
import api from "src/@core/utils/api";
import getMontName, { getMontNumber } from "src/@core/utils/gwt-month-name";
import { AuthContext } from "src/context/AuthContext";
import { styled } from '@mui/material/styles';


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


const Item = ({ defaultValue, groupId, userId, date, opened_id, setOpenedId }: { defaultValue: true | false | null | 0, groupId?: any, userId?: any, date?: any, opened_id: any, setOpenedId: any }) => {
  const [value, setValue] = useState<true | false | null | 0>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)


  const handleClick = async (status: any) => {
    setOpenedId(null)
    if (value !== status) {
      setValue(status)
      const data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: status
      }

      await api.post('common/student-attendance/', data)
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
        {open && <Box onBlur={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', gap: '4px', position: 'absolute', width: '80px', height: '30px', backgroundColor: 'rgba(0, 0, 0, 0.5)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <IconifyIcon icon={'mdi:cancel-bold'} onClick={() => handleClick(false)} fontSize={18} color="#e31309" cursor={'pointer'} />
          <IconifyIcon icon={'game-icons:check-mark'} onClick={() => handleClick(true)} fontSize={18} color="#4be309" cursor={'pointer'} />
          <IconifyIcon icon={'material-symbols-light:square-outline'} onClick={() => handleClick(null)} fontSize={18} color="#4be309" cursor={'pointer'} />
        </Box>}
        {!open && <span onClick={() => setOpenedId(`${userId}-${date}`)}>
          {
            value === true ? (
              <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color="#4be309" />
            ) : value === false ? (
              <IconifyIcon icon={'mdi:cancel-bold'} fontSize={18} color="#e31309" />
            ) : value === null ? (
              <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color="#9e9e9e" />
            ) : ''
          }
        </span>}
      </Box>
    )
  } else {
    return (
      <span>
        <IconifyIcon icon={'material-symbols:lock-outline'} fontSize={18} color="#9e9e9e" />
      </span>
    )
  }
}

const UserViewSecurity = ({ invoiceData }: any) => {
  const { pathname, query, push } = useRouter()
  const start_date: any = invoiceData?.start_date ? Number(invoiceData?.start_date.split('-')[1]) : ''
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useContext(AuthContext)
  const [opened_id, setOpenedId] = useState<any>(null)
  const [openTooltip, setOpenTooltip] = useState<null | string>(null)


  const [attendance, setAttendance] = useState<any>(null)
  const [days, setDays] = useState<any>([])

  const months: string[] = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']

  const generateDates = (startMonth: any, numMonths: number): Result[] => {
    const results: Result[] = [];
    let currentMonthIndex = months.findIndex(month => month === startMonth);
    let currentYear = Number(invoiceData?.start_date.split('-')[0])

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


  const handleClick = (value: any) => {

    push({
      pathname,
      query: { ...query, moonth: value.date, year: value.year }
    })
  }

  async function getAttendance() {
    setLoading(true)
    try {
      const resp = await api.get(`common/attendance-list/${query?.year || new Date().getFullYear()}-${getMontNumber(query.moonth)}-01/group/${query.id}/`)
      setAttendance(resp.data)
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }

  const getDates = async () => {
    try {
      const resp = await api.get(`common/day-of-week/${query.id}/date/${query?.year || new Date().getFullYear()}-${getMontNumber(query.moonth)}-01/`)
      setDays(resp.data);
    } catch (err) {
      console.log(err)
    }
  }

  // const getTopics = async () => {
  //   try {
  //     const resp = await api.get(`common/topic/list/date/${query?.year || new Date().getFullYear()}-${getMontNumber(query.moonth)}-01/group/${query.id}/`)
  //     console.log(resp.data);
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  useEffect(() => {
    getAttendance()
    getDates()
    // getTopics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.moonth])

  return (
    <Box className='demo-space-y'>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '15px', marginBottom: 12 }}>
        {
          generateDates(getMontName(start_date), invoiceData.month_duration).map(item => <li key={item.date} onClick={() => handleClick(item)} style={{ borderBottom: query?.moonth === item.date ? '2px solid #c3cccc' : '2px solid transparent', cursor: 'pointer' }}>{item.date}</li>)
        }
      </ul>

      <Box sx={{ display: 'flex', width: '100%', paddingBottom: 3, maxWidth: '100%', overflowX: 'scroll' }}>
        {
          loading ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Yuklanmoqda...</Typography>
            </Box>
          ) : (
            <table style={{ minWidth: '1000px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #c3cccc' }}>
                  <td style={{ padding: '8px 0', textAlign: 'start' }}><Typography>Imtixonlar</Typography></td>
                  {
                    attendance && days.map((hour: any) => <td key={hour.date} style={{ textAlign: 'center', minWidth: 50, padding: '8px 0', cursor: 'pointer' }}>
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
                                  <p style={{ margin: '0', marginBottom: '4px' }}>{hour.exam.title}</p>
                                  <p style={{ margin: '0', marginBottom: '4px' }}>Ball: {hour.exam.min_score} / {hour.exam.max_score}</p>
                                </div>
                              }
                            >
                              <span onClick={() => setOpenTooltip((c) => c === hour.date ? null : hour.date)} >
                                <IconifyIcon icon="maki:racetrack" />
                              </span>
                            </HtmlTooltip>
                          ) : ''
                        }
                      </div>
                    </td>)
                  }
                </tr>
                <tr style={{ borderBottom: '1px solid #c3cccc' }}>
                  <td style={{ padding: '8px 0', textAlign: 'start', borderRight: '1px solid #c3cccc', maxWidth: '100px' }}><Typography>O'quvchilar</Typography></td>
                  {
                    attendance && days.map((hour: any) => <th key={hour.date} style={{ textAlign: 'center', minWidth: 50, padding: '8px 0', cursor: 'pointer' }}><Typography>{`${hour.date.split('-')[2]}`}</Typography></th>)
                  }
                </tr>
              </thead>
              <tbody>
                {
                  attendance && attendance.students.map((student: any) => (
                    <tr key={student.id} style={{}}>
                      <td style={{ padding: '8px 0', textAlign: 'start', fontSize: '14px', borderRight: '1px solid #c3cccc' }}>{student.first_name}</td>
                      {
                        days.map((hour: any) => (
                          student.attendance.some((el: any) => el.date === hour.date) && student.attendance.find((el: any) => el.date === hour.date) ? (
                            <td key={student.attendance.find((el: any) => el.date === hour.date).date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'pointer' }}>
                              {
                                student.attendance.find((el: any) => el.date === hour.date).is_available === true ? (
                                  <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={true} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                ) :
                                  student.attendance.find((el: any) => el.date === hour.date).is_available === false ? (
                                    <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={false} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                  ) :
                                    student.attendance.find((el: any) => el.date === hour.date).is_available === null ? (
                                      <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={null} groupId={invoiceData.id} userId={student.id} date={hour.date} />
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
                  ))
                }
              </tbody>
            </table>
          )
        }
      </Box>
    </Box >
  )
}

export default UserViewSecurity
