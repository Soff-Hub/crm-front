import { GroupType } from 'src/@fake-db/types'
import { ILessonResponse } from './dashboardTypes'
import { TacherItemType } from './mentorsTypes'

export interface MetaTypes {
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
  page?: number,
  limit?: number,
  offset?:string
  status?: string
  teacher?: string
  course?: string
  day_of_week?: string
  is_recovery?: boolean,
  search?: string
}

export interface IFormParams {
  day_of_week?: string
  teacher?: string
  room?: string
}
export interface TeacherSalariesResponse {
  count: number
  next: string | null
  previous: string | null
  results: {
    bonus_amount: string
    checked_date: string
    fine_amount: string
    date: string
    prepayment: string
    salary: string
    updated_salary: number
  }[]
}

export interface IGroupsState {
  roomsData:any,
  teachersData:TacherItemType[]|null,
  isTableLoading: boolean
  isOpenEdit: boolean
  isChangeBranchEdit:boolean,
  isUpdatingDashboard: boolean
  dashboardLessons: ILessonResponse[]
  workTime: string[]
  exclude_time: any
  isOpenAddGroup: boolean
  groups: GroupType[] | null
  groupChecklist: GroupType[] | null
  rooms: MetaTypes[] | null
  courses: MetaTypes[] | null
  teachers: TeacherType[] | null
  teacherSalaries: TeacherSalariesResponse | null
  groupData: GroupType | null
  groupCount: number
  queryParams: IQueryParams
  myGroupParams: IQueryParams
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
