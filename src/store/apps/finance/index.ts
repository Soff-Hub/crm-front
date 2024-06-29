// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IFinanceState } from 'src/types/apps/finance'


export const fetchModerationSalaries = createAsyncThunk('finance/fetchModerationSalaries', async () => {
    return (await api.get('/common/finance/employee-salaries/')).data
})

export const createSms = createAsyncThunk('finance/createSms', async (data: { description: string }) => {
    return (await api.post('common/sms-form/create/', data)).data
})


export const editSms = createAsyncThunk('finance/editSms', async (data: { description: string, id: number }) => {
    return (await api.patch(`common/sms-form/update/${data?.id}`, data)).data
})

const calcBonus = (array: any[], bonus: number) => {
    return array
    return array.map(el => ({ ...el, salary: bonus + Number(el.salary) }))
}

const calcFine = (array: any[], fine: number) => {
    return array
    return array.map(el => ({ ...el, salary: fine + Number(el.salary) }))
}


const initialState: IFinanceState = {
    isPending: false,
    moderation_salaries: []
}

export const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        updateSalaryBonus: (state, action) => {
            const data = state.moderation_salaries.map(el => el.id === action.payload.id ?
                ({ ...el, bonus_amount: +action.payload.bonus_amount })
                : el)

            state.moderation_salaries = calcBonus(data, action.payload.bonus_amount)
        },
        updateSalaryFine: (state, action) => {
            const data = state.moderation_salaries.map(el => el.id === action.payload.id ?
                ({ ...el, fine_amount: +action.payload.fine_amount })
                : el)

            state.moderation_salaries = calcFine(data, action.payload.fine_amount)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchModerationSalaries.pending, (state) => {
                state.isPending = true
            })
            .addCase(fetchModerationSalaries.fulfilled, (state, action) => {
                state.isPending = false
                state.moderation_salaries = action.payload
            })
    }
})

export const {
    updateSalaryBonus,
    updateSalaryFine
} = financeSlice.actions

export default financeSlice.reducer
