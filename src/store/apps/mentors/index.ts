import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IMentorsState } from 'src/types/apps/mentorsTypes'

// ** Fetch All Departments
export const fetchTeachersList = createAsyncThunk('mentors/fetchTeachersList', async (queryString?: any) => {
  return (await api.get(`auth/teachers/?` + queryString)).data
})

export const fetchTeacherdetail = createAsyncThunk('mentors/fetchTeacherdetail', async (id: number) => {
  return (await api.get(`auth/teachers/${id}`)).data
})

export const createTeacher = createAsyncThunk('mentors/createTeacher', async (values: any, { rejectWithValue }) => {
  try {
    const response = await api.post(`auth/create/teacher/`, values)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const updateTeacher = createAsyncThunk(
  'mentors/createTeacher',
  async ({ data, id }: any, { rejectWithValue }) => {
    try {
      const response = await api.patch(`auth/teachers/${id}/`, data)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const deleteTeacher = createAsyncThunk(
  'mentors/deleteTeacher',
  async (id: number | any, { rejectWithValue }) => {
    try {
      const resp = await api.delete(`auth/delete/employee/${id}/`)
      return resp.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

const initialState: IMentorsState = {
  openEdit: null,
  openSms:false,
  teachers: [],
  teachersCount: 0,
  queryParams: { page: 1, status: 'active' },
  teacherData: null,
  isLoading: false
}

export const mentorsSlice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    setOpenEdit: (state, action) => {
      state.openEdit = action.payload
    },
    setOpenSms: (state, action) => {
      state.openSms = action.payload
    },
    updateParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    setTeacherData: (state, action) => {
      state.teacherData = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTeachersList.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchTeachersList.fulfilled, (state, action) => {
        state.teachers = action.payload.results
        ;(state.teachersCount = action.payload.count), (state.isLoading = false)
      })
      .addCase(fetchTeachersList.rejected, state => {
        state.isLoading = false
      })
      .addCase(createTeacher.fulfilled, state => {
        state.openEdit = null
      })
      .addCase(fetchTeacherdetail.fulfilled, (state, action) => {
        state.teacherData = action.payload
      })
  }
})

export const {setOpenSms, setOpenEdit, setTeacherData, updateParams } = mentorsSlice.actions

export default mentorsSlice.reducer
