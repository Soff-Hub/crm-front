import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/@core/utils/api';

// Async thunk to fetch employee attendance
export const fetchEmployeeAttendance = createAsyncThunk('appEmail/fetchEmployeeAttendance', async (params?: any) => {
    const response = await api.get('auth/employee-attendances/', { params });
    return { data: response.data, filter: params };
});

// Create the slice
export const employeeAttendanceSlice = createSlice({
    name: 'employeeAttendance',
    initialState: {
        attendanceList: null
    },
    reducers: {}, // Reducers are defined outside of initialState
    extraReducers: builder => {
        builder.addCase(fetchEmployeeAttendance.fulfilled, (state, action) => {
            state.attendanceList = action.payload.data;
        });
    }
});

// Export the actions (if any are defined)
export const { } = employeeAttendanceSlice.actions;

// Export the reducer
export default employeeAttendanceSlice.reducer;
