// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { RoomType, SettingsState, SmsItemType } from 'src/types/apps/settings'


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


export const fetchRoomList = createAsyncThunk('settings/fetchRoomList', async (params?: any) => {
    return (await api.get('common/rooms/', { params })).data
})

export const createRoom = createAsyncThunk('settings/createRoom', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.post(`common/room/create`, data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue(err.message);
    }
})

export const editRoom = createAsyncThunk('settings/editRoom', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.patch(`common/room/update/${data.id}`, data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue(err.message);
    }
})

export const fetchWekends = createAsyncThunk('settings/fetchWekends', async () => {
    return (await api.get('common/weekend/list/')).data
})

export const createWekend = createAsyncThunk('settings/createWekend', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.post(`common/weekend/create/`, data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue(err.message);
    }
})

export const updateWekend = createAsyncThunk('settings/updateWekend', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.patch(`common/weekend/update/${data.id}/`, data);
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
    openEditCourse: null,
    rooms: [],
    openEditRoom: null,
    room_count: 0,
    active_page: 1,
    wekends: [],
    wekendData: null
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
        },
        setOpenEditRoom: (state, action) => {
            state.openEditRoom = action.payload
        },
        updatePage: (state, action) => {
            state.active_page = action.payload
        },
        setWekendData: (state, action) => {
            state.wekendData = action.payload
        },
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
            .addCase(fetchRoomList.pending, (state) => {
                state.is_pending = true
            })
            .addCase(fetchRoomList.fulfilled, (state, action) => {
                state.is_pending = false
                state.rooms = action.payload?.results.sort((a: RoomType, b: RoomType) => a.id - b.id)
                state.room_count = Math.ceil(action.payload.count / 10)
            })
            .addCase(fetchWekends.pending, (state) => {
                state.is_pending = true
            })
            .addCase(fetchWekends.fulfilled, (state, action) => {
                state.is_pending = false
                state.wekends = action.payload
            })
    }
})

export const {
    setOpenCreateSms,
    setOpenEditSms,
    setOpenEditCourse,
    setOpenEditRoom,
    updatePage,
    setWekendData
} = settingsSlice.actions

export default settingsSlice.reducer
