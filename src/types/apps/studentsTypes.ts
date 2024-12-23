import { genderTypes } from './userTypes'

export interface StudentListItemType {
  id?: number
  first_name: string
  phone: string
  gender: genderTypes
  birth_date: null | string
  balance: string | number
  payment_status: number
  status: 'active' | 'archive' | 'new'
  group: {
    id: number
    group_data: {
      id: number
      name: string
    }
    start_at: string
    course_name: string
    date: string
    teacher: {
      id: number
      first_name: string
      phone: string
    }
    student_status: {
      id: 22
      group: 11
      status: 'new'
      group_name: 'G-2'
      lesson_time: '11:00-13:00'
    }[]
  }[]
}

export type StudentsListType = StudentListItemType[]

export interface StudentItemType {
  id?: number
  first_name: string
  phone: string
  gender: genderTypes
  birth_date: null | string
}

export interface CreateStudentDto extends StudentItemType {
  password?: string | null
  group?: number | string
  start_at?: string
}

export interface UpdateStudentDto extends StudentItemType {
  password?: string | null
  parent_data?: { id?: number; first_name: string; phone: string } | null
}

export interface IStudentState {
  openEdit: 'edit' | 'create' | 'delete' | null
  students: StudentsListType
  studentsCount: number
  studentData: (StudentDetailType | null) | StudentDetailType
  isLoading: boolean
  queryParams: StudentsQueryParamsTypes
  groups: any[]
  payments: any[]
  global_pay: boolean
}

export interface StudentDetailType {
  id: number
  first_name: string
  birth_date: string
  balance: string
  phone: string
  gender: genderTypes
  created_at: string
  parent_data: any[] | null
  roles_list: any[]
  branches: {
    id: number
    name: string
    exists: boolean
  }[]
  groups: {
    id: number
    group_data: {
      id: number
      name: string
    }
    start_at: string
    date: string
    teacher: {
      id: number
      first_name: string
      phone: string
    }
    course: {
      id: 4
      name: string
      price: number
      lesson_duration: string
    }
  }[]
  comments: any[]
  sms: any[]
}

export interface StudentsQueryParamsTypes {
  search?: string,
  limit?:string,
  offset?:string,
  course?: number | null
  status?: string | any
  page?: string
  is_debtor?: any
  last_payment?: any
  group_status?: '' | 'new' | 'frozen' | 'active' | 'archive'
}
