import { genderTypes } from "./userTypes"


export interface StudentListItemType {
    id: number
    first_name: string
    phone: string
    birth_date: string
    gender: genderTypes
    balance: string
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
}


export interface IStudentState {
    openEdit: 'edit' | 'create' | 'delete' | null,
    students: StudentItemType[]
    studentsCount: number
    studentData: StudentDetailType | UpdateStudentDto | null
    isLoading: boolean
    queryParams: StudentsQueryParamsTypes,
    payments: any[]
}

export interface StudentDetailType {
    id: number
    first_name: string
    birth_date: string
    balance: string
    phone: string
    gender: genderTypes
    created_at: string
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
    search?: string
    course?: number | null
    status?: string
    page?: number
}
