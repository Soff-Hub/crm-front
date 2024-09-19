import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'

export const fetchStudentPaymentsList = createAsyncThunk('studentsPayment', async (queryString?: string) => {
  const { data } = await api.get(`common/student-payments/?${queryString || ''}`)
  return data
})
export const fetchGroupsList = createAsyncThunk('fetchGroupsList', async () => {
  const { data } = await api.get(`common/group-check-list/`)
  return data
})

type Payment = {
  admin: string
  amount: string
  description: string
  group: number
  group_name: string
  id: number
  payment_date: string
  payment_type: number
  payment_type_name: string
  student: number
}

interface IStudentsPaymentState {
  studentsPayment: Payment[]
  paymentsCount: number
  total_payments: number
  isLoading: boolean
  groups: any[]
  queryParams: { is_payment: boolean; page: number; group?: string; start_date?: string; end_date?: string }
}

const initialState: IStudentsPaymentState = {
  studentsPayment: [],
  groups: [],
  queryParams: { is_payment: true, page: 1 },
  paymentsCount: 0,
  total_payments: 0,
  isLoading: false
}

export const studentPaymentsSlice = createSlice({
  name: 'studentsPayment',
  initialState,
  reducers: {
    updateParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudentPaymentsList.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchStudentPaymentsList.fulfilled, (state, action) => {
        state.studentsPayment = action.payload.results
        state.total_payments = action.payload.total_payments
        state.paymentsCount = action.payload.count
        state.isLoading = false
      })
      .addCase(fetchGroupsList.fulfilled, (state, action) => {
        state.groups = action.payload
      })
      .addCase(fetchStudentPaymentsList.rejected, state => {
        state.isLoading = false
      })
  }
})

export const { updateParams } = studentPaymentsSlice.actions
export default studentPaymentsSlice.reducer
