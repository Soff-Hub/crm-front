// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import api from 'src/@core/utils/api'
import { CreatesDepartmentState, LeadsQueryParamsTypes } from 'src/types/apps/leadsTypes'
import { IMentorsState } from 'src/types/apps/mentorsTypes'

// ** Fetch All Departments
export const fetchDepartmentList = createAsyncThunk(
  'appChat/fetchDepartmentList',
  async (params?: LeadsQueryParamsTypes | undefined) => {
    const resp = await api.get(`leads/department/list/?`, { params })
    console.log(resp.data)
    console.log(params)

    if (params && params?.search !== '') {
      console.log(...resp.data.map((el: any) => el?.children.filter((item: any) => item?.student_count > 0)))

      return resp.data
    } else {
      return resp.data
    }
  }
)

// ** Fetch All Sources
export const fetchSources = createAsyncThunk('appChat/fetchSources', async () => {
  return (await api.get(`leads/source/`)).data.results
})

// ** Create Departments
export const createDepartment = createAsyncThunk('appChat/createDepartment', async (values: CreatesDepartmentState) => {
  return (await api.post(`leads/department/create/`, values)).data
})

// ** Create Departments
export const editDepartment = createAsyncThunk(
  'appChat/editDepartment',
  async (values: { name?: string; id: any; is_active?: boolean }) => {
    return (await api.patch(`leads/department-update/${values.id}`, values)).data
  }
)

// ** Create Department Item
export const createDepartmentItem = createAsyncThunk(
  'appChat/createDepartmentItem',
  async (values: CreatesDepartmentState) => {
    return (await api.post(`leads/department/create/`, values)).data
  }
)

// ** Create Department User
export const createDepartmentStudent = createAsyncThunk(
  'appChat/createDepartmentStudent',
  async (values: CreatesDepartmentState) => {
    return (await api.post(`leads/department-user-create/`, values)).data
  }
)

const initialState: IMentorsState = {
  openEdit: false
}

export const mentorsSlice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {
    setOpenEdit: (state, action) => {
      state.openEdit = action.payload
    }
  },
  extraReducers: builder => {}
})

export const { setOpenEdit } = mentorsSlice.actions

export default mentorsSlice.reducer
