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


const initialState: SettingsState = {
    is_pending: false,
    sms_list: [],
    openCreateSms: false,
    openEditSms: null
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
    }
})

export const {
    setOpenCreateSms,
    setOpenEditSms
} = settingsSlice.actions

export default settingsSlice.reducer
