import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IStudentState, StudentsQueryParamsTypes } from 'src/types/apps/studentsTypes'

// ** Fetch All Departments
export const fetchStudentsList = createAsyncThunk(
  'students/fetchStudentsList',
  async (params?: StudentsQueryParamsTypes | undefined) => {
    return (await api.get(`student/offset-list/`, { params })).data
  }
)

export const fetchStudentDetail = createAsyncThunk('students/fetchStudentDetail', async (id: number) => {
  return (await api.get(`student/detail/${id}`)).data
})
export const fetchStudentGroups = createAsyncThunk('students/fetchStudentGroups', async (id: any) => {
  return (await api.get(`student/groups/${id}`)).data
})

export const fetchStudentComments = createAsyncThunk('students/fetchStudentComments', async (id: any) => {
  return (await api.get(`student/notes/?user=${id}`)).data
})


export const createStudent = createAsyncThunk('students/createStudent', async (values: any, { rejectWithValue }) => {
  try {
    const response = await api.post(`student/create/`, values)
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
    const response = await api.patch(`student/update/${valuess.id}`, valuess)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const deleteStudent = createAsyncThunk('students/deleteStudent', async (pk: number | any) => {
  return (await api.delete(`student/destroy/${pk}/`)).data
})

export const fetchStudentPayment = createAsyncThunk('students/fetchStudentPayment', async (id: any) => {
  return (await api.get(`common/student-payment/list/${id}/`)).data
})

export const searchStudent = createAsyncThunk('students/searchStudent', async (search?: string) => {
  return (await api.get(`student/list/`, { params: { search } })).data?.results
})

const initialState: IStudentState = {
  openEdit: null,
  groups: [],
  comments:[],
  studentGroups:[],
  studentId:null,
  students: [],
  studentsCount: 0,
  studentData: null,
  isGettingStudentsGroups:false,
  isLoading: false,
  queryParams: { status: 'active', is_debtor: '', group_status: '', offset: '0',teacher:'' },
  payments: [],
  global_pay: false,
  openLeadModal: null,
}

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setOpenLeadModal: (state, action) => {
      state.openLeadModal = action.payload
    },
    setIsGettingStudentGroups: (state, action) => {
      state.isGettingStudentsGroups = action.payload
    },
    setStudentId: (state, action) => {
      state.studentId = action.payload
    },
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
      .addCase(fetchStudentGroups.pending, state => {
        state.isGettingStudentsGroups = true
      })
      .addCase(fetchStudentGroups.fulfilled, (state, action) => {
        state.studentGroups = action.payload
        state.isGettingStudentsGroups = false
      })
      .addCase(fetchStudentComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })
      .addCase(fetchGroupCheckList.fulfilled, (state, action) => {
        state.groups = action.payload
      })
  }
})

export const { setOpenEdit,setIsGettingStudentGroups,setOpenLeadModal,setStudentId, setStudentData, updateStudentParams, clearStudentParams, setGlobalPay } =
  studentsSlice.actions

export default studentsSlice.reducer
