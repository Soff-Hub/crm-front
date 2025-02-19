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
    const resp = await api.get(`common/group/students/?group=${id}&` + queryString)
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
export const getAttendanceTeacher = createAsyncThunk(
  'getAttendanceTeacher/getAttendanceTeacher',
  async ({ date, group, queryString }: { date: string; group: string | string[] | undefined; queryString: string }) => {
    const resp = await api.get(`common/attendance-list/${date}/group/${group}/?` + queryString)
    return resp.data
  }
)
export const getStudentsGrades = createAsyncThunk(
  'getStudentsGrades/getStudentsGrades',
  async ({ id, queryString }: { id: any; queryString?: string }) => {
    const resp = await api.get(`common/group-student/rating/list/${id}/?${queryString}`);
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
export const deleteNote = createAsyncThunk('delete/Note', async (id: any, { rejectWithValue }) => {
  try {
    const resp = await api.delete(`/common/group-description/delete/${id}`)
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

export const getExams = createAsyncThunk('getExams', async (id: string | string[] | undefined) => {
  const resp = await api.get('common/exam/' + id)
  return resp.data
})
export const getResults = createAsyncThunk(
  'getResults',
  async ({ groupId, examId }: { groupId: string | string[] | undefined; examId: string }) => {
    const resp = await api.get(`common/exam/student/result/${examId}/group/${groupId}/`)
    return resp.data
  }
)

const initialState: IGroupDetailsState = {
  courses: null,
  exams: null,
  open: null,
  groupData: null,
  smsTemps: null,
  teachers: null,
  isOpenDelete: null,
  students: null,
  meet_link:null,
  attendance: null,
  grades: null,
  days: null,
  onlineLessonLoading:false,
  rooms: null,
  results: null,
  updateStatusModal:null,
  resultId: null,
  examStudentId: null,
  editData: null,
  openEdit: null,
  gradeQueryParams: '',
  queryParams: {
    status: 'active,new'
  },
  studentsQueryParams: {
    status: 'active,new'
  },
  isGettingGroupDetails: false,
  isGettingDays: false,
  isGettingStudents: false,
  isGettingExams: false,
  isGettingAttendance: false,
  isGettingGrades: false,
  isGettingExamsResults: false,
  openLeadModal: null,
  month_list: [],
  isLesson: false
}

export const groupDetailsSlice = createSlice({
  name: 'groupDetails',
  initialState,
  reducers: {
    setMeetLink: (state, action) => {
      state.meet_link = action.payload
    },
    setOnlineLessonLoading: (state, action) => {
      state.onlineLessonLoading = action.payload
    },
    setResultEdit: (state, action) => {
      state.examStudentId = action.payload
    },
    setUpdateStatusModal: (state, action) => {
      state.updateStatusModal = action.payload
    },
    setDays: (state, action) => {
      state.days = action.payload
    },
    setOpenLeadModal: (state, action) => {
      state.openLeadModal = action.payload
    },
    setGettingGroupDetails: (state, action) => {
      state.isGettingGroupDetails = action.payload
    },
    handleEditClickOpen: (state, action) => {
      state.openEdit = action.payload
    },
    setOpen: (state, action) => {
      state.open = action.payload
    },
    setEditData: (state, action) => {
      state.editData = action.payload
    },
    handleOpenDeleteNote: (state, action) => {
      state.isOpenDelete = action.payload
    },
    setResultId: (state, action) => {
      state.resultId = action.payload
    },
    updateParams: (state, action) => {
      state.queryParams = { ...state.queryParams, ...action.payload }
    },
    updateGradeParams: (state, action) => {
      state.gradeQueryParams = { ...state.gradeQueryParams, ...action.payload }
    },
    studentsUpdateParams: (state, action) => {
      state.studentsQueryParams = { ...state.studentsQueryParams, ...action.payload }
    },
    setGettingAttendance: (state, action) => {
      state.isGettingAttendance = action.payload
    },
    setGettingGrades: (state, action) => {
      state.isGettingGrades = action.payload
    },
    resetStore: state => {
      state.groupData = null
      state.students = null
      state.attendance = null
      state.days = null
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
      state.students = action.payload?.response
      state.isLesson = action.payload?.is_lesson_days
      state.isGettingStudents = false
    })
    builder.addCase(getStudents.rejected, state => {
      state.isGettingStudents = false
    })
    builder.addCase(getAttendance.pending, (state, action) => {
      state.isGettingAttendance = true
    })
    builder.addCase(getAttendance.fulfilled, (state, action) => {
      state.attendance = action.payload
      state.isGettingAttendance = false
    })
    builder.addCase(getAttendance.rejected, (state, action) => {
      state.isGettingAttendance = false
    })
    builder.addCase(getAttendanceTeacher.pending, (state, action) => {
      state.isGettingAttendance = true
    })
    builder.addCase(getAttendanceTeacher.fulfilled, (state, action) => {
      state.attendance = action.payload
      state.isGettingAttendance = false
    })
    builder.addCase(getAttendanceTeacher.rejected, (state, action) => {
      state.isGettingAttendance = false
    })
    builder.addCase(getStudentsGrades.pending, (state, action) => {
      state.isGettingGrades = true
    })
    builder.addCase(getStudentsGrades.fulfilled, (state, action) => {
      state.grades = action.payload
      state.isGettingGrades = false
    })
    builder.addCase(getStudentsGrades.rejected, (state, action) => {
      state.isGettingGrades = false
    })
    builder.addCase(getDays.fulfilled, (state, action) => {
      state.days = action.payload?.result
      state.month_list = action.payload?.months
    })
    builder.addCase(getExams.pending, state => {
      state.isGettingExams = true
    })
    builder.addCase(getExams.fulfilled, (state, action) => {
      state.exams = action.payload
      state.isGettingExams = false
    })
    builder.addCase(getResults.pending, state => {
      state.isGettingExamsResults = true
    })
    builder.addCase(getResults.fulfilled, (state, action) => {
      state.results = action.payload
      state.isGettingExamsResults = false
    })
    builder.addCase(getSMSTemp.fulfilled, (state, action) => {
      state.smsTemps = action.payload
    })
  }
})

export const {
  handleEditClickOpen,
  handleOpenDeleteNote,
  updateParams,
  resetStore,
  updateGradeParams,
  studentsUpdateParams,
  setGettingAttendance,
  setGettingGrades,
  setOpen,
  setUpdateStatusModal,
  setEditData,
  setMeetLink,
  setResultEdit,
  setResultId,
  setOnlineLessonLoading,
  setOpenLeadModal,
  setDays,
  setGettingGroupDetails
} = groupDetailsSlice.actions

export default groupDetailsSlice.reducer
