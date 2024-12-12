import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import IconifyIcon from "src/@core/components/icon";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useEffect, useState } from "react";
import api from "src/@core/utils/api";
import getMontName, { getMontNumber } from "src/@core/utils/gwt-month-name";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import EmptyContent from "src/@core/components/empty-content";
import { useAppDispatch, useAppSelector } from "src/store";
import { getAttendance, getDays, setGettingAttendance, updateParams } from "src/store/apps/groupDetails";
import { toast } from "react-hot-toast";
import SubLoader from "src/views/apps/loaders/SubLoader";


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




export const GradeItem = ({
  currentDate,
  defaultGrade,
  groupId,
  userId,
  date,
  opened_id,
  setOpenedId,
}: {
  currentDate: any
  defaultGrade: number | null
  groupId?: any
  userId?: any
  date?: any
  opened_id: any
  setOpenedId: any
}) => {
  const [grade, setGrade] = useState<number | null>(defaultGrade)
  const [open, setOpen] = useState<boolean>(false)

  const handleGradeChange = async (newGrade: number | null) => {
    setOpenedId(null)
    if (grade !== newGrade) {
      setGrade(newGrade)
      const data = {
        group: groupId,
        student: userId,
        date: date,
        grade: newGrade,
      }
      try {
        await api.patch(`common/grades/update/${currentDate?.id}/`, data)
        toast.success('Baholandi!')
      } catch (e: any) {
        toast.error(e.response.data.msg?.[0] || "Saqlab bo'lmadi qayta urinib ko'ring")
        setGrade(defaultGrade)
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

  return (
    <Box sx={{ position: 'relative' }}>
      {open && (
        <Box
          onBlur={() => setOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '8px',
            position: 'absolute',
            width: '140px',
            height: '50px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '4px',
            zIndex: 10,
            transition: 'all 0.3s ease',
          }}
        >
          {[1, 2, 3, 4, 5].map((g) => (
            <span
              key={g}
              onClick={() => handleGradeChange(g)}
              style={{
                cursor: 'pointer',
                fontSize: 18,
                fontWeight: grade === g ? 'bold' : 'normal',
                color: grade === g ? '#4be309' : '#d1d1d1',
                transition: 'color 0.2s ease',
              }}
            >
              {g}
            </span>
          ))}
          <span
            onClick={() => handleGradeChange(null)}
            style={{
              cursor: 'pointer',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#e31309',
              transition: 'color 0.2s ease',
            }}
          >
            Clear
          </span>
        </Box>
      )}
      {!open && (
        <span onClick={() => setOpenedId(`${userId}-${date}`)}>
          {grade !== null ? (
            <span style={{ fontSize: 18, color: '#4be309' }}>{grade}</span>
          ) : (
            <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color="#9e9e9e" />
          )}
        </span>
      )}
    </Box>
  )
}




export const GroupStudentGrades = () => {
    const {
      queryParams,
      attendance,
      isGettingAttendance,
      days,
      groupData,
      month_list,
    } = useAppSelector((state) => state.groupDetails);
    const dispatch = useAppDispatch();
    const { pathname, query, push } = useRouter();
    const { t } = useTranslation();
  
    const [opened_id, setOpenedId] = useState<any>(null);
    const [openTooltip, setOpenTooltip] = useState<null | string>(null);
    const [topic, setTopic] = useState<any>('');
  
    const months: string[] = [
      'yan',
      'fev',
      'mar',
      'apr',
      'may',
      'iyun',
      'iyul',
      'avg',
      'sen',
      'okt',
      'noy',
      'dek',
    ];
  
    const handleClick = async (date: any) => {
      const value = {
        month: date.date.split('-')[1],
        year: date.date.split('-')[0],
      };
  
      dispatch(setGettingAttendance(true));
      const queryString = new URLSearchParams(queryParams).toString();
      await dispatch(
        getAttendance({
          date: `${value.year}-${value.month}`,
          group: query?.id,
          queryString,
        })
      );
      await dispatch(
        getDays({
          date: `${value.year}-${value.month}`,
          group: query?.id,
        })
      );
      dispatch(setGettingAttendance(false));
  
      push({
        pathname,
        query: {
          ...query,
          month: getMontName(Number(value.month)),
          year: value.year,
          id: query?.id,
        },
      });
    };
  
    const handleTopicSubmit = async (hour: any) => {
      try {
        const response = await api.post('common/topic/create/', {
          topic,
          group: query?.id,
          date: hour.date,
        });
        if (response.status === 201) {
          setOpenTooltip(null);
          if (query.month) {
            await dispatch(
              getDays({
                date: `${query?.year || new Date().getFullYear()}-${getMontNumber(
                  query?.month
                )}`,
                group: query?.id,
              })
            );
          } else {
            toast.error(`Saqlangan ma'lumotni bolmadi`, { duration: 2000 });
          }
        } else {
          toast.error('Saqlab bolmadi', { duration: 2000 });
        }
      } catch (err) {
        console.log(err);
        toast.error('Saqlab bolmadi', { duration: 2000 });
      }
    };
  
    useEffect(() => {
      (async function () {
        const queryString = new URLSearchParams(queryParams).toString();
        dispatch(setGettingAttendance(true));
        if (query?.month && query?.id) {
          await dispatch(
            getAttendance({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(
                query?.month
              )}`,
              group: query?.id,
              queryString,
            })
          );
          await dispatch(
            getDays({
              date: `${query?.year || new Date().getFullYear()}-${getMontNumber(
                query?.month
              )}`,
              group: query?.id,
            })
          );
        }
        dispatch(setGettingAttendance(false));
      })();
    }, [queryParams.status]);
  
    return isGettingAttendance ? (
      <SubLoader />
    ) : (
      <Box className="demo-space-y">
        {/* Month Navigation */}
        <ul
          className="hide-scrollbar"
          style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            gap: '15px',
            marginBottom: 12,
            overflow: 'auto',
          }}
        >
          {month_list.map((item) => (
            <li
              key={item.date}
              onClick={() => handleClick(item)}
              style={{
                borderBottom:
                  query?.month === getMontName(Number(item.date.split('-')[1]))
                    ? '2px solid #c3cccc'
                    : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {item.month}
            </li>
          ))}
        </ul>
  
        {/* Attendance Table */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            paddingBottom: 3,
            maxWidth: '100%',
            overflowX: 'auto',
          }}
        >
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
              <tbody>
                {/* Student Grades */}
                {attendance?.students?.length > 0 ? (
                  attendance.students.map((student: any) => (
                    <tr key={student.id}>
                      <td
                        style={{
                          padding: '8px 0',
                          textAlign: 'start',
                          fontSize: '14px',
                          borderRight: '1px solid #c3cccc',
                        }}
                      >
                        {student.first_name}
                      </td>
                      {days?.map((hour: any) => {
                        const currentDate = student.attendance.find(
                          (el: any) => el.date === hour.date
                        );
                        return (
                          <td
                            key={hour.date}
                            style={{
                              padding: '8px 0',
                              textAlign: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <GradeItem
                              currentDate={currentDate}
                              opened_id={opened_id}
                              setOpenedId={setOpenedId}
                              defaultGrade={0}
                              groupId={query?.id}
                              userId={student.id}
                              date={hour.date}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={14}>
                      <EmptyContent />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    );
  };

