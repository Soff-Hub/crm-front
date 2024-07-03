// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IFinanceState } from 'src/types/apps/finance'


export const fetchModerationSalaries = createAsyncThunk('finance/fetchModerationSalaries', async (params?: string) => {
    return (await api.get('/common/finance/employee-salaries/?' + params)).data
})

export const createSms = createAsyncThunk('finance/createSms', async (data: { description: string }) => {
    return (await api.post('common/sms-form/create/', data)).data
})


export const editSms = createAsyncThunk('finance/editSms', async (data: { description: string, id: number }) => {
    return (await api.patch(`common/sms-form/update/${data?.id}`, data)).data
})

const calcBonus = (array: any[], bonus: number) => {
    return array.map(el => ({ ...el, salary: bonus + Number(el.salary) }))
}

const calcFine = (array: any[], fine: number) => {
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
            const data = state.moderation_salaries.map(el => Number(el.id) === Number(action.payload.id) ?
                ({ ...el, bonus_amount: +action.payload.bonus_amount, final_salary: Number(el.salary) + Number(action.payload.bonus_amount) - Number(el.fine_amount) })
                : el)

            state.moderation_salaries = data
        },
        updateSalaryFine: (state, action) => {
            const data = state.moderation_salaries.map(el => Number(el.id) === Number(action.payload.id) ?
                ({ ...el, fine_amount: +action.payload.fine_amount, final_salary: Number(el.salary) - Number(action.payload.fine_amount) + Number(el.bonus_amount) })
                : el)

            state.moderation_salaries = data
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchModerationSalaries.pending, (state) => {
                state.isPending = true
            })
            .addCase(fetchModerationSalaries.fulfilled, (state, action) => {
                state.isPending = false
                state.moderation_salaries = action.payload.map((el: any) => ({ ...el, final_salary: Number(el.salary) + Number(el.bonus_amount) - Number(el.fine_amount) }))
            })
    }
})

export const {
    updateSalaryBonus,
    updateSalaryFine
} = financeSlice.actions

export default financeSlice.reducer
