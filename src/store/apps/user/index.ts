// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import api from 'src/@core/utils/api'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  const response = await axios.get('/apps/users/list', {
    params
  })

  return response.data
})

export const fetchNotification = createAsyncThunk('appUsers/fetchNotification', async () => {
  const response = await api.get('/common/notification-list/')
  return response.data
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post('/apps/users/add-user', {
      data
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/users/delete', {
      data: id
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    notifications: [],
    isGettingNotification: false,
    notificationsCount: 0,
    total: null,
    params: {},
    allData: [],
    companyInfo: {
      id: 1,
      training_center_name: 'SOFF CRM',
      logo: '/images/default-logo.jpg',
      work_start_time: '00:00',
      work_end_time: '00:00',
      auto_sms: {
        id: 1,
        on_absent: true,
        birthday_text: 'Text',
        on_birthday: true,
        absent_text: 'Text',
        payment_warning: true,
        payment_text:"Text"
      },
      sms_limit: '0/0'
    },
    departmentsState: []
  },
  reducers: {
    addUserData: (state, action) => {
      state.data = action.payload
    },
    setNotifications: (state, action) => {
      state.notificationsCount = action.payload
    },
    addOpenedUser: (state, action) => {
      state.total = action.payload
    },
    setCompanyInfo: (state, action) => {
      state.companyInfo = {
        ...action.payload,
        work_start_time: `${action.payload.work_start_time.split(':')?.[0]}:${
          action.payload.work_start_time.split(':')?.[1]
        }`,
        work_end_time: `${action.payload.work_end_time.split(':')?.[0]}:${action.payload.work_end_time.split(':')?.[1]}`
      }
    },
    setDepartmentsState: (state, action) => {
      state.departmentsState = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
    builder.addCase(fetchNotification.pending, (state, action) => {
      state.isGettingNotification = true
    })
    builder.addCase(fetchNotification.fulfilled, (state, action) => {
      state.notifications = action.payload
      state.isGettingNotification = false
    })
    builder.addCase(fetchNotification.rejected, (state, action) => {
      state.isGettingNotification = false
    })
  }
})

export const { setNotifications, addUserData, addOpenedUser, setCompanyInfo, setDepartmentsState } =
  appUsersSlice.actions
export default appUsersSlice.reducer
