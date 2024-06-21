

export interface TacherItemType {
  id?: number
  first_name: string
  phone: string
  gender: "male" | 'female'
  roles_list?: string[]
  birth_date: null | string
}

export interface IMentorsState {
  openEdit: 'edit' | 'create' | 'delete' | null,
  teachers: TacherItemType[]
  teachersCount: number
  teacherData: UpdateTeacherDto | null
  isLoading: boolean
}

export interface CreateTeacherDto extends TacherItemType {
  password: string | null
  image: string | null
}

export interface TeacherDetailType {
  id: 1,
  first_name: string,
  birth_date: string,
  password: string,
  branches: {
    id: number,
    name: string,
    exists: boolean
  }[],
  gender: 'male' | 'female',
  phone: string,
  roles?: {
    id: number,
    name: string,
    exists: boolean
  }[],
  image: string | null,
  _groups: any[]
}


export interface UpdateTeacherDto {
  id: number,
  first_name: string,
  birth_date: string,
  password: string,
  branches: number[],
  gender: 'male' | 'female',
  phone: string,
  roles: number[],
  image: string | null,
}

