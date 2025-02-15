// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import { RoomType, SettingsState, SmsItemType } from 'src/types/apps/settings'

export const fetchSmsListQuery = createAsyncThunk('settings/fetchSmsListQuery', async (queryString?: number) => {
  return (await api.get(`common/sms-form/list/?parent_id=${queryString || ''}`)).data
})

export const fetchSmsList = createAsyncThunk('settings/fetchSmsList', async () => {
  return (await api.get(`common/sms-form/list/`)).data
})

export const createSms = createAsyncThunk(
  'settings/createSms',
  async (data: { description: string }, { rejectWithValue }) => {
    try {
      return (await api.post(`common/sms-form/create/`, data)).data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const editSms = createAsyncThunk('settings/editSms', async (data: { description: string; id: number }) => {
  return (await api.patch(`common/sms-form/update/${data?.id}`, data)).data
})

export const fetchCoursesList = createAsyncThunk('settings/fetchCoursesList', async (queryString: string = '') => {
  return (await api.get('common/courses/?' + queryString)).data
})

export const createGroup = createAsyncThunk('settings/createGroup', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post(`common/course/create`, data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const editCourse = createAsyncThunk('settings/editCourse', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.patch(`common/course/update/${data.id}`, data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})
export const editEmployeeStatus = createAsyncThunk(
  'settings/editEmployeeStatus',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.patch(ceoConfigs.update_employee_status + data.id, data.data)
      return response.data
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const fetchRoomList = createAsyncThunk('settings/fetchRoomList', async (params?: any) => {
  return (await api.get('common/rooms/', { params })).data
})
export const fetchSchoolList = createAsyncThunk('settings/fetchSchoolList', async (params?: any) => {
  return (await api.get('common/schools/', { params })).data
})

export const fetchSchoolsList = createAsyncThunk('settings/fetchSchoolsList', async () => {
  return (await api.get('common/schools/')).data
})

export const createRoom = createAsyncThunk('settings/createRoom', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post(`common/room/create`, data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const editRoom = createAsyncThunk('settings/editRoom', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.patch(`common/room/update/${data.id}`, data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const fetchWekends = createAsyncThunk('settings/fetchWekends', async () => {
  return (await api.get('common/weekend/list/')).data
})

export const createWekend = createAsyncThunk('settings/createWekend', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post(`common/weekend/create/`, data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const updateWekend = createAsyncThunk('settings/updateWekend', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.patch(`common/weekend/update/${data.id}/`, data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const fetchEmployees = createAsyncThunk(
  'settings/fetchEmployees',
  async (params: { search: string; page: number; role: number | string; status: string }) => {
    return (await api.get(ceoConfigs.employee, { params })).data
  }
)

export const createEmployee = createAsyncThunk('settings/createEmployee', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.post(`employee/create/`, data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const editEmployee = createAsyncThunk('settings/editEmployee', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.patch(ceoConfigs.employee_update + data.id, data.data)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

const initialState: SettingsState = {
  is_pending: false,
  isGettingSchools:false,
  employee_id: null,
  openSms: null,
  logins:null,
  is_childpending: false,
  sms_list: [],
  smschild_list: [],
  openCreateSms: false,
  openCreateSmsCategory: false,
  openEditSms: null,
  course_list: { count: 0, results: [], is_lesson_count: false },
  openEditCourse: null,
  rooms: [],
  schools: [],
  openEditRoom: null,
  openEditSchool:null,
  room_count: 0,
  school_count:0,
  active_page: 1,
  schoolQueryParams:{page:1},
  wekends: [],
  wekendData: null,
  employees: [],
  employeeData: null,
  employees_count: 0,
  queryParams: {
    search: '',
    page: 1,
    role: '',
    status: 'active'
  },
  courseQueryParams: {
    page: 1
  },
  roles: [],
  videoAnchor: {
    open: false,
    title: '',
    url: ''
  }
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setEmployeeId: (state, action) => {
      state.employee_id = action.payload
    },
    updateParams: (state, action) => {
      state.courseQueryParams = action.payload
    },
    updateSchoolParams: (state, action) => {
      state.schoolQueryParams = action.payload
    },
    setOpenSms: (state, action) => {
      state.openSms = action.payload
    },
    setOpenCreateSms: (state, action) => {
      state.openCreateSms = action.payload
    },
    setOpenCreateSmsCategory: (state, action) => {
      state.openCreateSmsCategory = action.payload
    },
    setOpenEditSms: (state, action) => {
      state.openEditSms = action.payload
    },
    setOpenEditCourse: (state, action) => {
      state.openEditCourse = action.payload
    },
    setOpenEditSchool: (state, action) => {
      state.openEditSchool = action.payload
    },
    setOpenEditRoom: (state, action) => {
      state.openEditRoom = action.payload
    },
    updatePage: (state, action) => {
      state.active_page = action.payload
    },
    setWekendData: (state, action) => {
      state.wekendData = action.payload
    },
    setEmployeeData: (state, action) => {
      state.employeeData = action.payload
    },
    updateQueryParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    openVideoModal: (state, action) => {
      state.videoAnchor = action.payload
    },
    closeVideoModal: state => {
      state.videoAnchor = {
        open: false,
        title: '',
        url: ''
      }
    },
    setLogins: (state, action) => {
      state.logins = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSmsList.pending, state => {
        state.is_pending = true
      })
      .addCase(fetchSmsList.fulfilled, (state, action) => {
        state.is_pending = false
        state.sms_list = action.payload.sort((a: SmsItemType, b: SmsItemType) => a.id - b.id)
      })
      .addCase(fetchSmsListQuery.pending, state => {
        state.is_childpending = true
      })
      .addCase(fetchSmsListQuery.fulfilled, (state, action) => {
        state.is_childpending = false
        state.smschild_list = action.payload.sort((a: SmsItemType, b: SmsItemType) => a.id - b.id)
      })
      .addCase(createSms.fulfilled, (state, action) => {
        state.sms_list.push(action.payload)
      })
      .addCase(editSms.fulfilled, (state, action) => {
        state.sms_list = [...state.sms_list.filter(el => el.id !== action.payload.id), action.payload].sort(
          (a: SmsItemType, b: SmsItemType) => a.id - b.id
        )
      })
      .addCase(fetchCoursesList.pending, state => {
        state.is_pending = true
      })
      .addCase(fetchCoursesList.fulfilled, (state, action) => {
        state.is_pending = false
        state.course_list = action.payload
      })
      .addCase(fetchRoomList.pending, state => {
        state.is_pending = true
      })
      .addCase(fetchRoomList.fulfilled, (state, action) => {
        state.is_pending = false
        state.rooms = action.payload?.results.sort((a: RoomType, b: RoomType) => a.id - b.id)
        state.room_count = Math.ceil(action.payload.count / 10)
      })
      .addCase(fetchSchoolList.pending, state => {
        state.isGettingSchools = true
      })
      .addCase(fetchSchoolList.fulfilled, (state, action) => {
        state.isGettingSchools = false
        state.schools = action.payload?.results.sort((a: RoomType, b: RoomType) => a.id - b.id)
        state.school_count = Math.ceil(action.payload.count / 10)
      })
      .addCase(fetchSchoolsList.pending, state => {
        state.isGettingSchools = true
      })
      .addCase(fetchSchoolsList.fulfilled, (state, action) => {
        state.isGettingSchools = false
        state.schools = action.payload?.results.sort((a: RoomType, b: RoomType) => a.id - b.id)
        state.school_count = Math.ceil(action.payload.count / 10)
      })
      .addCase(fetchWekends.pending, state => {
        state.is_pending = true
      })
      .addCase(fetchWekends.fulfilled, (state, action) => {
        state.is_pending = false
        state.wekends = action.payload
      })
      .addCase(fetchEmployees.pending, state => {
        state.is_pending = true
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.is_pending = false
        state.employees = action.payload?.results
        state.employees_count = action.payload.count
        state.roles = action.payload.roles
      })
  }
})

export const {
  setOpenCreateSmsCategory,
  setOpenCreateSms,
  setOpenEditSms,
  setOpenEditCourse,
  setOpenEditRoom,
  updatePage,
  setWekendData,
  setEmployeeData,
  updateParams,
  setLogins,
  updateQueryParams,
  closeVideoModal,
  openVideoModal,
  setOpenSms,
  setEmployeeId,
  setOpenEditSchool,
  updateSchoolParams
} = settingsSlice.actions

export default settingsSlice.reducer
