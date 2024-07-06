import { StudentDetailType } from 'src/types/apps/studentsTypes'
import { BranchTypes } from 'src/hooks/useRooms'
import { TeacherType } from 'src/hooks/useTeachers'
import { SmsItemType } from './settings'

type ActionTypes = 'delete' | 'send-sms' | 'add-student' | 'notes' | 'edit'

export interface IGroupDetailsState {
  groupData: null | any
  days: null | any
  exams: null | any
  open: 'add' | 'edit' | 'delete' | 'result' | null
  openEdit: null | ActionTypes
  isGettingGroupDetails: boolean
  isGettingExams: boolean
  isGettingAttendance: boolean
  isGettingStudents: boolean
  isGettingExamsResults: boolean
  isOpenDelete: any
  rooms: BranchTypes[] | null
  teachers: TeacherType[] | null
  students: StudentDetailType[] | null
  attendance: any
  results: any
  examStudentId: any
  editData: any
  resultId: any
  courses: BranchTypes[] | null
  queryParams: {
    status: 'active,new' | 'archive'
  }
  studentsQueryParams: {
    status: 'active,new' | 'archive'
  }
  smsTemps: SmsItemType[] | null
}
