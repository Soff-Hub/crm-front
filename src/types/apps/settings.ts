export interface SmsItemType {
    id: number
    description: string
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
    }[]
}

export interface SettingsState {
    is_pending: boolean
    sms_list: SmsItemType[]
    openCreateSms: boolean
    openEditSms: null | SmsItemType
    openEditCourse: null | CourseItemType
    course_list: CourseItemType[]
}
