import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import IconifyIcon from "src/@core/components/icon"
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { useContext, useEffect, useState } from "react";
import api from "src/@core/utils/api";
import getMontName, { getMontNumber } from "src/@core/utils/gwt-month-name";
import { AuthContext } from "src/context/AuthContext";
import { styled } from '@mui/material/styles';
import { t } from "i18next";
import { useTranslation } from "react-i18next";


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


const Item = ({ defaultValue }: { defaultValue: true | false | null | 0, groupId?: any, userId?: any, date?: any, opened_id: any, setOpenedId: any }) => {


    if (defaultValue === true || defaultValue === false || defaultValue === null) {
        return (
            <Box sx={{ position: 'relative' }}>
                <span>
                    {
                        defaultValue === true ? (
                            <IconifyIcon icon={'game-icons:check-mark'} fontSize={18} color="#4be309" />
                        ) : defaultValue === false ? (
                            <IconifyIcon icon={'mdi:cancel-bold'} fontSize={18} color="#e31309" />
                        ) : defaultValue === null ? (
                            <IconifyIcon icon={'fluent:square-20-regular'} fontSize={18} color="#9e9e9e" />
                        ) : ''
                    }
                </span>
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

const StudentGroupDetail = ({ invoiceData }: any) => {
    const { pathname, query, push } = useRouter()
    const start_date: any = invoiceData?.start_date ? Number(invoiceData?.start_date.split('-')[1]) : ''
    const [loading, setLoading] = useState<boolean>(false)
    const { user } = useContext(AuthContext)
    const [opened_id, setOpenedId] = useState<any>(null)
    const [openTooltip, setOpenTooltip] = useState<null | string>(null)
    const [month, setMonth] = useState<any>(null)
    const [topic, setTopic] = useState<any>('')
    const [archiveUrl, setArchiveUrl] = useState<'active,new' | 'archive'>('active,new')
    const { t } = useTranslation()


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




    async function getAttendance(date: any, group: any) {
        setLoading(true)
        try {
            const resp = await api.get(`common/attendance-list/${date}-01/group/${group}/?status=${archiveUrl}`)
            setAttendance(resp.data)
            setLoading(false)
        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    const getDates = async (date: any, group: any) => {
        try {
            const resp = await api.get(`common/day-of-week/${group}/date/${date}-01/`)
            setDays(resp.data);
        } catch (err) {
            console.log(err)
        }
    }

    const handleClick = (value: any) => {

        getAttendance(`${value.year}-${getMontNumber(value.date)}`, invoiceData.id)
        getDates(`${value.year}-${getMontNumber(value.date)}`, invoiceData.id)

        push({
            pathname,
            query: { ...query, month: value.date, year: value.year, id: invoiceData.id }
        })
    }

    // const getTopics = async () => {
    //   try {
    //     const resp = await api.get(`common/topic/list/date/${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}-01/group/${query.id}/`)
    //     console.log(resp.data);
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }



    useEffect(() => {
        if (query?.month) {
            setMonth(query?.month)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query?.month])

    useEffect(() => {
        if (month) {
            getAttendance(`${query?.year || new Date().getFullYear()}-${getMontNumber(month)}`, invoiceData.id)
            getDates(`${query?.year || new Date().getFullYear()}-${getMontNumber(month)}`, invoiceData.id)
        }
        // getTopics()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [month, archiveUrl])

    return (
        <Box className='demo-space-y'>
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '15px', marginBottom: 12 }}>
                {
                    generateDates(getMontName('12'), invoiceData.month_duration).map(item => <li key={item.date} onClick={() => handleClick(item)} style={{ borderBottom: month === item.date ? '2px solid #c3cccc' : '2px solid transparent', cursor: 'pointer' }}>{item.date}</li>)
                }
            </ul>

            <Box sx={{ display: 'flex', width: '100%', paddingBottom: 3, maxWidth: '100%', overflowX: 'scroll' }}>
                {
                    loading ? (
                        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <CircularProgress sx={{ mb: 4 }} />
                            <Typography>{t('Loading...')}</Typography>
                        </Box>
                    ) : (
                        <Box>
                            <table>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #c3cccc' }}>
                                        <td style={{ padding: '8px 0', textAlign: 'start', minWidth: '150px' }}><Typography>{t('Mavzular')}</Typography></td>
                                        {
                                            attendance && days.map((hour: any) => <td key={hour.date} style={{ textAlign: 'center', minWidth: '45px', padding: '8px 0', cursor: 'pointer', backgroundColor: hour.exam ? '#96f3a5' : hour.lesson ? '#a7c0fb' : 'transparent' }}>
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
                                                                    {hour.exam?.title}
                                                                </span>
                                                            </HtmlTooltip>
                                                        ) : <HtmlTooltip
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
                                                            <span onClick={() => setOpenTooltip((c) => c === hour.date ? null : hour.date)} >
                                                                mavzu
                                                            </span>
                                                        </HtmlTooltip>
                                                    }
                                                </div>
                                            </td>)
                                        }
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #c3cccc' }}>
                                        <td style={{ padding: '8px 0', textAlign: 'start', borderRight: '1px solid #c3cccc', maxWidth: '100px' }}><Typography>{t("O'quvchilar")}</Typography></td>
                                        {
                                            attendance && days.map((hour: any) => <th key={hour.date} style={{ textAlign: 'center', minWidth: '50px', padding: '8px 0', cursor: 'pointer' }}><Typography>{`${hour.date.split('-')[2]}`}</Typography></th>)
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{}}>
                                        <td style={{ padding: '8px 0', textAlign: 'start', fontSize: '14px', borderRight: '1px solid #c3cccc' }}>{'first_name'}</td>
                                        {
                                            days.map((hour: any) => (
                                                attendance.some((el: any) => el.date === hour.date) && attendance.find((el: any) => el.date === hour.date) ? (
                                                    <td key={attendance.find((el: any) => el.date === hour.date).date} style={{ padding: '8px 0', textAlign: 'center', cursor: 'pointer' }}>
                                                        <Item opened_id={opened_id} setOpenedId={setOpenedId} defaultValue={attendance.find((el: any) => el.date === hour.date)?.is_available} groupId={invoiceData.id} userId={1} date={hour.date} />
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
                                </tbody>
                            </table>
                        </Box>
                    )
                }
            </Box>
        </Box >
    )
}

export default StudentGroupDetail
