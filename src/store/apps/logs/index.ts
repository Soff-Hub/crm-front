import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { ILogsState } from 'src/types/apps/logs'

// ** Fetch All Departments
export const fetchPaymetLogs = createAsyncThunk('logs/fetchPaymetLogs', async (queryString?: any) => {
    return (await api.get(`auth/student/logs/?` + queryString)).data
})

const initialState: ILogsState = {
    queryParams: { page: 1 },
    isLoading: false,
    paymentLogs: [],
    paymentCount: 0,
}

export const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPaymetLogs.pending, state => {
                state.isLoading = true
            })
            .addCase(fetchPaymetLogs.fulfilled, (state, action) => {
                state.isLoading = false
                state.paymentLogs = action.payload?.results
                state.paymentCount = action.payload?.count
            })
    }
})

export const { } = logsSlice.actions

export default logsSlice.reducer
