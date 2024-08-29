export type DepartmentType = {
  id: number
  name: string
  parent: null | string
  order: number
  branch: number
  children: {
    id: number
    name: string
    student_count: number
    order: number
    is_active: boolean
  }[]
  is_active: boolean
  transfer: boolean
}

export type DepartmentListType = DepartmentType[]

export interface LeadsQueryParamsTypes {
  search: string
  is_active: boolean
}

export interface ILeadsState {
  leadData: DepartmentListType
  sourceData: []
  open: 'add-department' | null
  openItem: null
  openLid: any
  sectionId: any
  addSource: boolean
  loading: boolean
  search: string
  queryParams: LeadsQueryParamsTypes
  openActionModal: 'delete' | string | number | null
  bigLoader: boolean
  actionId: number | string
}

export interface CreateDepartmentUser {
  id: number
  first_name?: string
  phone?: string
  department?: string | number
  source_name?: string | number
  body?: string
}

export interface CreatesDepartmentState {
  name: string
  order?: number
}
