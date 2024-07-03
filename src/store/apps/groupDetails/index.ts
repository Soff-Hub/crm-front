import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import { IGroupDetailsState } from 'src/types/apps/groupDetailsTypes'

export const getGroupById = createAsyncThunk('groupDetails/fetchDetails', async (id: string | string[] | undefined) => {
  const resp = await api.get(ceoConfigs.groups_detail + id)
  return resp.data
})
export const getSubData = createAsyncThunk('groupTeacher/fetchTeacher', async () => {
  const [teachers, courses, rooms] = await Promise.all([
    api.get(ceoConfigs.teachers),
    api.get(ceoConfigs.courses),
    api.get(ceoConfigs.rooms)
  ])
  return { courses: courses.data.results, teachers: teachers.data.results, rooms: rooms.data.results }
})
export const updateGroup = createAsyncThunk('updateGroup/fetchGroup', async (id: any, data: any) => {
  const resp = await api.patch(ceoConfigs.groups_update + id, data)
  return resp.data
})
export const getStudents = createAsyncThunk(
  'getStudents/getStudents',
  async ({ id, queryString }: { id: string | string[] | undefined; queryString: string }) => {
    const resp = await api.get(`common/group/students/${id}?` + queryString)
    return resp.data
  }
)
export const getAttendance = createAsyncThunk(
  'getAttendance/getAttendance',
  async ({ date, group, queryString }: { date: string; group: string | string[] | undefined; queryString: string }) => {
    const resp = await api.get(`common/attendance-list/${date}-01/group/${group}/?` + queryString)
    return resp.data
  }
)
export const getDays = createAsyncThunk(
  'getDays/getDays',
  async ({ date, group }: { date: string; group: string | string[] | undefined }) => {
    const resp = await api.get(`common/day-of-week/${group}/date/${date}-01/`)
    return resp.data
  }
)
export const addStudentToGroup = createAsyncThunk('updateGroup/addStudent', async (data: any, { rejectWithValue }) => {
  try {
    const resp = await api.post(ceoConfigs.merge_student, data)
    return resp.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})
export const deleteGroup = createAsyncThunk('delete/group', async (id: any, { rejectWithValue }) => {
  try {
    const resp = await api.delete(`/common/group/delete/${id}`)
    return resp.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})
export const getSMSTemp = createAsyncThunk('getSMSTemp', async () => {
  const resp = await api.get('common/sms-form/list/')
  return resp.data
})

const initialState: IGroupDetailsState = {
  groupData: null,
  courses: null,
  smsTemps: null,
  teachers: null,
  students: null,
  attendance: null,
  days: null,
  rooms: null,
  openEdit: null,
  queryParams: {
    status: 'active,new'
  },
  studentsQueryParams: {
    status: 'active,new'
  },
  isGettingGroupDetails: false,
  isGettingStudents: false,
  isGettingAttendance: false
}

export const groupDetailsSlice = createSlice({
  name: 'groupDetails',
  initialState,
  reducers: {
    handleEditClickOpen: (state, action) => {
      state.openEdit = action.payload
    },
    updateParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    studentsUpdateParams: (state, action) => {
      state.studentsQueryParams = { ...state.studentsQueryParams, ...action.payload }
    },
    setGettingAttendance: (state, action) => {
      state.isGettingAttendance = action.payload
    },
    resetStore: state => {
      state.groupData = null
      state.students = null
      state.attendance = null
    }
  },

  extraReducers: builder => {
    builder.addCase(getSubData.fulfilled, (state, action) => {
      state.courses = action.payload.courses
      state.teachers = action.payload.teachers
      state.rooms = action.payload.rooms
    })
    builder.addCase(getGroupById.pending, state => {
      state.isGettingGroupDetails = true
    })
    builder.addCase(getGroupById.fulfilled, (state, action) => {
      state.groupData = action.payload
      state.isGettingGroupDetails = false
    })
    builder.addCase(getGroupById.rejected, state => {
      state.isGettingGroupDetails = false
    })
    builder.addCase(getStudents.pending, state => {
      state.isGettingStudents = true
    })
    builder.addCase(getStudents.fulfilled, (state, action) => {
      state.students = action.payload
      state.isGettingStudents = false
    })
    builder.addCase(getStudents.rejected, state => {
      state.isGettingStudents = false
    })
    builder.addCase(getAttendance.fulfilled, (state, action) => {
      state.attendance = action.payload
      state.isGettingAttendance = false
    })
    builder.addCase(getDays.fulfilled, (state, action) => {
      state.days = action.payload
    })
  }
})

export const { handleEditClickOpen, updateParams, resetStore, studentsUpdateParams, setGettingAttendance } =
  groupDetailsSlice.actions
export default groupDetailsSlice.reducer
