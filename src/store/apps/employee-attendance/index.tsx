import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/@core/utils/api';

export const fetchEmployeeAttendance = createAsyncThunk('appEmail/fetchEmployeeAttendance', async (params?: any) => {
    const response = await api.get('auth/employee-attendances/', { params });
    return { data: response.data, filter: params };
});

export type Employee = {
    id: number;
    first_name: string;
    attendance: any[];
};

type AttendanceRecord = {
    dates: string[];
    employees: Employee[];
};

type InitialState = {
    attendanceList: AttendanceRecord | null,
    isLoading: boolean
}

const initialState: InitialState = {
    attendanceList: null,
    isLoading: false
};

export const employeeAttendanceSlice = createSlice({
    name: 'employeeAttendance',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchEmployeeAttendance.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchEmployeeAttendance.fulfilled, (state, action) => {
            state.attendanceList = action.payload.data;
            state.isLoading = false;
        });
        builder.addCase(fetchEmployeeAttendance.rejected, (state, action) => {
            state.isLoading = false;
        });
    }
});

export const { } = employeeAttendanceSlice.actions;

export default employeeAttendanceSlice.reducer;
