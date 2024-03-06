import { Box, CircularProgress, Typography } from "@mui/material"
import { useRouter } from "next/router"
import IconifyIcon from "src/@core/components/icon"
import Tooltip from '@mui/material/Tooltip';
import { useContext, useEffect, useState } from "react";
import api from "src/@core/utils/api";
import getMontName, { getMontNumber } from "src/@core/utils/gwt-month-name";
import { AuthContext } from "src/context/AuthContext";


interface Result {
  date: string;
  year: string;
}

const today = new Date().getDate()


const Item = ({ defaultValue, groupId, userId, date }: { defaultValue: true | false | null | 0, groupId?: any, userId?: any, date?: any }) => {
  const [value, setValue] = useState<true | false | null | 0>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)


  const handleClick = async (status: any) => {
    setOpen(false)

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

  if (value === true || value === false || value === null) {
    return (
      <Box sx={{ position: 'relative' }}>
        {open && <Box onBlur={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', gap: '4px', position: 'absolute', width: '80px', height: '30px', backgroundColor: 'rgba(0, 0, 0, 0.5)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <IconifyIcon icon={'mdi:cancel-bold'} onClick={() => handleClick(false)} fontSize={18} color="#e31309" cursor={'pointer'} />
          <IconifyIcon icon={'game-icons:check-mark'} onClick={() => handleClick(true)} fontSize={18} color="#4be309" cursor={'pointer'} />
          <IconifyIcon icon={'material-symbols-light:square-outline'} onClick={() => handleClick(null)} fontSize={18} color="#4be309" cursor={'pointer'} />
        </Box>}
        {!open && <span onClick={() => setOpen(true)}>
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

const ItemTeacher = ({ defaultValue, groupId, userId, date }: { defaultValue: true | false | null | 0, groupId?: any, userId?: any, date?: any }) => {
  const [value, setValue] = useState<true | false | null | 0>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)

  const handleClick = async (status: any) => {
    setOpen(false)

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


  if (value === true || value === false || value === null) {
    if (today === Number(date.split('-')[2])) {
      return (
        <Box sx={{ position: 'relative' }}>
          {open && <Box onBlur={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', gap: '0px', position: 'absolute', width: '60px', height: '30px', backgroundColor: 'rgba(0, 0, 0, 0.5)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <IconifyIcon icon={'mdi:cancel-bold'} onClick={() => handleClick(false)} fontSize={18} color="#e31309" cursor={'pointer'} />
            <IconifyIcon icon={'game-icons:check-mark'} onClick={() => handleClick(true)} fontSize={18} color="#4be309" cursor={'pointer'} />
            <IconifyIcon icon={'material-symbols-light:square-outline'} onClick={() => handleClick(null)} fontSize={18} color="#4be309" cursor={'pointer'} />
          </Box>}
          {!open && <span onClick={() => setOpen(true)}>
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
        <Tooltip title={"Ruxsat yo'q"} placement="top">
          <span>
            {
              value === true ? (
                <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color="#4be309" />
              ) : value === false ? (
                <IconifyIcon icon={'mdi:cancel-bold'} fontSize={18} color="#e31309" />
              ) : value === null ? (
                <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color="#9e9e9e" />
              ) : ''
            }
          </span>
        </Tooltip>
      )
    }

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


  const [attendance, setAttendance] = useState<any>(null)

  const months: string[] = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek']

  const generateDates = (startMonth: any, numMonths: number): Result[] => {
    const results: Result[] = [];
    let currentMonthIndex = months.findIndex(month => month === startMonth);
    let currentYear = new Date().getFullYear();

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


  const handleClick = (value: string) => {
    push({
      pathname,
      query: { ...query, moonth: value }
    })
  }

  async function getAttendance() {
    setLoading(true)
    try {
      const resp = await api.get(`common/attendance-list/2024-${getMontNumber(query.moonth)}-01/group/${query.id}/`)
      setAttendance(resp.data)
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }

  useEffect(() => {
    getAttendance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.moonth])

  return (
    <Box className='demo-space-y'>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '15px', marginBottom: 12 }}>
        {
          generateDates(getMontName(start_date), 7).map(item => <li key={item.date} onClick={() => handleClick(item.date)} style={{ borderBottom: query?.moonth === item.date ? '2px solid #c3cccc' : '2px solid transparent', cursor: 'pointer' }}>{item.date}</li>)
        }
      </ul>

      <Box sx={{ display: 'flex', width: '100%', paddingBottom: 3 }}>
        {
          loading ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Yuklanmoqda...</Typography>
            </Box>
          ) : (
            user?.role === "teacher" ? (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{}}>
                    <td style={{ padding: '8px 0', textAlign: 'start' }}><Typography>O'quvchilar</Typography></td>
                    {
                      attendance && attendance.days.map((hour: any) => <th key={hour.date} style={{ textAlign: 'center', minWidth: 50, padding: '8px 0' }}><Typography>{`${hour.date.split('-')[2]}`}</Typography></th>)
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    attendance && attendance.students.map((student: any) => (
                      <tr key={student.id} style={{}}>
                        <td style={{ padding: '8px 0', textAlign: 'start', fontSize: '14px' }}>{student.first_name}</td>
                        {
                          attendance.days.map((hour: any) => (
                            student.attendance.some((el: any) => el.date === hour.date) && student.attendance.find((el: any) => el.date === hour.date) ? (
                              <td key={student.attendance.find((el: any) => el.date === hour.date).date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'pointer' }}>
                                {
                                  student.attendance.find((el: any) => el.date === hour.date).is_available === true ? (
                                    <ItemTeacher defaultValue={true} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                  ) :
                                    student.attendance.find((el: any) => el.date === hour.date).is_available === false ? (
                                      <ItemTeacher defaultValue={false} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                    ) :
                                      student.attendance.find((el: any) => el.date === hour.date).is_available === null ? (
                                        <ItemTeacher defaultValue={null} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                      ) : <></>
                                }
                              </td>
                            ) : <td key={hour.date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'not-allowed' }}>
                              <span>
                                <ItemTeacher defaultValue={0} />
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
            ) : (
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{}}>
                    <td style={{ padding: '8px 0', textAlign: 'start' }}><Typography>O'quvchilar</Typography></td>
                    {
                      attendance && attendance.days.map((hour: any) => <th key={hour.date} style={{ textAlign: 'center', minWidth: 50, padding: '8px 0' }}><Typography>{`${hour.date.split('-')[2]}`}</Typography></th>)
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    attendance && attendance.students.map((student: any) => (
                      <tr key={student.id} style={{}}>
                        <td style={{ padding: '8px 0', textAlign: 'start', fontSize: '14px' }}>{student.first_name}</td>
                        {
                          attendance.days.map((hour: any) => (
                            student.attendance.some((el: any) => el.date === hour.date) && student.attendance.find((el: any) => el.date === hour.date) ? (
                              <td key={student.attendance.find((el: any) => el.date === hour.date).date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'pointer' }}>
                                {
                                  student.attendance.find((el: any) => el.date === hour.date).is_available === true ? (
                                    <Item defaultValue={true} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                  ) :
                                    student.attendance.find((el: any) => el.date === hour.date).is_available === false ? (
                                      <Item defaultValue={false} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                    ) :
                                      student.attendance.find((el: any) => el.date === hour.date).is_available === null ? (
                                        <Item defaultValue={null} groupId={invoiceData.id} userId={student.id} date={hour.date} />
                                      ) : <></>
                                }
                              </td>
                            ) : <td key={hour.date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'not-allowed' }}>
                              <span>
                                <Item defaultValue={0} />
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
          )
        }
      </Box>
    </Box >
  )
}

export default UserViewSecurity
