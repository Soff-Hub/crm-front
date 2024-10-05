import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import { AuthContext } from 'src/context/AuthContext';
import { useAppDispatch, useAppSelector } from 'src/store';
import { Employee, fetchEmployeeAttendance } from 'src/store/apps/employee-attendance';
import SubLoader from 'src/views/apps/loaders/SubLoader';

const generateDaysInMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
};

interface AttendanceRecord {
    [date: string]: {
        checkIn: string;
        checkOut: string;
    };
}

const stickyColumnStyles = {
    whiteSpace: 'nowrap',
    border: '1px solid #ccc',
    position: 'sticky',
    left: 0,
    background: '#F7F7F9',
    zIndex: 1,
    padding: "0 20px",
};

const headerCellStyles = {
    padding: 1,
    whiteSpace: 'nowrap',
    minWidth: '100px',
    border: '1px solid #ccc',
    minHeight: "0px",
};

const attendanceCellStyles = {
    whiteSpace: 'nowrap',
    minWidth: '100px',
    border: '1px solid #ccc',
    textAlign: 'center',
};

const EmployeeList = () => {
    const { t } = useTranslation();
    const { back, push } = useRouter();
    const { attendanceList, isLoading } = useAppSelector(state => state.employeeAttendance)
    const dispatch = useAppDispatch()
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (user?.role.includes('student')) {
            push("/")
        }
        dispatch(fetchEmployeeAttendance(""))
    }, [])

    console.log(new Date().toLocaleDateString());

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const renderHeaderCell = (day: string, index: number) => (
        <TableCell key={day.toString()} sx={headerCellStyles}>
            <Link href={`/employee-attendance/view/${day}`} passHref>
                <Button
                    color={index === 1 ? 'success' : 'primary'}
                    fullWidth
                    sx={{ borderRadius: 0, padding: '20px 10px', width: "100%", height: "100%" }}
                >
                    {day == formattedDate ? <IconifyIcon icon="flat-color-icons:plus" /> : <span style={{ transform: 'rotate(-25deg)' }}>{day}</span>}
                </Button>
            </Link>
        </TableCell>
    );

    const renderEmployeeAttendanceCell = (day: string, employee: Employee) => {

        return (
            <TableCell key={day} sx={attendanceCellStyles}>
                {employee.attendance ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {/* <span>{attendance.checkIn}</span> */}
                        {/* <span>{attendance.checkOut}</span> */}
                    </Box>
                ) : (
                    <IconifyIcon fontSize="20px" icon="tabler:lock" />
                )}
            </TableCell>
        );
    };

    return (
        <Box p={3} display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" mb={4} gap={2}>
                <IconButton color="primary" onClick={back}>
                    <IconifyIcon fontSize="30px" icon="ep:back" />
                </IconButton>
                <Typography variant="h4">{t('Xodimlar davomati')}</Typography>
            </Box>
            <TableContainer>
                {isLoading ? <SubLoader /> : <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={stickyColumnStyles}>
                                <span style={{ fontWeight: 'bold' }}>{t('Xodim')}</span>
                                <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, right: -1, bottom: 0 }}></div>
                                <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, left: -1, bottom: 0 }}></div>
                            </TableCell>
                            {attendanceList?.dates?.map(renderHeaderCell)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceList?.employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell sx={stickyColumnStyles}>
                                    {employee.first_name}
                                    <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, right: -1, bottom: 0 }}></div>
                                    <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, left: -1, bottom: 0 }}></div>
                                </TableCell>
                                {attendanceList?.dates.map((day) => renderEmployeeAttendanceCell(day, employee))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
            </TableContainer>
        </Box>
    );
};

export default EmployeeList;
