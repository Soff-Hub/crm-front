import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IStudentState, StudentsQueryParamsTypes } from 'src/types/apps/studentsTypes'

// ** Fetch All Departments
export const fetchStudentsList = createAsyncThunk(
  'students/fetchStudentsList',
  async (params?: StudentsQueryParamsTypes | undefined) => {
    return (await api.get(`auth/students-list/`, { params })).data
  }
)

export const fetchStudentDetail = createAsyncThunk('students/fetchStudentDetail', async (id: number) => {
  return (await api.get(`auth/student/detail/${id}`)).data
})

export const createStudent = createAsyncThunk('students/createStudent', async (values: any, { rejectWithValue }) => {
  try {
    const response = await api.post(`auth/student-create/`, values)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const fetchGroupCheckList = createAsyncThunk('fetchGroupCheckList', async () => {
  return (await api.get(`common/group-check-list/`)).data
})

export const updateStudent = createAsyncThunk('students/updateStudent', async (valuess: any, { rejectWithValue }) => {
  try {
    const response = await api.patch(`auth/student/update/${valuess.id}`, valuess)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const deleteStudent = createAsyncThunk('students/deleteStudent', async (pk: number | any) => {
  return (await api.delete(`auth/student/destroy/${pk}/`)).data
})

export const fetchStudentPayment = createAsyncThunk('students/fetchStudentPayment', async (id: any) => {
  return (await api.get(`common/student-payment/list/${id}/`)).data
})

export const searchStudent = createAsyncThunk('students/searchStudent', async (search?: string) => {
  return (await api.get(`auth/student/list/`, { params: { search } })).data?.results
})

const initialState: IStudentState = {
  openEdit: null,
  groups: [],
  students: [],
  studentsCount: 0,
  studentData: null,
  isLoading: false,
  queryParams: { status: 'active', is_debtor: '', group_status: '', offset: '0', },
  payments: [],
  global_pay: false
}

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setOpenEdit: (state, action) => {
      state.openEdit = action.payload
      state.studentData = null
    },
    setStudentData: (state, action) => {
      state.studentData = action.payload
    },
    updateStudentParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    clearStudentParams: state => {
      state.queryParams = { status: 'active' }
    },
    setGlobalPay: (state, action) => {
      state.global_pay = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudentsList.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchStudentsList.fulfilled, (state, action) => {
        state.students = action.payload.results
        state.studentsCount = Math.ceil(action.payload.count)
        state.isLoading = false
      })
      .addCase(fetchStudentsList.rejected, state => {
        state.isLoading = false
      })
      .addCase(createStudent.fulfilled, state => {
        state.openEdit = null
      })
      .addCase(fetchStudentDetail.fulfilled, (state, action) => {
        state.studentData = action.payload
      })
      .addCase(fetchStudentPayment.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchStudentPayment.fulfilled, (state, action) => {
        state.payments = action.payload
        state.isLoading = false
      })
      .addCase(fetchGroupCheckList.fulfilled, (state, action) => {
        state.groups = action.payload
      })
  }
})

export const { setOpenEdit, setStudentData, updateStudentParams, clearStudentParams, setGlobalPay } =
  studentsSlice.actions

export default studentsSlice.reducer
