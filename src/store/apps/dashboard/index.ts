import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/@core/utils/api'
import { IDashboardState, StatsDataType } from 'src/types/apps/dashboardTypes'

const currentWeek: string = `${new Date()}`.split(' ')[0].toLocaleLowerCase()

const statsData: StatsDataType[] = [
  {
    icon: 'mdi:user-check-outline',
    title: 'Faol Lidlar',
    color: 'success',
    key: 'leads_count',
    link: '/lids'
  },
  {
    icon: 'arcticons:studentid',
    title: 'Faol talabalar',
    color: 'info',
    key: 'active_students',
    link: '/students'
  },
  {
    icon: 'la:layer-group',
    title: 'Guruhlar',
    color: 'warning',
    key: 'active_groups',
    link: '/groups'
  },
  {
    icon: 'material-symbols-light:warning-outline',
    title: 'Qarzdorlar',
    color: 'error',
    key: 'debtor_users',
    link: ''
  },
  {
    icon: 'tabler:calendar-stats',
    title: 'Sinov darsida',
    color: 'primary',
    key: 'test_students',
    link: '/students'
  },
  {
    icon: 'fa-solid:chalkboard-teacher',
    title: "O'qituvchilar",
    color: 'success',
    key: 'teacher_count',
    link: '/mentors'
  }
]

export const fetchStatistics = createAsyncThunk('dashboard/fetchStatistics', async () => {
  const response = await api.get('common/dashboard/statistic-list/')
  return response.data
})

export const fetchLessons = createAsyncThunk('dashboard/fetchLessons', async (queryWeeks: string[]) => {
  const queryString = new URLSearchParams({
    day_of_week: queryWeeks.toString()
  }).toString()

  const response = await api.get(`common/dashboard/?` + queryString)
  return response.data.room_list
})

const initialState: IDashboardState = {
  stats: null,
  open: null,
  isLessonLoading: false,
  isStatsLoading: false,
  events: [],
  statsData: statsData,
  tabValue: currentWeek === 'mon' || currentWeek === 'wed' || currentWeek === 'fri' ? '2' : '1',
  weekDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  weeks:
    currentWeek === 'mon' || currentWeek === 'wed' || currentWeek === 'fri'
      ? ['monday', 'wednesday', 'friday']
      : ['tuesday', 'thursday', 'saturday']
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    handleTabValue: (state, action) => {
      state.tabValue = action.payload
    },
    handleOpen: (state, action) => {
      state.open = action.payload
    },
    updateWeeks: (state, action) => {
      state.weeks = action.payload
    },
    handleChangeWeeks: (state, action) => {
      if (state.weeks.includes(action.payload)) {
        state.weeks = state.weeks.filter(day => day !== action.payload)
      } else {
        state.weeks = [...state.weeks, action.payload]
      }
    }
  },

  extraReducers: builder => {
    builder.addCase(fetchStatistics.pending, state => {
      state.isStatsLoading = true
    })
    builder.addCase(fetchStatistics.fulfilled, (state, action) => {
      state.stats = action.payload
      state.isStatsLoading = false
    })
    builder.addCase(fetchStatistics.rejected, state => {
      state.isStatsLoading = false
    })
    builder.addCase(fetchLessons.pending, state => {
      state.isLessonLoading = true
    })
    builder.addCase(fetchLessons.fulfilled, (state, action) => {
      state.events = action.payload
      state.isLessonLoading = false
    })
    builder.addCase(fetchLessons.rejected, state => {
      state.isLessonLoading = false
    })
  }
})

export const { handleTabValue, updateWeeks, handleOpen, handleChangeWeeks } = dashboardSlice.actions
export default dashboardSlice.reducer