import { ThemeColor } from 'src/@core/layouts/types'

export interface DashboardStats {
  teacher_count: number
  test_students: number
  active_students: number
  active_groups: number
  debtor_users: number
  leads_count: number
}

export interface IDashboardState {
  stats: null | DashboardStats
  tabValue: string
  open: string | null
  isStatsLoading: boolean
  isLessonLoading: boolean
  events: ILessonResponse[]
  weeks: string[]
  workTime: string[]
  weekDays: string[]
  statsData: StatsDataType[]
}

export interface ILessonResponse {
  room_id: number
  room_name: string
  lessons: ILessonType[]
}

export interface ILessonType {
  id: number
  name: string
  course_name: string
  teacher_name: string
  room_name: string
  start_date: string
  end_date: string
  start_at: string
  end_at: string
  student_count: number
  week_days: string
  month_duration: number
  color: string
}
export type StatsDataType = {
  icon: string
  title: string
  color: ThemeColor
  key: string
  link: string
}
