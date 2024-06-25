import CalendarWrapper from "src/@core/styles/libs/fullcalendar";
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';
import generateTimeSlots from 'src/@core/utils/generate-time-slots';
import { hourFormatter } from 'src/@core/utils/hourFormatter';
import getMonthName from 'src/@core/utils/gwt-month-name';
import { ILessonResponse } from 'src/types/apps/dashboardTypes';
import { useAppSelector } from "src/store";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Theme } from '@mui/material/styles';
import SubLoader from "../loaders/SubLoader";
import DashboardTable from "./DashboardTable";

export default function Calendar() {
    const { dashboardLessons, isUpdatingDashboard, workTime, formParams } = useAppSelector((state) => state.groups)
    const { companyInfo } = useAppSelector((state) => state.user)

    const { t } = useTranslation()
    const { push } = useRouter()
    const startTime = companyInfo?.work_start_time
    const endTime = companyInfo?.work_end_time
    const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

    return (
        <CalendarWrapper
            className='app-calendar'
            sx={{
                height: "100%",
                padding: "10px",
                gridColumn: "1/4"
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
                <Box sx={{
                    padding: '0 15px',
                    maxWidth: '100%',
                    overflowX: 'auto'
                }}>
                    <Typography variant="h5">{formParams.day_of_week == `tuesday,thursday,saturday` ? "Juft kunlar" : formParams.day_of_week == `monday,wednesday,friday` ? "Toq kunlar" : formParams.day_of_week == `tuesday,thursday,saturday,monday,wednesday,friday` ? "Har kuni" : "Boshqa kunlar"}</Typography>
                    <table border={0} style={{ width: "100%" }}>
                        {isUpdatingDashboard ?
                            <tr>
                                <td colSpan={workTime?.length + 1}>
                                    <SubLoader />
                                </td>
                            </tr> :
                            <tbody>
                                <tr>
                                    <td style={{ minWidth: '100px', fontSize: '12px' }}>
                                        {t("Xonalar")} {" / "}{t('Soat')}
                                    </td>
                                    <td>
                                        <Box sx={{ display: 'flex', }}>
                                            {workTime?.map((el: string) => <Box key={el} sx={{ width: '50px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{el}</Box>)}
                                        </Box>
                                    </td>
                                </tr>
                                {dashboardLessons?.map((lesson: ILessonResponse) => (
                                    <tr style={{ borderBottom: '1px solid #c3cccc65' }} key={lesson.room_id}>
                                        <td style={{ minWidth: '100px', fontSize: '12px' }}>
                                            {lesson.room_name}
                                        </td>
                                        <td>
                                            <DashboardTable lesson={lesson} />
                                            {/* <Box sx={{ display: 'flex', position: 'relative', marginLeft: '25px' }}>
                                                {workTime?.map((el: string) => <Box key={el} sx={{ width: '50px', height: '45px', borderLeft: '1px solid #c3cccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></Box>)}
                                                {Object.entries(exclude_time).forEach(item => {
                                                    console.log(item);

                                                    // < Box sx={{ width: `${generateTimeSlots(item.start_at, item.end_at).length * 50}px`, height: '45px', position: 'absolute', padding: '5px', left: `${workTime.findIndex(el => el === generateTimeSlots(item.start_at, item.end_at)[0]) * 50}px` }}>
                                                    //     <Box sx={{ borderRadius: '8px', backgroundColor: `${item.color}`, width: '100%', height: '100%', cursor: 'pointer', padding: '2px 6px', overflow: 'hidden' }}>
                                                    //         <Typography sx={{ color: 'black', fontSize: '10px' }}>{hourFormatter(item.start_at)} - {hourFormatter(item.end_at)} / {item.name}</Typography>
                                                    //         <Typography sx={{ color: 'black', fontSize: '10px' }}>{item.teacher_name}</Typography>
                                                    //     </Box>
                                                    // </Box>
                                                })}
                                                {lesson.lessons.map((item: any) => (
                                                    <Box onClick={() => push(`/groups/view/security?id=${item.id}&month=${getMonthName(null)}`)} key={item.id} sx={{ width: `${generateTimeSlots(item.start_at, item.end_at).length * 50}px`, height: '45px', position: 'absolute', padding: '5px', left: `${workTime.findIndex(el => el === generateTimeSlots(item.start_at, item.end_at)[0]) * 50}px` }}>
                                                        <Box sx={{ borderRadius: '8px', backgroundColor: `${item.color}`, width: '100%', height: '100%', cursor: 'pointer', padding: '2px 6px', overflow: 'hidden' }}>
                                                            <Typography sx={{ color: 'black', fontSize: '10px' }}>{hourFormatter(item.start_at)} - {hourFormatter(item.end_at)} / {item.name}</Typography>
                                                            <Typography sx={{ color: 'black', fontSize: '10px' }}>{item.teacher_name}</Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box> */}
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>}
                    </table>
                </Box>
            </Box>
        </CalendarWrapper >
    )
}
