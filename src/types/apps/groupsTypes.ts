import { GroupType } from 'src/@fake-db/types'
import { ILessonResponse } from './dashboardTypes'

interface MetaTypes {
  id: string
  name: string
}
export interface TeacherType {
  id: 1
  first_name: string
  birth_date: string
  password: string
  branches: {
    id: number
    name: string
    exists: boolean
  }[]
  gender: 'male' | 'female'
  phone: string
  roles: {
    id: number
    name: string
    exists: boolean
  }[]
  image: string | null
  _groups: any[]
}

export interface IQueryParams {
  page: number
  status?: string
  teacher?: string
  course?: string
  day_of_week?: string,
  is_recovery?: boolean
}

export interface IFormParams {
  day_of_week?: string
  teacher?: string
  room?: string
}

export interface IGroupsState {
  isOpenEdit: boolean
  isUpdatingDashboard: boolean
  dashboardLessons: ILessonResponse[]
  workTime: string[]
  exclude_time: any
  isOpenAddGroup: boolean
  groups: GroupType[] | null
  rooms: MetaTypes[] | null
  courses: MetaTypes[] | null
  teachers: TeacherType[] | null
  groupData: GroupType | null
  groupCount: number
  queryParams: IQueryParams
  formParams: IFormParams
  isDeleting: boolean
  isGettingGroupDetails: boolean
  isLoading: boolean
  initialValues: GroupFormInitialValue
}
export interface GroupFormInitialValue {
  name: string
  course: string
  teacher: string
  room: string
  start_date: string
  start_at: string
  day_of_week: string | string[]
  end_at: string
}
