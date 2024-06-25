// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { SettingsState, SmsItemType } from 'src/types/apps/settings'


export const fetchSmsList = createAsyncThunk('settings/fetchSmsList', async () => {
    return (await api.get('common/sms-form/list/')).data
})

export const createSms = createAsyncThunk('settings/createSms', async (data: { description: string }) => {
    return (await api.post('common/sms-form/create/', data)).data
})


export const editSms = createAsyncThunk('settings/editSms', async (data: { description: string, id: number }) => {
    return (await api.patch(`common/sms-form/update/${data?.id}`, data)).data
})

export const fetchCoursesList = createAsyncThunk('settings/fetchCoursesList', async () => {
    return (await api.get('common/courses/')).data
})

export const createGroup = createAsyncThunk('settings/createGroup', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.post(`common/course/create`, data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue(err.message);
    }
})

export const editCourse = createAsyncThunk('settings/editCourse', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.patch(`common/course/update/${data.id}`, data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue(err.message);
    }
})




const initialState: SettingsState = {
    is_pending: false,
    sms_list: [],
    openCreateSms: false,
    openEditSms: null,
    course_list: [],
    openEditCourse: null
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setOpenCreateSms: (state, action) => {
            state.openCreateSms = action.payload
        },
        setOpenEditSms: (state, action) => {
            state.openEditSms = action.payload
        },
        setOpenEditCourse: (state, action) => {
            state.openEditCourse = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSmsList.pending, (state) => {
                state.is_pending = true
            })
            .addCase(fetchSmsList.fulfilled, (state, action) => {
                state.is_pending = false
                state.sms_list = action.payload.sort((a: SmsItemType, b: SmsItemType) => a.id - b.id)
            })
            .addCase(createSms.fulfilled, (state, action) => {
                state.sms_list.push(action.payload)
            })
            .addCase(editSms.fulfilled, (state, action) => {
                state.sms_list = [...state.sms_list.filter(el => el.id !== action.payload.id), action.payload].sort((a: SmsItemType, b: SmsItemType) => a.id - b.id)
            })
            .addCase(fetchCoursesList.pending, (state) => {
                state.is_pending = true
            })
            .addCase(fetchCoursesList.fulfilled, (state, action) => {
                state.is_pending = false
                state.course_list = action.payload?.results
            })
    }
})

export const {
    setOpenCreateSms,
    setOpenEditSms,
    setOpenEditCourse
} = settingsSlice.actions

export default settingsSlice.reducer
