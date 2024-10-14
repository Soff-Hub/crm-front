import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { ILogsState } from 'src/types/apps/logs'

// ** Fetch All Departments
export const fetchPaymetLogs = createAsyncThunk('logs/fetchPaymetLogs', async (queryString?: any) => {
    return (await api.get(`auth/student/logs/?` + queryString)).data
})

export const fetBotOwners = createAsyncThunk('logs/fetBotOwners', async (queryString?: any) => {
    return (await api.get(`common/bot-notification/list/?` + queryString)).data
})

export const createBotNotification = createAsyncThunk('mentors/createBotNotification', async (values: any, { rejectWithValue }) => {
    try {
        const response = await api.post(`common/bot-notification/create/`, values)
        return response.data
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data)
        }
        return rejectWithValue(err.message)
    }
})

const initialState: ILogsState = {
    queryParams: { page: 1 },
    isLoading: false,
    paymentLogs: [],
    paymentCount: 0,
    botNotifications: [],
    botNotificationsCount: 0,
    createLoading: false,
    openCreate: false
}

export const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {
        setOpenCreate: (state, action) => {
            state.openCreate = action.payload
        }
    },
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
            .addCase(fetBotOwners.pending, state => {
                state.isLoading = true
            })
            .addCase(fetBotOwners.fulfilled, (state, action) => {
                state.isLoading = false
                state.botNotifications = action.payload?.results
                state.botNotificationsCount = action.payload?.count
            })
            .addCase(createBotNotification.pending, state => {
                state.createLoading = true
            })
            .addCase(createBotNotification.fulfilled, state => {
                state.createLoading = false
            })
    }
})

export const { setOpenCreate } = logsSlice.actions

export default logsSlice.reducer
