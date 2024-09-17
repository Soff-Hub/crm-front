import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import { today } from 'src/@core/components/card-statistics/kanban-item'
import api from 'src/@core/utils/api'
import ceoConfigs from 'src/configs/ceo'
import { IGroupsState } from 'src/types/apps/groupsTypes'

export const getGroupsDetails = createAsyncThunk('groups/fetchGroupsDetails', async (id: any) => {
  const resp = await api.get(ceoConfigs.groups_detail + id)
  return resp.data
})

export const getMetaData = createAsyncThunk('groups/fetchMetaData', async () => {
  const responseCourse = await api.get('common/course/checklist/')
  const responseTeacher = await api.get(ceoConfigs.teachers)
  const responseRooms = await api.get(ceoConfigs.rooms)

  return {
    courses: responseCourse.data,
    teachers: responseTeacher.data.results,
    rooms: responseRooms.data.results
  }
})

export const createGroup = createAsyncThunk('groups/createGroup', async (values: any, { rejectWithValue }) => {
  try {
    const response = await api.post(ceoConfigs.groups_create, values)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const updateGroup = createAsyncThunk('groups/updateGroup', async ({ id, values }: any, { rejectWithValue }) => {
  try {
    const response = await api.patch(ceoConfigs.groups_update + id, values)
    return response.data
  } catch (err: any) {
    if (err.response) {
      return rejectWithValue(err.response.data)
    }
    return rejectWithValue(err.message)
  }
})

export const deleteGroups = createAsyncThunk(
  'groups/deleteGroups',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`common/group/delete/${id}`)
      return response
    } catch (err: any) {
      if (err.response) {
        return rejectWithValue(err.response.data)
      }
      return rejectWithValue(err.message)
    }
  }
)

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async (queryString: string = '') => {
  const resp = await api.get(ceoConfigs.groups + '?' + queryString)
  return resp.data
})

export const fetchGroupChecklist = createAsyncThunk('groups/fetchGroupChecklist', async () => {
  const resp = await api.get('common/group-check-list/')
  return resp.data
})

export const fetchTeacherSalaries = createAsyncThunk(
  'groups/fetchTeacherSalaries',
  async (queryString: string = '') => {
    const resp = await api.get('/auth/employee/salaries/' + '?' + queryString)
    return resp.data
  }
)

export const getDashboardLessons = createAsyncThunk('groups/fetchLessons', async (queryString: string = '') => {
  const response = await api.get(`common/dashboard/?` + queryString)
  return response.data
})

const currentDay: string = `${new Date()}`.split(' ')[0].toLocaleLowerCase()

const initialState: IGroupsState = {
  groups: null,
  groupChecklist: null,
  groupData: null,
  courses: null,
  teachers: null,
  teacherSalaries: null,
  rooms: null,
  dashboardLessons: [],
  workTime: [],
  exclude_time: {},
  groupCount: 0,
  isTableLoading: false,
  isOpenEdit: false,
  isOpenAddGroup: false,
  isDeleting: false,
  isUpdatingDashboard: false,
  isGettingGroupDetails: false,
  isLoading: false,
  myGroupParams: {
    page: 1
  },
  queryParams: {
    page: 1,
    status: 'active',
    is_recovery: false
  },
  formParams: {
    day_of_week:
      currentDay === 'mon' || currentDay === 'wed' || currentDay === 'fri'
        ? 'monday,wednesday,friday'
        : 'tuesday,thursday,saturday'
  },
  initialValues: {
    name: '',
    course: '',
    teacher: '',
    room: '',
    start_date: today,
    start_at: '',
    day_of_week:
      currentDay === 'mon' || currentDay === 'wed' || currentDay === 'fri'
        ? 'monday,wednesday,friday'
        : 'tuesday,thursday,saturday',
    end_at: ''
  }
}

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    handleOpenEdit: (state, action) => {
      state.isOpenEdit = action.payload
    },
    handleOpenAddModal: (state, action) => {
      state.isOpenAddGroup = action.payload
    },
    setGroupData: (state, action) => {
      state.groupData = action.payload
    },
    updateParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    updateMyGroupParams: (state, action) => {
      state.myGroupParams = { ...state.myGroupParams, ...action.payload }
    },
    resetGroupParams: state => {
      state.queryParams = { page: 1, status: 'active' }
    },
    updateFormParams: (state, action) => {
      state.formParams = { ...state.formParams, ...action.payload }
    },
    resetFormParams: state => {
      state.formParams = {
        day_of_week:
          currentDay === 'mon' || currentDay === 'wed' || currentDay === 'fri'
            ? 'monday,wednesday,friday'
            : 'tuesday,thursday,saturday'
      }
    }
  },

  extraReducers: builder => {
    builder.addCase(getMetaData.fulfilled, (state, action) => {
      state.courses = action.payload.courses
      state.teachers = action.payload.teachers
      state.rooms = action.payload.rooms
    })
    builder.addCase(getGroupsDetails.pending, state => {
      state.isGettingGroupDetails = true
    })
    builder.addCase(getGroupsDetails.fulfilled, (state, action) => {
      state.groupData = action.payload
      state.isGettingGroupDetails = false
    })
    builder.addCase(deleteGroups.pending, state => {
      state.isDeleting = true
    })
    builder.addCase(deleteGroups.fulfilled, state => {
      state.isDeleting = false
      toast.success("Guruhlar ro'yxatidan o'chirildi", { position: 'top-center' })
    })
    builder.addCase(deleteGroups.rejected, state => {
      state.isDeleting = false
    })
    builder.addCase(fetchGroups.pending, state => {
      state.isLoading = true
    })
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.groups = action.payload.results
      state.groupCount = action.payload.count
      state.isLoading = false
    })
    builder.addCase(fetchGroups.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createGroup.fulfilled, state => {
      state.isOpenAddGroup = false
    })
    builder.addCase(updateGroup.fulfilled, state => {
      state.isOpenEdit = false
      state.groupData = null
    })
    builder.addCase(getDashboardLessons.pending, state => {
      state.isUpdatingDashboard = true
    })
    builder.addCase(getDashboardLessons.fulfilled, (state, action) => {
      state.dashboardLessons = action.payload.room_list
      state.workTime = action.payload.work_time
      state.exclude_time = action.payload.exclude_time
      state.isUpdatingDashboard = false
    })
    builder.addCase(getDashboardLessons.rejected, state => {
      state.isUpdatingDashboard = false
    })
    builder.addCase(fetchTeacherSalaries.pending, (state, action) => {
      state.isTableLoading = true
    })
    builder.addCase(fetchTeacherSalaries.fulfilled, (state, action) => {
      state.teacherSalaries = action.payload
      state.isTableLoading = false
    })
    builder.addCase(fetchTeacherSalaries.rejected, (state, action) => {
      state.isTableLoading = false
    })
    builder.addCase(fetchGroupChecklist.fulfilled, (state, action) => {
      state.groupChecklist = action.payload
    })
  }
})

export const {
  handleOpenEdit,
  resetFormParams,
  updateFormParams,
  handleOpenAddModal,
  updateParams,
  setGroupData,
  resetGroupParams,
  updateMyGroupParams
} = groupsSlice.actions
export default groupsSlice.reducer
