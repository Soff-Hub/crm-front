import { GetServerSideProps } from "next/types";
import EmployeeAttendanceDetail from "src/views/apps/employee-attendance/EpmloyeeAttendanceDetail";


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { date } = context.query;

    let attendanceData;

    try {
        // attendanceData = await fetchAttendanceData(date); 
    } catch (error) {
        console.error(error);
        attendanceData = null; // Handle the error case appropriately
    }

    return {
        props: {
            attendanceData: attendanceData || [],
            date: date || null,
        },
    };
};

const AttendanceDetailPage = ({ attendanceData, date }: { attendanceData: any, date: string }) => {
    return <EmployeeAttendanceDetail />
};

export default AttendanceDetailPage;
