import { genderTypes } from './userTypes'

export interface SmsItemType {
  id: number
  description: string
  parent: number
}

export interface RoomType {
  id: number
  name: string
  branch: {
    id: number
    name: string
  }
  is_delete: boolean
}

export interface CourseItemType {
  id: number
  name: string
  image: string | null
  price: number
  month_duration: number
  description: string
  lesson_duration: string
  lesson_duration_seconds: number
  color: string
  text_color?: string
  is_delete: boolean
  branch: {
    name: string
    id: number
  }[]
  lesson_count?: number
}

export interface WekendItemType {
  id: number
  date: string
  description: string
}

export interface EmployeeItemType {
  id: number
  first_name: string
  phone: string
  gender: genderTypes
  roles_list: string[]
  birth_date: string | null
  employee_salary: number
}

export interface SettingsState {
  employee_id: number | null
  schools: any
  openEditSchool:any,
  school_count: number
  schoolQueryParams: { search?: string; page?: number }
  isGettingSchools: boolean
  openSms: string | null
  is_pending: boolean
  is_childpending: boolean
  smschild_list: SmsItemType[]
  openCreateSmsCategory: boolean
  sms_list: SmsItemType[]
  openCreateSms: boolean
  openEditSms: null | SmsItemType
  openEditCourse: null | CourseItemType
  course_list: {
    count: number
    results: CourseItemType[]
    is_lesson_count?: boolean
  }
  rooms: RoomType[]
  openEditRoom: null | RoomType
  room_count: number
  active_page: number
  wekends: WekendItemType[]
  wekendData: WekendItemType | null
  employees: EmployeeItemType[]
  employees_count: number
  employeeData: any
  queryParams: { search: string; page: number; role: number | string; status: string }
  courseQueryParams: { page: number }
  roles: { name: string; id: number; count: number }[]
  videoAnchor: {
    open: boolean
    title: string
    url: string
  }
}
