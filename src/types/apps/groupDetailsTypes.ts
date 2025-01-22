import { StudentDetailType } from 'src/types/apps/studentsTypes'
import { BranchTypes } from 'src/hooks/useRooms'
import { TeacherType } from 'src/hooks/useTeachers'
import { SmsItemType } from './settings'

type ActionTypes = 'delete' | 'send-sms' | 'add-student' | 'notes' | 'edit' | 'online-lesson'

export interface IGroupDetailsState {
  groupData: null | any
  gradeQueryParams: any,
  updateStatusModal: any,
  onlineLessonLoading:boolean,
  meet_link:string|null,
  days: null | any
  exams: null | any
  open: 'add' | 'edit' | 'delete' | 'result' | null
  openEdit: null | ActionTypes
  isGettingGroupDetails: boolean
  isGettingExams: boolean
  isGettingDays: boolean
  isGettingAttendance: boolean
  isGettingStudents: boolean
  isGettingExamsResults: boolean
  openLeadModal: any
  isOpenDelete: any
  rooms: BranchTypes[] | null
  teachers: TeacherType[] | null
  students: StudentDetailType[] | null
  attendance: any
  grades:any
  results: any
  isGettingGrades:boolean,
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
  month_list: {
    month: string
    date: string
  }[]
  isLesson: boolean
}
