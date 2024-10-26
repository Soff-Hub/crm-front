import { AttendanceInitialType, AttendanceQueryType } from './../../../types/apps/attendanceTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api' // Adjust the import as necessary
import ceoConfigs from 'src/configs/ceo'

export const fetchAttendances = createAsyncThunk('attendances/fetchAttendances', async (queryString: string) => {
  const response = await api.get(ceoConfigs.attendances + "?" +queryString)
  console.log(response.data.result)

  return response.data.result
})

const initialState:AttendanceInitialType = {
  attandance: [],
  queryParams: {
    branch:"",
    teacher:"" ,
    date: "",
    date_year:"" ,
    date_month: "",
  },
  isLoading: false,
  error: ""
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
        date_year: '',
        date_month: ''
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
