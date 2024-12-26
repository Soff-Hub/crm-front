// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { today } from 'src/@core/components/card-statistics/kanban-item'
import api from 'src/@core/utils/api'
import { AllNumbersParams, IFinanceState } from 'src/types/apps/finance'

export const fetchModerationSalaries = createAsyncThunk('finance/fetchModerationSalaries', async (params?: string) => {
  return (await api.get('/finance/employee-salaries/?' + params)).data
})
export const fetchCalculatedSalary = createAsyncThunk(
  'finance/fetchCalculatedSalary',
  async (data: { id: number; queryParams?: string }) => {
    return (await api.get(`/finance/calculated-salary/${data.id}/?` + data.queryParams)).data
  }
)

export const createSms = createAsyncThunk('finance/createSms', async (data: { description: string }) => {
  return (await api.post('common/sms-form/create/', data)).data
})

export const editSms = createAsyncThunk('finance/editSms', async (data: { description: string; id: number }) => {
  return (await api.patch(`common/sms-form/update/${data?.id}`, data)).data
})

export const fetchFinanceAllNumbers = createAsyncThunk(
  'finance/fetchFinanceAllNumbers',
  async (params?: AllNumbersParams) => {
    return (await api.get('finance/dashboard/', { params })).data
  }
)

export const getExpenseCategories = createAsyncThunk('getExpenseCategories', async (params: any = '') => {
  return (await api.get('finance/budget-category/list/?status=expense', { params })).data
})
export const getIncomeCategories = createAsyncThunk('getIncomeCategories', async (params: any = '') => {
  return (await api.get('finance/budget-category/list/?status=income', { params })).data
})

export const getGroupsFinance = createAsyncThunk('getGroupsFinance', async (params: any = '') => {
  const response = await api.get(`/finance/group-payments/?`, { params })
  return { ...response.data }
})

const initialState: IFinanceState = {
  isPending: false,
  isGettingGroupsFinance: false,
  moderation_salaries: [],
  categoriesData: [],
  incomeCategoriesData:[],
  groupsFinance: [],
  calculatedSalary: null,
  isGettingCalculatedSalary: false,
  all_numbers: undefined,
  numbersLoad: false,
  isGettingExpenseCategories: false,
  isGettingIncomeCategories: false,
  allNumbersParams: {
    date_year: `${new Date().getFullYear()}-01-01`,
    date_month: today.split('-')[1],
    start_date: '',
    end_date: '',
    branch: ''
  },
  is_update: false
}

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    updateSalaryBonus: (state, action) => {
      const data = state.moderation_salaries.map(el =>
        Number(el.id) === Number(action.payload.id)
          ? {
            ...el,
            bonus_amount: +action.payload.bonus_amount,
            final_salary: Number(el.salary) + Number(action.payload.bonus_amount) - Number(el.fine_amount)
          }
          : el
      )

      state.moderation_salaries = data
    },
    updateSalaryFine: (state, action) => {
      const data = state.moderation_salaries.map(el =>
        Number(el.id) === Number(action.payload.id)
          ? {
            ...el,
            fine_amount: +action.payload.fine_amount,
            final_salary: Number(el.salary) - Number(action.payload.fine_amount) + Number(el.bonus_amount)
          }
          : el
      )

      state.moderation_salaries = data
    },
    updateNumberParams: (state, action) => {
      const newParams = { ...state.allNumbersParams, ...action.payload }
      state.allNumbersParams = newParams
    },
    setCalculatedSalary: (state, action) => {
      state.calculatedSalary = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchModerationSalaries.pending, state => {
        state.isPending = true
      })
      .addCase(fetchModerationSalaries.fulfilled, (state, action) => {
        state.isPending = false
        state.is_update = action.payload.is_update
        state.moderation_salaries = action.payload?.response.map((el: any) => ({
          ...el,
          final_salary: Number(el.salary) + Number(el.bonus_amount) - Number(el.fine_amount)
        }))
        state.is_update = action.payload?.is_update
      })
      .addCase(fetchFinanceAllNumbers.pending, state => {
        state.numbersLoad = true
      })
      .addCase(fetchFinanceAllNumbers.fulfilled, (state, action) => {
        state.all_numbers = action.payload
        state.numbersLoad = false
      })
      .addCase(getExpenseCategories.pending, state => {
        state.isGettingExpenseCategories = true
      })
      .addCase(getExpenseCategories.fulfilled, (state, action) => {
        state.categoriesData = action.payload
        state.isGettingExpenseCategories = false
      })
      .addCase(getIncomeCategories.pending, state => {
        state.isGettingIncomeCategories = true
      })
      .addCase(getIncomeCategories.fulfilled, (state, action) => {
        state.incomeCategoriesData = action.payload
        state.isGettingIncomeCategories = false
      })
      .addCase(getGroupsFinance.pending, state => {
        state.isGettingGroupsFinance = true
      })
      .addCase(getGroupsFinance.fulfilled, (state, action) => {
        state.groupsFinance = action.payload
        state.isGettingGroupsFinance = false
      })
      .addCase(fetchCalculatedSalary.pending, state => {
        state.isGettingCalculatedSalary = true
      })
      .addCase(fetchCalculatedSalary.fulfilled, (state, action) => {
        state.calculatedSalary = action.payload
        state.isGettingCalculatedSalary = false
      })
      .addCase(fetchCalculatedSalary.rejected, state => {
        state.isGettingCalculatedSalary = false
      })
  }
})

export const { setCalculatedSalary, updateSalaryBonus, updateSalaryFine, updateNumberParams } = financeSlice.actions

export default financeSlice.reducer
