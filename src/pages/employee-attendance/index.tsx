import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'src/@core/components/icon';
import { AuthContext } from 'src/context/AuthContext';
import { useAppDispatch, useAppSelector } from 'src/store';
import { fetchEmployeeAttendance } from 'src/store/apps/employee-attendance';

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

interface Employee {
    id: number;
    name: string;
    attendance: AttendanceRecord;
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
    const { attendanceList } = useAppSelector(state => state.employeeAttendance)
    const dispatch = useAppDispatch()
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (user?.role.includes('student')) {
            push("/")
        }
        dispatch(fetchEmployeeAttendance(""))
    }, [])


    const employees: Employee[] = [
        { id: 1, name: 'John Doe', attendance: { '2024-12-01': { checkIn: '09:00 AM', checkOut: '06:00 PM' } } },
        { id: 2, name: 'Jane Smith', attendance: { '2024-12-01': { checkIn: '09:15 AM', checkOut: '06:10 PM' } } },
        { id: 3, name: 'David Brown', attendance: { '2024-12-01': { checkIn: '09:05 AM', checkOut: '05:55 PM' } } },
    ];

    const currentYear = 2024;
    const currentMonth = 11;
    const daysInMonth = generateDaysInMonth(currentYear, currentMonth);

    const renderHeaderCell = (day: Date, index: number) => (
        <TableCell key={day.toString()} sx={headerCellStyles}>
            <Link href={`/employee-attendance/view/${format(day, 'yyyy-MM-dd')}`} passHref>
                <Button
                    color={index === 1 ? 'success' : 'primary'}
                    fullWidth
                    sx={{ borderRadius: 0, padding: '20px 10px', width: "100%", height: "100%" }}
                >
                    {index === 1 ? <IconifyIcon icon="flat-color-icons:plus" /> : <span style={{ transform: 'rotate(-25deg)' }}>{format(day, 'yyyy-MM-dd')}</span>}
                </Button>
            </Link>
        </TableCell>
    );

    const renderEmployeeAttendanceCell = (day: Date, employee: Employee) => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const attendance = employee.attendance[formattedDate];

        return (
            <TableCell key={formattedDate} sx={attendanceCellStyles}>
                {attendance ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span>{attendance.checkIn}</span>
                        <span>{attendance.checkOut}</span>
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={stickyColumnStyles}>
                                <span style={{ fontWeight: 'bold' }}>{t('Xodim')}</span>
                                <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, right: -1, bottom: 0 }}></div>
                                <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, left: -1, bottom: 0 }}></div>
                            </TableCell>
                            {daysInMonth.map(renderHeaderCell)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell sx={stickyColumnStyles}>
                                    {employee.name}
                                    <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, right: -1, bottom: 0 }}></div>
                                    <div style={{ height: "100%", width: "1px", background: "#ccc", zIndex: 2, position: "absolute", top: 0, left: -1, bottom: 0 }}></div>
                                </TableCell>
                                {daysInMonth.map((day) => renderEmployeeAttendanceCell(day, employee))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmployeeList;
