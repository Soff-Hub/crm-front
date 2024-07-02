import { StudentDetailType } from 'src/types/apps/studentsTypes'
import { BranchTypes } from 'src/hooks/useRooms'
import { TeacherType } from 'src/hooks/useTeachers'
import { SmsItemType } from './settings'

type ActionTypes = 'delete' | 'send-sms' | 'add-student' | 'notes' | 'edit'

export interface IGroupDetailsState {
  groupData: null | any
  days: null | any
  openEdit: null | ActionTypes
  isGettingGroupDetails: boolean
  isGettingAttendance: boolean
  isGettingStudents: boolean
  rooms: BranchTypes[] | null
  teachers: TeacherType[] | null
  students: StudentDetailType[] | null
  attendance: any
  courses: BranchTypes[] | null
  queryParams: {
    status: 'active,new' | 'archive'
  }
  studentsQueryParams: {
    status: 'active,new' | 'archive'
  }
  smsTemps: SmsItemType[] | null
}
