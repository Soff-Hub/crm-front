import { AttendanceInitialType, AttendanceQueryType } from './../../../types/apps/attendanceTypes'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api' // Adjust the import as necessary
import ceoConfigs from 'src/configs/ceo'

const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return {
    date_year: `${year}-${month}-${day}`,
    date_month: `${year}-${month}-${day}`
  }
}

export const fetchAttendances = createAsyncThunk('attendances/fetchAttendances', async (queryString: string) => {
  const response = await api.get(ceoConfigs.attendances + '?' + queryString)

  return response.data.result
})

const initialState: AttendanceInitialType = {
  attandance: [],
  queryParams: {
    branch: '',
    teacher: '',
    ...getCurrentDate(),
    date: '',
    status: 'active'
  },
  isLoading: false,
  error: ''
}

export const attendanceSlice = createSlice({
  name: 'attendances',
  initialState,
  reducers: {
    updateQueryParam: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    resetQueryParams: state => {
      state.queryParams = {
        branch: '',
        teacher: '',
        date: '',
        ...getCurrentDate(),
        status: 'active'
      }
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAttendances.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.attandance = action.payload
        state.isLoading = false
      })
  }
})

export const { updateQueryParam, resetQueryParams } = attendanceSlice.actions
export default attendanceSlice.reducer
