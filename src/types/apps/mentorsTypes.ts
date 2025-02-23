export interface TacherItemType {
  id?: number
  first_name: string
  phone: string
  gender: 'male' | 'female'
  roles_list?: string[]
  birth_date: null | string
  activated_at: null | string
  image?: null | string
}

export interface IMentorsState {
  openSms:boolean
  openEdit: 'edit' | 'create' | 'delete' | null
  teachers: TacherItemType[]
  teachersCount: number
  teacherData: UpdateTeacherDto | null
  isLoading: boolean
  queryParams: { page: number; status: string }
}

export interface CreateTeacherDto extends TacherItemType {
  password: string | null
  image: string | null
  is_fixed_salary: boolean
  percentage: string | null
  amount: string | null
}

export interface TeacherDetailType {
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
  roles?: {
    id: number
    name: string
    exists: boolean
  }[]
  image: string | null
  _groups: any[]
}

export interface UpdateTeacherDto {
  id?: number
  lesson_amount?:number,
  first_name: string
  birth_date: string
  activated_at: string
  password: string
  branches?: number[]
  gender: 'male' | 'female'
  phone: string
  roles?: number[]
  image: string | null
  amount: string | null
  percentage: string | null
  is_fixed_salary: boolean
}
