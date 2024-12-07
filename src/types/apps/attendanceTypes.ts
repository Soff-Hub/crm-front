export interface AttendanceQueryType {
  branch: string
  teacher: string
  date: string
  date_year: string
  date_month: string
  status: string
}

export interface AttendanceInitialType {
  attandance: []
  queryParams: AttendanceQueryType
  isLoading: boolean
  error: string
}
