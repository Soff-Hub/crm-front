const ceoConfigs = {
  employee: 'employee/list/',
  employee_detail: 'employee/detail/',
  employee_create: 'employee/create/',
  employee_update: 'employee/update/',
  employee_delete: 'employee/delete/',
  employee_salaries: "employee/salaries/",
  update_employee_status: 'employee/update/status/',
  employee_checklist:'employee/check-list/',
  courses: 'common/courses/',
  courses_posts: 'common/course/create',
  courses_delete: 'common/course/delete',
  courses_update: 'common/course/update',
  courses_detail: 'common/course/detail',
  employee_attendances:'employee/attendances/',

  barnchs: 'common/branches/',
  parents_checklist : 'employee/parents-check-list/',
  teachers: 'employee/teachers/',
  teachers_update: 'employee/teachers/update/',

  create_teacher:'employee/create/teacher/',
  rooms_posts: 'common/room/create',
  rooms_update: 'common/room/update',
  rooms: 'common/rooms/',
  rooms_detail: 'common/room/detail',
  rooms_delete: 'common/room/delete',

  groups: 'common/groups/',
  groups_detail: 'common/group/detail/',
  groups_create: 'common/group-create/',
  groups_update: 'common/group/update/',
  groups_updateStatus: 'common/group/update/status/',
  merge_student: 'common/group-student-create/',
  group_short_list: 'common/group-check-list/?branch=',

  students: 'student/list/',
  students_detail: 'student/detail/',
  students_update: 'student/update/',
  students_create: 'student/create/',
  students_delete: 'auth/student-destroy/',

  attendances: 'common/attendance-report/'
}

export default ceoConfigs
