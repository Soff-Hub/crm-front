import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'

export const fetchInvestments = createAsyncThunk<any, string | undefined>(
  'finance/fetchInvestments',
  async (queryString, { rejectWithValue }) => {
    try {
      const response = await api.get('finance/investment/list/?' + queryString)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const currentYear = new Date().getFullYear()
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')

const initialState = {
  queryParams: { page: 1, date_year: `${currentYear}-01-01`, date_month: `${currentYear}-${currentMonth}-01` },
  investments: [],
  totalInvestments: 0,
  openEdit: null,
  isLoading: false,
  error: null as unknown
}

export const investmentSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setOpenEdit: (state, action) => {
      state.openEdit = action.payload
    },
    updateParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchInvestments.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.isLoading = false
        state.investments = action.payload.results
        state.totalInvestments = action.payload.totalInvestments
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { updateParams, setOpenEdit } = investmentSlice.actions

export default investmentSlice.reducer
