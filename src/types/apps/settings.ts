import { genderTypes } from "./userTypes"

export interface SmsItemType {
    id: number
    description: string
}

export interface RoomType {
    id: number
    name: string
    branch: {
        id: number
        name: string
    },
    is_delete: boolean
}

export interface CourseItemType {
    id: number,
    name: string,
    image: string | null,
    price: number,
    month_duration: number,
    description: string,
    lesson_duration: string,
    lesson_duration_seconds: number,
    color: string,
    is_delete: boolean,
    branch: {
        name: string,
        id: number
    }[],
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
    is_pending: boolean
    sms_list: SmsItemType[]
    openCreateSms: boolean
    openEditSms: null | SmsItemType
    openEditCourse: null | CourseItemType
    course_list: CourseItemType[]
    rooms: RoomType[]
    openEditRoom: null | RoomType,
    room_count: number
    active_page: number
    wekends: WekendItemType[]
    wekendData: WekendItemType | null
    employees: EmployeeItemType[]
    employeeData: any
}