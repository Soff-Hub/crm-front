import React, { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Switch,
    FormControlLabel,
    IconButton
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconifyIcon from 'src/@core/components/icon'; // Assuming you're using Iconify for icons
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const EmployeeAttendanceDetail = () => {
    const { t } = useTranslation();
    const { back } = useRouter()

    const [attendanceData, setAttendanceData] = useState([
        { id: 1, name: 'John Doe', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Keldi' },
        { id: 2, name: 'Jane Smith', checkIn: '09:15 AM', checkOut: '06:15 PM', status: 'Kechikdi' },
        { id: 3, name: 'David Brown', checkIn: 'Kelmadi', checkOut: 'Kelmadi', status: 'Kelmadi' },
    ]);

    const [openDialog, setOpenDialog] = useState(false);

    const [newRecord, setNewRecord] = useState({
        id: attendanceData.length + 1,
        name: '',
        checkIn: '',
        checkOut: '',
        status: 'Keldi',
    });

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewRecord({
            ...newRecord,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        setAttendanceData([...attendanceData, newRecord]);
        handleCloseDialog();
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('ID'),
            flex: 0.5,
            minWidth: 70,
        },
        {
            field: 'name',
            headerName: t('Ismi'),
            flex: 1.5,
            minWidth: 150,
        },
        {
            field: 'checkIn',
            headerName: t('Kelgan vaqti'),
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'checkOut',
            headerName: t('Ketgan vaqti'),
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'status',
            headerName: t('Status'),
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === 'Keldi'
                            ? 'success'
                            : params.value === 'Kechikdi'
                                ? 'warning'
                                : 'error'
                    }
                />
            ),
        },
    ];

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" mb={4} gap={2} >
                <IconButton color='primary'>
                    <IconifyIcon fontSize={"30px"} icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={back} />
                </IconButton>
                <Typography variant="h4" >
                    {t("Kunlik yo'qlamalar")}
                </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <FormControlLabel
                    control={<Switch />}
                    label={t("Kelmaganlarni ko'rish")}
                    onChange={(e) => {
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    startIcon={<IconifyIcon icon="ic:baseline-plus" />}
                >
                    {t('Belgilash')}
                </Button>
            </Box>

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={attendanceData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    autoHeight
                />
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{t('Add New Attendance Record')}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label={t('Employee Name')}
                        name="name"
                        value={newRecord.name}
                        onChange={handleInputChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label={t('Check-in Time')}
                        name="checkIn"
                        value={newRecord.checkIn}
                        onChange={handleInputChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label={t('Check-out Time')}
                        name="checkOut"
                        value={newRecord.checkOut}
                        onChange={handleInputChange}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        label={t('Status')}
                        name="status"
                        value={newRecord.status}
                        onChange={handleInputChange}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {t('Add')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmployeeAttendanceDetail;
